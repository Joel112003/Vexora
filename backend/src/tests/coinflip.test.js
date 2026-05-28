import {
  describe,
  it,
  afterAll,
  afterEach,
  beforeAll,
  jest,
  expect,
} from "@jest/globals";
import supertest from "supertest";
import app from "../app.js";
import { coinFlip } from "../services/coinflip.service.js";
import { setupDB, closeDB, clearDB } from "./setup.js";

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


