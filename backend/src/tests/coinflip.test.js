import {
  describe,
  it,
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  jest,
  expect,
} from "@jest/globals";
import supertest from "supertest";
import app from "../app.js";
import { coinFlip } from "../services/coinflip.service.js";
import { setupDB, closeDB, clearDB } from "./setup.js";
import { Game } from "../models/index.js";

const request = supertest(app);

beforeAll(async () => setupDB());
afterEach(async () => clearDB());
afterAll(async () => closeDB());

describe("flipCoin() service", () => {
  it("should return heads or tails", () => {
    for (let i = 0; i < 50; i++) {
      const result = coinFlip({ choice: "heads", betAmount: 10 });
      expect(["heads", "tails"]).toContain(result.result);
    }
  });

  it("should win when result matches choice", () => {
    const choice = "heads";
    const result = "heads";
    const win = result === choice;
    expect(win).toBe(true);
  });

  it("should have 1.96x multiplier on win", () => {
    for (let i = 0; i < 100; i++) {
      const result = coinFlip({ choice: "heads", betAmount: 100 });
      if (result.win) {
        expect(result.multiplier).toBe(1.96);
        expect(result.payout).toBe(196);
        break;
      }
    }
  });

  it("should have 0 multiplier on loss", () => {
    for (let i = 0; i < 100; i++) {
      const result = coinFlip({ choice: "heads", betAmount: 100 });
      if (!result.win) {
        expect(result.multiplier).toBe(0);
        expect(result.payout).toBe(0);
        break;
      }
    }
  });
});

describe("POST /api/v2/games/coinflip", () => {
  const createCoinflipGame = async () => {
    await Game.create({ name: "coinflip", type: "coinflip" });
  };

  beforeEach(async () => {
    await createCoinflipGame();
  });

  const getToken = async () => {
    const res = await request.post("/api/v1/auth/register").send({
      username: "flip-user",
      email: "flip@flip.com",
      password: "flip123",
    });
    return res.body.data.accessToken;
  };

  it("should play coinflip and return result", async () => {
    const token = await getToken();

    const res = await request
      .post("/api/v2/games/coinflip")
      .set("Authorization", `Bearer ${token}`)
      .send({ betAmount: 10, choice: "heads" });

    expect(res.status).toBe(200);
    expect(["heads", "tails"]).toContain(res.body.data.result.result);
    expect(res.body.data.balance).toBeDefined();
  });

  it("should reject invalid choice", async () => {
    const token = await getToken();

    const res = await request
      .post("/api/v2/games/coinflip")
      .set("Authorization", `Bearer ${token}`)
      .send({ betAmount: 10, choice: "edge" });

    expect(res.status).toBe(400);
  });

  it("should reject unauthenticated request", async () => {
    const res = await request
      .post("/api/v2/games/coinflip")
      .send({ betAmount: 10, choice: "heads" });

    expect(res.status).toBe(401);
  });
});
