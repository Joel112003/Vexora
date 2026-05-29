import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import redisClient, { connectRedis } from "../config/redis.js";
import { Game } from "../models/index.js";

let mongod;

const seedGames = async () => {
  const defaults = [
    { name: "dice", type: "dice" },
    { name: "coinflip", type: "coinflip" },
    { name: "mines", type: "mines" },
    { name: "crash", type: "crash" },
  ];
  for (const game of defaults) {
    const existing = await Game.findOne({ type: game.type });
    if (!existing) {
      await Game.create(game);
    }
  }
};

export const setupDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { dbName: "Vexora" });
  await seedGames();
  await connectRedis();
};

export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  await seedGames();
};

export const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  if (mongod) {
    await mongod.stop();
  }
};
