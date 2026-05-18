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
};

// pauses the execution for a milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
