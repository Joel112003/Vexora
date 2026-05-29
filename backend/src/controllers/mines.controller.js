import { placeBet } from "../services/game.service.js";
import { apiResponse } from "../utilis/apiResponse.js";
import {
  createMineGames,
  calculateMinesMultiplier,
  revealTile,
} from "../services/mines.service.js";
import { deleteMinesGame, saveMinesGame, getMinesGame } from "../cache/index.js";
import { Game } from "../models/index.js";

export const startMines = async (req, res) => {
  try {
    const { betAmount, mineCount } = req.body;

    const game = await Game.findOne({ type: "mines" });
    if (!game) {
      return res.status(400).json(apiResponse(false, "Game not found"));
    }

    //create grid with random mine positions
    const grid = createMineGames(mineCount);

    // Save game data in Redis so it doesn't reset after server restart and can be used by all servers.
    await saveMinesGame(req.user._id.toString(), {
      grid,
      gameId: game._id,
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
    const game = await getMinesGame(userId);

    if (!game) {
      return res
        .status(401)
        .json(apiResponse(false, "No active games , Start a new one!!"));
    }

    const currentTile = game.grid[index];
    if (currentTile.revealed) {
      throw new Error("Tiles already revealed");
    }

    if (currentTile.isMine && game.revealed === 0) {
      const swapIndex = game.grid.findIndex((tile) => !tile.isMine);
      if (swapIndex !== -1) {
        game.grid[swapIndex].isMine = true;
        currentTile.isMine = false;
      }
    }

    const { tile, grid } = revealTile({ grid: game.grid, index });

    if (tile.isMine) {
      //delete from redis - game is over.
      await deleteMinesGame(userId);

      const { balance } = await placeBet({
        userId: req.user._id,
        gameId: game.gameId,
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
          balance,
        }),
      );
    }

    //updated the game state in redis with new revealed count and grid
    game.revealed += 1;
    game.grid = grid;
    await saveMinesGame(userId, game);

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
    const game = await getMinesGame(userId);

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
    
    // delete from Redis before saving bet
    await deleteMinesGame(userId);

    const { bet, balance } = await placeBet({
      userId: req.user._id,
      gameId: game.gameId,
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
        betId: bet._id,
      }),
    );
  } catch (error) {
    res.status(400).json(apiResponse(false, error.message));
  }
};
