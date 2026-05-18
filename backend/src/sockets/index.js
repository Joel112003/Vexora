import { Server } from "socket.io";
import {
  activeCrashBets,
  currentCrashPoints,
  gamePhase,
  currentMultiplier,
  setCurrentCrashPoint,
  setCurrentMultiplier,
  setGamePhase,
} from "../controllers/crash.controller.js";

import {
  generateCrashPoints,
  formatMultiplier,
} from "../services/crash.service.js";
import { placeBet } from "../services/game.service.js";
import { promise } from "zod";
import { pl } from "zod/v4/locales";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  //socket connection handler - runs every times when a user connects
  io.on("connection", (socket) => {
    console.log(`Client connected : ${socket.id}`);
    socket.emit("crash:state", {
      phase: gamePhase,
      multiplier: currentMultiplier,
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected : ${socket.id}`);
    });
  });

  const runCrashLoop = async () => {
    while (true) {
      //generate crash points for this round before anyone bet
      setCurrentCrashPoint(generateCrashPoints());
      setGamePhase("waiting");
      setCurrentCrashPoint(1.0);

      // tell the user new round is starting
      io.emit("crash:waiting", {
        message: "Place your bets",
        countdown: 5,
      });

      // wait 5 sec for user to place a bet
      await sleep(5000);

      setGamePhase("running");
      setCurrentMultiplier(1.0);

      io.emit("crash:start", { message: "Game started!" });

      //multiplier climbs until its hits the crash points
      await new Promise((resolve) => {
        const interval = setInterval(async () => {
          // increase the multi every 100ms
          const next = formatMultiplier(currentMultiplier * 1.03);
          setCurrentMultiplier(next);

          //check all active bets for cashout
          for (const [userId, bet] of activeCrashBets.entries()) {
            if (
              !bet.cashedOut &&
              bet.autoCashout &&
              currentMultiplier >= bet.autoCashout
            ) {
              bet.autoCashout = true;
              const multiplier = formatMultiplier(currentMultiplier);
              const payout = parseFloat(
                (bet.betAmount * multiplier).toFixed(2),
              );
              try {
                await placeBet({
                  userId: bet.userId,
                  gameType: "crash",
                  betAmount: bet.betAmount,
                  multiplier,
                  payout,
                  outcome: "win",
                  gameData: {
                    crashPoints: currentCrashPoints,
                    crashedOutAt: multiplier,
                    autocashout: true,
                  },
                });
                io.emit(`crash:autocashout:${userId}`, { multiplier, payout });
              } catch (err) {
                console.error("Auto-cashout error : ", err.message);
              }
            }
          }

          // show current multi to every user in the game
          io.emit("crash:tick", { multiplier: currentMultiplier });

          //check if the hit point is crash
          if (currentMultiplier >= currentCrashPoints) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      setGamePhase("crashed");
      // tell everyone the games has crashed adn at what multi
      io.emit("crash:crashed", {
        crashPoints: currentCrashPoints,
        message: `Crashed at ${currentCrashPoints}x`,
      });

      //save the losses who didn't cashout on time
      for (const [userId, bet] of activeCrashBets.entries()) {
        if (!bet.cashedout) {
          try {
            await placeBet({
              userId: bet.userId,
              gameType: "crash",
              betAmount: bet.betAmount,
              multiplier: 0,
              payout: 0,
              outcome: "loss",
              gameData: {
                crashPoints: currentCrashPoints,
                crashedOutAt: null,
              },
            });
          } catch (err) {
            console.error("Loss save error:", err.message);
          }
        }
      }
      //clear all the bets for this round
      activeCrashBets.clear();

      //wait for 3 sec for starting next or new round
      await sleep(3000);
    }
  };
  // starts the loop and never stops
  runCrashLoop().catch(console.error);

  return io;
};

// pauses the execution for a milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
