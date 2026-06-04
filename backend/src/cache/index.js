import redisClient from "../config/redis.js";

export const setCache = async (key, value, ttlSeconds) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
};

export const getCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key) => {
  await redisClient.del(key);
};

const BALANCE_TTL = 60;

export const cacheBalance = async (userId, balance) => {
  await setCache(`balance : ${userId}`, balance, BALANCE_TTL);
};

export const getCachedBalance = async (userId) => {
  return await getCache(`balance : ${userId}`);
};

export const invalidatedBalance = async (userId) => {
  await deleteCache(`balance : ${userId}`);
};

const BET_HISTORY_TTL = 30;

export const cacheBetHistory = async (userId, bets) => {
  await setCache(`bet-history : ${userId}`, bets, BET_HISTORY_TTL);
};

export const getCachedBetHistory = async (userId) => {
  return await getCache(`bet-history : ${userId}`);
};

export const invalidatedBetHistory = async (userId) => {
  await deleteCache(`bet-history : ${userId}`);
};

const MINES_TTL = 60 * 30;

export const saveMinesGame = async (userId, gameStats) => {
  await setCache(`mines : ${userId}`, gameStats, MINES_TTL);
};

export const getMinesGame = async (userId) => {
  return await getCache(`mines : ${userId}`);
};

export const deleteMinesGame = async (userId) => {
  await deleteCache(`mines : ${userId}`);
};
