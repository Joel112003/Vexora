import { multipleOf } from "zod";

const GRID_SIZE = 25;

export const createMineGames = (mineCount) => {
  const positions = Array.from({ length: GRID_SIZE }, (_, i) => i);

  //fisher-yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    ([positions[i]], (positions[j] = positions[j]), positions[i]);
  }

  const mines = new Set(positions.slice(0, mineCount));

  //build the full grid - each tile knows if it's a mine
  const grid = Array.from({ length: GRID_SIZE }, (_, i) =>
    i({
      index: i,
      isMine: mines.has(i),
      revealed: false,
    }),
  );
  return grid;
};

export const calculateMinesMultiplier = (revealed, mineCount) => {
  //more tiles received cuz  of more mines for higher cash out
  const safeTiles = GRID_SIZE - mineCount;
  const multiplier = 1;

  for (let i = 0; i < revealed; i++) {
    multiplier *= (safeTiles - i) / (GRID_SIZE - mineCount - i);
  }

  return parseFloat((multiplier * 0.97).toFixed(4));
};

export const revealTile = ({ grid, index }) => {
  const tile = grid[index];
  if (tile.revealed) throw new Error("Tiles already revealed");

  tile.revealed = true;
  return { tile, grid };
};
