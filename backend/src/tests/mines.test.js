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

describe("Mines API flow()", () => {
  const getToken = async () => {
    const res = await request.post("/api/v1/auth/register").send({
      username: "miner",
      email: "mines@test.com",
      password: "password123",
    });
    return res.body.data.accessToken;
  };

  it("should start a mine game", async () => {
    const token = await getToken();

    const res = await request
      .post("/api/v2/games/mines/start")
      .set("Authorization", `Bearer ${token}`)
      .send({ betAmount: 50, mineCount: 5 });

    expect(res.status).toBe(200);
    expect(res.body.data.grid.length).toBe(25);
    expect(res.body.data.grid[0].isMine).toBeUndefined();
  });

  it("should reject invalid mine count", async () => {
    const token = await getToken();

    const res = await request
      .post("/api/v2/games/mines/start")
      .set("Authorization", `Bearer ${token}`)
      .send({ betAmount: 50, mineCount: 25 });

    expect(res.status).toBe(400);
  });

  it("full flow — start, reveal safe tile, cashout", async () => {
    const token = await getToken();

    // start game with 1 mine — almost all tiles are safe
    await request
      .post("/api/v2/games/mines/start")
      .set("Authorization", `Bearer ${token}`)
      .send({ betAmount: 50, mineCount: 1 });

    // reveal tiles until we find a safe one
    let safeIndex = 0;
    for (let i = 0; i < 25; i++) {
      const rev = await request
        .post("/api/v2/games/mines/reveal")
        .set("Authorization", `Bearer ${token}`)
        .send({ index: i });

      if (rev.body.success) {
        safeIndex = i;
        break;
      }
    }
    expect(safeIndex).not.toBeNull();

    const cashout = await request
      .post("/api/v2/games/mines/cashout")
      .set("Authorization", `Bearer ${token}`);

    expect(cashout.status).toBe(200);
    expect(cashout.body.data.payout).toBeGreaterThan(0);
    expect(cashout.body.data.balance).toBeDefined();
  });

  it("should not allow cashout before any reveal", async () => {
    const token = await getToken();

    await request
      .post("/api/v2/games/mines/start")
      .set("Authorization", `Bearer ${token}`)
      .send({ betAmount: 50, mineCount: 5 });

    const res = await request
      .post("/api/v2/games/mines/cashout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});
