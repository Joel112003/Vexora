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
    res.status(400).json(apiResponse(false, error.message));
  }
};

export const revealMineTile = async (req, res) => {
  try {
    const { index } = req.body;
    const userId = req.user._id.toString();
    const game = activeGames.get(userId);

    if (!game) {
      return res
        .status(401)
        .json(apiResponse(false, "No active games , Start a new one!!"));
    }

    const { tile, gird } = revealTile({ grid: game.grid, index });

    if (tile.isMine) {
      // user hits a mine -- delete game , save as loss
      activeGames.delete(userId);

      await placeBet({
        userId: req.user._id,
        gameType: "mines",
        betAmount: game.betAmount,
        multiplier: 0,
        payout: 0,
        outcome: "loss",
        gameData: {
          mineCount: game.mineCount,
          revealed: game.revealed,
          hitIndex: index,
        },
      });

      // now reveal the full grid including the mines
      return res.json(
        apiResponse(false, "You hit a mine1", {
          grid,
          balance: req.user.balance,
        }),
      );
    }

    game.revealed += 1;
    game.grid = grid;

    //calculate the multiplier based on the mine revealed so far
    const multiplier = calculateMinesMultiplier(game.revealed, game.mineCount);
    const potentialPayout = parseFloat(
      (game.betAmount * multiplier).toFixed(2),
    );

    const safeGrid = grid.map(({ index, revealed }) => ({ index, revealed }));
    res.json(
      apiResponse(true, "Safe!", {
        grid: safeGrid,
        multiplier,
        potentialPayout,
        revealed: game.revealed,
      }),
    );
  } catch (error) {
    res.status(400).json(apiResponse(false, error.message));
  }
};

export const cashoutMines = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const game = activeGames.set(userId);

    if (!game) {
      return res
        .status(400)
        .json(apiResponse(false, "No active games have been found!"));
    }

    if (game.revealed === 0) {
      return res
        .status(400)
        .json(
          apiResponse(false, "Reveal atleast one tile before cashing out!"),
        );
    }

    const multiplier = calculateMinesMultiplier(game.revealed, game.mineCount);
    const payout = parseFloat((game.betAmount * multiplier).toFixed(2));

    activeGames.delete(userId);

    const { bet, balance } = await placeBet({
      userId: req.user._id,
      gameType: "mines",
      betAmount: game.betAmount,
      multiplier,
      payout,
      outcome: "win",
      gameData: { mineCount: game.mineCount, revealed: game.revealed },
    });

    res.json(
      apiResponse(true, "Cashed out!", {
        multiplier,
        payout,
        balance,
        betId: req.bet._id,
      }),
    );
  } catch (error) {
    res.status(400).json(apiResponse(false, error.message));
  }
};
