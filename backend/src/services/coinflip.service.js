import { parse } from "dotenv";

export const coinFlip = ({ choice, betAmount }) => {

  //50-50 random result
  const result = Math.random() < 0.5 ? "heads" : "tails";
  const win = result === choice;

  const multiplier = win ? 1.96 : 0;
  const payout = win ? parseFloat((betAmount * multiplier).toFixed(2)) : 0;

  return { result, choice, win, multiplier, payout };
};
