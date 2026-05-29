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
    ({
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
  let multiplier = 1;
  let probability = 1;

  for (let i = 0; i < revealed; i++) {
    probability *= (safeTiles - i) / (GRID_SIZE - i);
  }

  multiplier = (1 / probability) * 0.97;
  return parseFloat(multiplier.toFixed(4));
};

export const revealTile = ({ grid, index }) => {
  const tile = grid[index];
  if (tile.revealed) throw new Error("Tiles already revealed");

  tile.revealed = true;
  return { tile, grid };
};
