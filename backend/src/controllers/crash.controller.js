import {
  formatMultiplier,
  generateCrashPoints,
} from "../services/crash.service.js";
import { placeBet } from "../services/game.service.js";
import { apiResponse } from "../utilis/apiResponse.js";

export let activeCrashBets = new Map();
export let currentCrashPoints = generateCrashPoints();
export let gamePhase = " waiting";
export let currentMultiplier = 1.0;

export const setGamePhase = (v) => {
  gamePhase(v);
};
export const setCurrentMultiplier = (v) => {
  currentMultiplier(v);
};

export const setCurrentCrashPoint = (v) => {
  currentCrashPoints(v);
};

export const getState = (req, res) => {
  res.json(
    apiResponse(true, "Crash state", {
      phase: gamePhase,
      multiplier: currentMultiplier,
    }),
  );
};

export const placeCrashBet = async (req, res) => {
  try {

    
  } catch (error) {
    res.status(400).json(apiResponse(false, error.message));
  }
};
