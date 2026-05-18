import { coinFlip } from "../services/coinflip.service.js";
import { apiResponse } from "../utilis/apiResponse.js";
import { placeBet } from "../services/game.service.js";

export const playCoinFlip = async (req, res) => {
  try {
    const { betAmount, choice } = req.body;

    const result = coinFlip({ betAmount, choice });

    const { bet, balance } = await placeBet({
      userId: user._id,
      gameType: "coinFlip",
      betAmount,
      multiplier: result.multiplier,
      payout: result.payout,
      outcome: result.win ? "win" : "lose",
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
