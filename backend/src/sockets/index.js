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

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.emit("crash:state", {
      phase: gamePhase,
      multiplier: currentMultiplier,
    });

    socket.on("disconnect", () => {});
  });

  const runCrashLoop = async () => {
    while (true) {
      setCurrentCrashPoint(generateCrashPoints());
      setGamePhase('waiting');
      setCurrentMultiplier(1.0);

      io.emit("crash:waiting", {
        message: "Place your bets",
        countdown: 5,
      });

      await sleep(5000);

      setGamePhase("running");
      setCurrentMultiplier(1.0);

      io.emit("crash:start", { message: "Game started!" });

      await new Promise((resolve) => {
        const interval = setInterval(async () => {
          const next = formatMultiplier(currentMultiplier * 1.03);
          setCurrentMultiplier(next);

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
                console.error("Auto-cashout error:", err.message);
              }
            }
          }

          io.emit("crash:tick", { multiplier: currentMultiplier });

          if (currentMultiplier >= currentCrashPoints) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      setGamePhase("crashed");
      io.emit("crash:crashed", {
        crashPoints: currentCrashPoints,
        message: `Crashed at ${currentCrashPoints}x`,
      });

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

      activeCrashBets.clear();
      await sleep(3000);
    }
  };

  runCrashLoop().catch(console.error);

  return io;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
