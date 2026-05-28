import { rollDice } from "../services/dice.service.js";
import { placeBet } from "../services/game.service.js";
import { apiResponse } from "../utilis/apiResponse.js";

export const playDice = async (req, res) => {
  try {
    const { betAmount, target, direction } = req.body;
    if (!["over", "under"].includes(direction)) {
      return res
        .status(400)
        .json(apiResponse(false, "Direction must over or under 1"));
    }

    if (target < 2 || target > 98) {
      return res
        .status(400)
        .json(apiResponse(false, "Target must be between 2 and 98."));
    }
    const result = rollDice({ betAmount, direction, target });

    const { bet, balance } = await placeBet({
      userId: req.user._id,
      gameType: "dice",
      betAmount,
      multiplier: result.multiplier,
      payout: result.payout,
      outcome: result.win ? "win" : "loss",
      gameData: { roll: result.roll, target, direction },
    });

    res.json(
      apiResponse(true, result.win ? "You win" : "You lost!", {
        result,
        balance,
        betId: bet._id,
      }),
    );
  } catch (error) {
    res.status(400).json(apiResponse(false, error.message));
  }
};
