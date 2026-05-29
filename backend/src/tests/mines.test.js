import {
  describe,
  it,
  expect,
  afterAll,
  beforeAll,
  afterEach,
  jest,
} from "@jest/globals";

import app from "../app.js";
import supertest from "supertest";
import { setupDB, clearDB, closeDB } from "./setup.js";
import {
  createMineGames,
  calculateMinesMultiplier,
} from "../services/mines.service.js";

const request = supertest(app);

beforeAll(async () => setupDB());
afterEach(async () => clearDB());
afterAll(async () => closeDB());

describe("createMinesGame() service", () => {
  it("should create a 25 grid lines", () => {
    const grid = createMineGames(5);
    expect(grid.length).toBe(25);
  });

  it("should play exactly the right number of mines", () => {
    const mineCount = 7;
    const grid = createMineGames(mineCount);
    const mines = grid.filter((t) => t.isMine);
    expect(mines.length).toBe(mineCount);
  });

  it("should start with all tiles unrevealed", () => {
    const grid = createMineGames(5);
    expect(grid.every((t) => t.revealed === false)).toBe(true);
  });

  it("should give each tile a unique index", () => {
    const grid = createMineGames(5);
    const indexes = grid.map((t) => t.index);
    const unique = new Set(indexes);
    expect(unique.size).toBe(25);
  });
});

describe("calculateMinesMultiplier() service", () => {
  it("should return higher multiplier for more mines", () => {
    const risky = calculateMinesMultiplier(1, 10);
    const safe = calculateMinesMultiplier(1, 1);
    expect(risky).toBeGreaterThan(safe);
  });

  it("should return higher multiplier for more reveals", () => {
    const more = calculateMinesMultiplier(5, 3);
    const less = calculateMinesMultiplier(1, 3);
    expect(more).toBeGreaterThan(less);
  });

  it("should return a number greater than 0", () => {
    const mult = calculateMinesMultiplier(1, 5);
    expect(mult).toBeGreaterThan(0);
  });
});


