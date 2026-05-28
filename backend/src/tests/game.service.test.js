import {
  describe,
  it,
  afterAll,
  beforeAll,
  expect,
  afterEach,
} from "@jest/globals";
import { placeBet } from "../services/game.service.js";
import { closeDB, clearDB, setupDB } from "./setup.js";
import { Game, User } from "../models/index.js";

beforeAll(async () => await setupDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

const createUser = async (balance = 1000) => {
  return User.create({
    username: "test-user",
    email: "test@test.com",
    passwordHash: "hash123",
    balance,
  });
};

const createGame = async (type = "dice") => {
  return Game.create({
    name: `test-${type}`,
    type,
  });
};

describe("placeBot()", () => {
  it("should deduct bet amount from user balance", async () => {
    const user = await createUser(1000);
    const game = await createGame("dice");

    await placeBet({
      userId: user._id,
      gameId: game._id,
      gameType: "dice",
      betAmount: 100,
      multiplier: 0,
      payout: 0,
      outcome: "loss",
      gameData: {},
    });

    const updated = await User.findById(user._id);
    expect(updated.balance).toBe(900);
  });

  it("should credit payout on win", async () => {
    const user = await createUser(1000);
    const game = await createGame("dice");

    await placeBet({
      userId: user._id,
      gameId: game._id,
      gameType: "dice",
      betAmount: 100,
      multiplier: 2,
      payout: 200,
      outcome: "win",
      gameData: {},
    });

    const updated = await User.findById(user._id);
    expect(updated.balance).toBe(1100);
  });

  it("should throw if balance is in-sufficient", async () => {
    const user = await createUser(50);
    const game = await createGame("dice");

    await expect(
      placeBet({
        userId: user._id,
        gameId: game._id,
        gameType: "dice",
        betAmount: 100,
        multiplier: 0,
        payout: 0,
        outcome: "loss",
        gameData: {},
      }),
    ).rejects.toThrow("In-sufficient Balance");
  });

  it("should create a bet document in DB", async () => {
    const user = await createUser(1000);
    const game = await createGame("coinflip");

    const { bet } = await placeBet({
      userId: user._id,
      gameId: game._id,
      gameType: "coinflip",
      betAmount: 50,
      multiplier: 1.96,
      payout: 98,
      outcome: "win",
      gameData: { result: "heads", choice: "heads" },
    });

    expect(bet._id).toBeDefined();
    expect(bet.gameType).toBe("coinflip");
    expect(bet.outcome).toBe("win");
    expect(bet.payout).toBe(98);
  });

  it("should return updated balance", async () => {
    const user = await createUser(1000);
    const game = await createGame("dice");

    const { balance } = await placeBet({
      userId: user._id,
      gameId: game._id,
      gameType: "dice",
      betAmount: 200,
      multiplier: 0,
      payout: 0,
      outcome: "loss",
      gameData: {},
    });
    expect(balance).toBe(800);
  });

  it("should should a error if user does not exists", async () => {
    const fake = "64f2abc123456789abcdef01";
    const game = await createGame("dice");

    await expect(
      placeBet({
        userId: fake,
        gameId: game._id,
        gameType: "dice",
        betAmount: 100,
        multiplier: 0,
        payout: 0,
        outcome: "loss",
        gameData: {},
      }),
    ).rejects.toThrow("User not found!");
  });
});
