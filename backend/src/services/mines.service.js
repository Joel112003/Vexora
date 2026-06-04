const GRID_SIZE = 25;

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

export const createMineGames = (mineCount) => {
  const positions = Array.from({ length: GRID_SIZE }, (_, i) => i);
  shuffle(positions);

  const mines = new Set(positions.slice(0, mineCount));

  return Array.from({ length: GRID_SIZE }, (_, i) => ({
    index: i,
    isMine: mines.has(i),
    revealed: false,
  }));
};

export const calculateMinesMultiplier = (revealed, mineCount) => {
  const safeTiles = GRID_SIZE - mineCount;
  let probability = 1;

  for (let i = 0; i < revealed; i++) {
    probability *= (safeTiles - i) / (GRID_SIZE - i);
  }

  const multiplier = (1 / probability) * 0.97;
  return parseFloat(multiplier.toFixed(4));
};

export const revealTile = ({ grid, index }) => {
  const cloned = grid.map((t) => ({ ...t }));
  const tile = cloned[index];

  if (tile.revealed) throw new Error("Tiles already revealed");

  tile.revealed = true;
  return { tile, grid: cloned };
};

export const buildSafeGrid = (grid) =>
  grid.map(({ index, revealed }) => ({ index, revealed }));

export const revealAllMines = (grid) =>
  grid.map((t) => (t.isMine ? { ...t, revealed: true } : { ...t }));
