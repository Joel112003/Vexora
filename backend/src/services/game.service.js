import { User, Bet } from "../models/index.js";

export const placeBet = async ({
  userId,
  betAmount,
  gameType,
  multiplier,
  payout,
  outcome,
  gameData,
}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found!");
  if (user.balance < betAmount) throw new Error("In-sufficient Balance");

  //deduct bet
  user.balance -= betAmount;

  //credit winning if won
  if (outcome == "win") {
    user.balance += payout;
  }

  await user.save();

  const bet = await Bet.create({
    userId,
    betAmount,
    gameType,
    multiplier,
    payout,
    outcome,
    gameData,
  });
  return { bet, balance: user.balance };
};
