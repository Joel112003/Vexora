import { placeBet } from "../services/game.service.js";
import { apiResponse } from "../utilis/apiResponse.js";
import {
  createMineGames,
  calculateMinesMultiplier,
  revealTile,
  buildSafeGrid,
  revealAllMines,
} from "../services/mines.service.js";
import { deleteMinesGame, saveMinesGame, getMinesGame } from "../cache/index.js";
import { Game } from "../models/index.js";

const GRID_SIZE = 25;

export const swapFirstTileMine = (grid, index, mineCount) => {
  if (mineCount >= GRID_SIZE - 1) return grid;
  const currentTile = grid[index];
  if (!currentTile.isMine) return grid;

  const swapIndex = grid.findIndex((tile) => !tile.isMine);
  if (swapIndex !== -1) {
    grid[swapIndex] = { ...grid[swapIndex], isMine: true };
    grid[index]     = { ...currentTile, isMine: false };
  }
  return grid;
};

export const formatRevealResponse = ({ safeGrid, multiplier, potentialPayout, revealed }) => ({
  grid: safeGrid,
  multiplier,
  potentialPayout,
  revealed,
});

export const startMines = async (req, res) => {
  try {
    const { betAmount, mineCount } = req.body;

    const game = await Game.findOne({ type: "mines" });
    if (!game) {
      return res.status(400).json(apiResponse(false, "Game not found"));
    }

    const grid = createMineGames(mineCount);

    await saveMinesGame(req.user._id.toString(), {
      grid,
      gameId: game._id,
      mineCount,
      betAmount,
      revealed: 0,
    });

    res.json(
      apiResponse(true, "Mine game has started!", {
        grid: buildSafeGrid(grid),
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
        .json(apiResponse(false, "No active games, start a new one!"));
    }

    const currentTile = game.grid[index];
    if (currentTile.revealed) {
      throw new Error("Tiles already revealed");
    }

    if (game.revealed === 0) {
      game.grid = swapFirstTileMine(game.grid, index, game.mineCount);
    }

    const { tile, grid } = revealTile({ grid: game.grid, index });

    if (tile.isMine) {
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

      return res.json(
        apiResponse(false, "You hit a mine!", {
          grid: revealAllMines(grid),
          balance,
        }),
      );
    }

    game.revealed += 1;
    game.grid = grid;

    const multiplier      = calculateMinesMultiplier(game.revealed, game.mineCount);
    const potentialPayout = parseFloat((game.betAmount * multiplier).toFixed(2));
    const safeTilesTotal  = GRID_SIZE - game.mineCount;

    if (game.revealed === safeTilesTotal) {
      await deleteMinesGame(userId);

      const { bet, balance } = await placeBet({
        userId: req.user._id,
        gameId: game.gameId,
        gameType: "mines",
        betAmount: game.betAmount,
        multiplier,
        payout: potentialPayout,
        outcome: "win",
        gameData: { mineCount: game.mineCount, revealed: game.revealed },
      });

      return res.json(
        apiResponse(true, "All safe tiles revealed! Auto cashout!", {
          grid: buildSafeGrid(grid),
          multiplier,
          potentialPayout,
          revealed: game.revealed,
          autoWin: true,
          balance,
          betId: bet._id,
        }),
      );
    }

    await saveMinesGame(userId, game);

    res.json(
      apiResponse(
        true,
        "Safe!",
        formatRevealResponse({
          safeGrid: buildSafeGrid(grid),
          multiplier,
          potentialPayout,
          revealed: game.revealed,
        }),
      ),
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
        .json(apiResponse(false, "Reveal at least one tile before cashing out!"));
    }

    const multiplier = calculateMinesMultiplier(game.revealed, game.mineCount);
    const payout     = parseFloat((game.betAmount * multiplier).toFixed(2));

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
