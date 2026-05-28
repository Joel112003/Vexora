import { coinFlip } from "../services/coinflip.service.js";
import { apiResponse } from "../utilis/apiResponse.js";
import { placeBet } from "../services/game.service.js";
import { Game } from "../models/index.js";

export const playCoinFlip = async (req, res) => {
  try {
    const { betAmount, choice } = req.body;

    const result = coinFlip({ betAmount, choice });

    const game = await Game.findOne({ type: "coinflip" });
    if (!game) {
      return res.status(400).json(apiResponse(false, "Game not found"));
    }

    const { bet, balance } = await placeBet({
      userId: req.user._id,
      gameId: game._id,
      gameType: "coinflip",
      betAmount,
      multiplier: result.multiplier,
      payout: result.payout,
      outcome: result.win ? "win" : "loss",
      gameData: {
        result: result.result,
        choice,
      },
    });

    res.json(
      apiResponse(true, result.win ? "You win" : "You lose", {
        result,
        balance,
        betId: bet._id,
      }),
    );
  } catch (error) {
    res.status(400).json(apiResponse(false, error.message));
  }
};
