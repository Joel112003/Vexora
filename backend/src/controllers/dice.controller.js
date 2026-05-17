import { rollDice } from "../services/dice.service";
import { placeBet } from "../services/game.service";
import { apiResponse } from "../utilis/apiResponse";

export const playDice = async (req, res) => {
  try {
  } catch (error) {
    res.status(401).json(apiResponse(false, error.message));
  }
};
