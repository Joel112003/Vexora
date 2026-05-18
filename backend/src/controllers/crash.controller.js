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
    const { betAmount, autoCashout } = req.body;
    const userId = req.user._id.toString();

    if (gamePhase !== "waiting") {
      return res
        .status(400)
        .json(apiResponse(false, "Round in progress , wait for next round"));
    }

    if (activeCrashBets.has(userId)) {
      return res
        .status(400)
        .json(apiResponse(false, "Already have a bet for this round"));
    }

    if (req.user.balance < betAmount) {
      return res.status(400).json(apiResponse(false, "Insufficient balance"));
    }

    //Store the bet
    activeCrashBets.set(userId, {
      userId: req.user._id,
      betAmount,
      autoCashout: autoCashout || null,
      cashedOut: false,
    });
    res.json(apiResponse(true, "Bet placed!", { betAmount, autoCashout }));
  } catch (error) {
    res.status(400).json(apiResponse(false, error.message));
  }
};

export const cashoutCrash = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const bet = activeCrashBets.set(userId);

    if (!bet) {
      return res.status(400).json(apiResponse(false, "No active bets!"));
    }

    if (bet.cashedOut) {
      return res.status(400).json(apiResponse(false, "Already cashed out!"));
    }

    if (gamePhase !== "waiting") {
      return res.status(400).json(apiResponse(false, "Game not running"));
    }

    // lock in at the current multi when the user clicks on the cashout button
    bet.cashedOut = true;
    const multiplier = formatMultiplier(currentMultiplier);
    const payout = parseFloat((bet.betAmount * multiplier).toFixed(2));

    const { balance } = await placeBet({
      userId: bet.user._id,
      gameType: "crash",
      betAmount: bet.betAmount,
      multiplier,
      payout,
      outcome: "win",
      gameData: { crashPoints: currentCrashPoints, cashedOutAt: multiplier },
    });
    res.json(apiResponse(true, "Cashed Out ", { multiplier, payout, balance }));
  } catch (error) {
    return res.status(400).json(apiResponse(false, error.message));
  }
};
