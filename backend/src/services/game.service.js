import { User, Bet } from "../models/index.js";
import { invalidatedBalance, invalidatedBetHistory } from "../cache/index.js";

export const deductAndCredit = (currentBalance, betAmount, outcome, payout) => {
  if (currentBalance < betAmount) throw new Error("In-sufficient Balance");
  let balance = currentBalance - betAmount;
  if (outcome === "win") balance += payout;
  return parseFloat(balance.toFixed(2));
};

export const recordBet = async ({
  userId,
  gameId,
  betAmount,
  gameType,
  multiplier,
  payout,
  outcome,
  gameData,
}) => {
  const bet = await Bet.create({
    userId,
    gameId,
    betAmount,
    gameType,
    multiplier,
    payout,
    outcome,
    gameData,
  });

  await invalidatedBalance(userId.toString());
  await invalidatedBetHistory(userId.toString());

  return bet;
};

export const placeBet = async ({
  userId,
  gameId,
  betAmount,
  gameType,
  multiplier,
  payout,
  outcome,
  gameData,
}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found!");

  user.balance = deductAndCredit(user.balance, betAmount, outcome, payout);
  await user.save();

  const bet = await recordBet({
    userId,
    gameId,
    betAmount,
    gameType,
    multiplier,
    payout,
    outcome,
    gameData,
  });

  return { bet, balance: user.balance };
};
