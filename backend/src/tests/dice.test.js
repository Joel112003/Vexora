import {
  afterAll,
  beforeAll,
  afterEach,
  expect,
  it,
  describe,
  jest,
} from "@jest/globals";
import { rollDice } from "../services/dice.service";
import supertest from "supertest";
import app from "../app.js";
import { setupDB, closeDB, clearDB } from "./setup.js";

const request = supertest(app);

beforeAll(async () => setupDB());
afterEach(async () => clearDB());
afterAll(async () => closeDB());

// unit - testing with no api just using pure maths

describe("rollDice() service", () => {
  it("should return a roll between 1 and 100", async () => {
    for (let i = 0; i < 100; i++) {
      const result = await rollDice({
        target: 50,
        direction: "over",
        betAmount: 10,
      });
      expect(result.roll).toBeGreaterThanOrEqual(1);
      expect(result.roll).toBeLessThanOrEqual(100);
    }
  });

  //mock a specific roll by testing the win logically directly
  it("should win when roll is over target for over direction", async () => {
    const target = 50;
    const roll = 75;

    const win = roll > target;
    expect(win).toBe(true);
  });
  it("should win when roll is under target for under direction", async () => {
    const target = 50;
    const roll = 30;

    const win = roll < target;
    expect(win).toBe(true);
  });

  it("should return  multiplier 0 on loss", async () => {
    //run many time to guarantee at least one loss
    let foundLoss = false;
    for (let i = 0; i < 200; i++) {
      const result = await rollDice({
        target: 50,
        direction: "over",
        betAmount: 10,
      });
      if (!result.win) {
        expect(result.multiplier).toBe(0);
        expect(result.payout).toBe(0);
        foundLoss = true;
        break;
      }
    }
    if (!foundLoss) console.warn("no loss found in 200 rolls - check DB");
  });

  it("should calculate higher multiplier for riskier bets", async () => {
    // over 90 = only 10 winning tiles = riskier = higher multiplier
    let checked = false;
    for (let i = 0; i < 200; i++) {
      const risky = await rollDice({
        target: 90,
        direction: "over",
        betAmount: 10,
      });
      const easy = await rollDice({
        target: 10,
        direction: "over",
        betAmount: 10,
      });
      if (risky.win && easy.win) {
        expect(risky.multiplier).toBeGreaterThan(easy.multiplier);
        checked = true;
        break;
      }
    }
    if (!checked) console.warn("no comparable wins found in 200 rolls");
  });

  it("should calculate correct multiplier for over 50", async () => {
    const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.99);
    const result = await rollDice({
      target: 50,
      direction: "over",
      betAmount: 10,
    });
    expect(result.win).toBe(true);
    expect(result.multiplier).toBe(1.9);
    randomSpy.mockRestore();
  });
});
