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
import { Game } from "../models/index.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Send current game state immediately on connection
    socket.emit("crash:state", {
      phase: gamePhase,
      multiplier: currentMultiplier,
    });

    // Client can request a resync (e.g. after StrictMode remount)
    socket.on("crash:sync", () => {
      socket.emit("crash:state", {
        phase: gamePhase,
        multiplier: currentMultiplier,
      });
    });

    socket.on("disconnect", () => {});
  });

  const runCrashLoop = async () => {
    // Look up the crash game document once — reused for every bet record
    const crashGame = await Game.findOne({ type: "crash" });
    if (!crashGame) throw new Error("Crash game not found in DB. Run your seed script.");
    const crashGameId = crashGame._id;

    while (true) {
      setCurrentCrashPoint(generateCrashPoints());
      setGamePhase('waiting');
      setCurrentMultiplier(1.0);

      // Emit countdown ticks every second so the frontend updates in real-time
      const WAIT_SECONDS = 5;
      for (let t = WAIT_SECONDS; t > 0; t--) {
        io.emit("crash:waiting", { countdown: t });
        await sleep(1000);
      }

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
              bet.cashedOut = true;
              const multiplier = formatMultiplier(currentMultiplier);
              const payout = parseFloat(
                (bet.betAmount * multiplier).toFixed(2),
              );
              try {
                await placeBet({
                  userId: bet.userId,
                  gameId: crashGameId,
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
        crashPoint: currentCrashPoints,
        message: `Crashed at ${currentCrashPoints}x`,
      });

      for (const [userId, bet] of activeCrashBets.entries()) {
        if (!bet.cashedOut) {
          try {
            await placeBet({
              userId: bet.userId,
              gameId: crashGameId,
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
