import { describe, it, expect } from "@jest/globals";
import {
  createMineGames,
  calculateMinesMultiplier,
  revealTile,
  buildSafeGrid,
  revealAllMines,
} from "../services/mines.service.js";

// ── createMineGames ───────────────────────────────────────────────────────────
// (These are preserved from mines.test.js but exercised here at the unit level)

describe("createMineGames()", () => {
  it("creates exactly 25 tiles", () => {
    expect(createMineGames(5).length).toBe(25);
  });

  it("places exactly mineCount mines", () => {
    const count = 7;
    const mines = createMineGames(count).filter((t) => t.isMine);
    expect(mines.length).toBe(count);
  });

  it("starts with all tiles unrevealed", () => {
    expect(createMineGames(5).every((t) => t.revealed === false)).toBe(true);
  });

  it("assigns unique indexes 0–24", () => {
    const indexes = createMineGames(5).map((t) => t.index);
    expect(new Set(indexes).size).toBe(25);
  });
});

// ── calculateMinesMultiplier ──────────────────────────────────────────────────

describe("calculateMinesMultiplier()", () => {
  it("returns a multiplier > 0", () => {
    expect(calculateMinesMultiplier(1, 5)).toBeGreaterThan(0);
  });

  it("increases with more reveals", () => {
    const more = calculateMinesMultiplier(5, 3);
    const less = calculateMinesMultiplier(1, 3);
    expect(more).toBeGreaterThan(less);
  });

  it("increases with more mines", () => {
    const risky = calculateMinesMultiplier(1, 10);
    const safe  = calculateMinesMultiplier(1, 1);
    expect(risky).toBeGreaterThan(safe);
  });
});

// ── revealTile ────────────────────────────────────────────────────────────────

describe("revealTile()", () => {
  const makeGrid = () =>
    Array.from({ length: 25 }, (_, i) => ({ index: i, isMine: false, revealed: false }));

  it("marks the target tile as revealed", () => {
    const grid = makeGrid();
    const { tile } = revealTile({ grid, index: 3 });
    expect(tile.revealed).toBe(true);
  });

  it("does NOT mutate the original grid array", () => {
    const original = makeGrid();
    const snapshot  = original.map((t) => ({ ...t }));
    revealTile({ grid: original, index: 3 });
    // Every tile in the original should be unchanged
    expect(original).toEqual(snapshot);
  });

  it("returns the cloned grid with exactly one tile changed", () => {
    const grid = makeGrid();
    const { grid: cloned } = revealTile({ grid, index: 7 });
    const changed = cloned.filter((t, i) => t.revealed !== grid[i].revealed);
    expect(changed.length).toBe(1);
    expect(changed[0].index).toBe(7);
  });

  it("throws when tile is already revealed", () => {
    const grid = makeGrid();
    const { grid: after } = revealTile({ grid, index: 0 });
    expect(() => revealTile({ grid: after, index: 0 })).toThrow("Tiles already revealed");
  });
});

// ── buildSafeGrid ─────────────────────────────────────────────────────────────

describe("buildSafeGrid()", () => {
  it("strips isMine from every tile", () => {
    const grid = createMineGames(5);
    const safe = buildSafeGrid(grid);
    expect(safe.every((t) => t.isMine === undefined)).toBe(true);
  });

  it("preserves index and revealed fields", () => {
    const grid = [
      { index: 0, isMine: true,  revealed: false },
      { index: 1, isMine: false, revealed: true  },
    ];
    const safe = buildSafeGrid(grid);
    expect(safe[0]).toEqual({ index: 0, revealed: false });
    expect(safe[1]).toEqual({ index: 1, revealed: true  });
  });
});

// ── revealAllMines ────────────────────────────────────────────────────────────

describe("revealAllMines()", () => {
  it("sets revealed:true on every mine tile", () => {
    const grid = createMineGames(5);
    const revealed = revealAllMines(grid);
    const mines = revealed.filter((t) => t.isMine);
    expect(mines.every((t) => t.revealed)).toBe(true);
  });

  it("does not reveal safe tiles", () => {
    const grid = createMineGames(5);
    const revealed = revealAllMines(grid);
    const safeTiles = revealed.filter((t) => !t.isMine);
    expect(safeTiles.every((t) => !t.revealed)).toBe(true);
  });

  it("does NOT mutate the original grid", () => {
    const grid = createMineGames(5);
    const snapshot = grid.map((t) => ({ ...t }));
    revealAllMines(grid);
    expect(grid).toEqual(snapshot);
  });
});
