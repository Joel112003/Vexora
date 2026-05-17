export const rollDice = async ({ target, direction, betAmount }) => {
  const roll = Math.floor(Math.random() * 100) + 1;
  const win = direction === "over" ? roll > target : roll < target;

  //multiplier based on probability
  const chance = direction === "over" ? 100 - target : target - 1;
  const multiplier = win ? parseFloat((95 / chance).toFixed(4)) : 0;
  const payout = win ? parseFloat((betAmount * multiplier).toFixed(2)) : 0;

  return {
    roll,
    target,
    direction,
    win,
    multiplier,
    payout,
  };
};
