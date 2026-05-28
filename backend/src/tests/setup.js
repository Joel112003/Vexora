import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import redisClient, { connectRedis } from "../config/redis.js";

let mongod;

export const setupDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { dbName: "Vexora" });
  await connectRedis();
};

export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
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
