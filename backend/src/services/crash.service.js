

export const generateCrashPoints = () => {
  const e = 2 ** 32;
  const h = Math.floor(Math.random() * e);

  if (h === 0) return 1.0;

  const crashPoint = Math.floor((100 * e - h) / (e - h) / 100);
  return Math.max(1.0, crashPoint);
};
export const formatMultiplier = (value) => parseFloat(value.toFixed(2));
