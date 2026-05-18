import { placeBet } from "../services/game.service";
import { apiResponse } from "../utilis/apiResponse";
import {
  createMineGames,
  calculateMinesMultiplier,
  revealTile,
} from "../services/mines.service";

const activeGames = new Map();

export const startMines = async (req, res) => {
  try {
    const { betAmount, mineCount } = req.body;

    //create grid with random mine positions
    const grid = createMineGames(mineCount);

    //save the game stats for the user
    activeGames.set(req.user._id.toString(), {
      grid,
      mineCount,
      betAmount,
      revealed: 0, //revealed how many safe tiles are revealed so farrr..
    });

    const safeGrid = grid.map(({ index, revealed }) => ({ index, revealed }));

    res.json(
      apiResponse(true, "Mine game has started!", {
        grid: safeGrid,
        betAmount,
        mineCount,
      }),
    );
  } catch (error) {
    res.status(401).json(apiResponse(false, error.message));
  }
};

export const revealMineTile = async (req, res) => {
  try {
  } catch (error) {
    res.status(401).json(apiResponse(false, error.message));
  }
};
