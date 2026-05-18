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

//balance cache
// balance is checked everytime when the page reloads or when the games starts invalidated the balance
const BALANCE_TTL = 60;

export const cacheBalance = async (userId, balance) => {
  await setCache(`balance : ${userId}`, balance, BALANCE_TTL);
};

export const getCacheBalance = async (userId) => {
  await getCache(`balance : ${userId}`);
};

export const invalidatedBalance = async (userId) => {
  await deleteCache(`balance: ${userId}`);
};

// bet history cache
const BET_HISTORY_TTL = 30;
export const cacheHistory = async (userId, bets) => {
  await setCache(`bet-history : ${userId}`, bets, BET_HISTORY_TTL);
};

export const getCachedGetHistory = async (userId) => {
  await getCache(`bet-history : ${userId}`);
};

export const invalidatedBetHistory = async (userId) => {
  await deleteCache(`bet-history : ${userId}`);
};

//mines game stats
const MINES_TTL = 60 * 30;

export const saveMinesGame = async (userId, gameStats) => {
  await setCache(`mines : ${userId}`, gameStats, MINES_TTL);
};
export const getMinesGame = async (userId) => {
  await getCache(`mines : ${userId}`);
};

export const deleteMinesGame = async (userId) => {
  await deleteCache(`mine : ${userId}`);
};
