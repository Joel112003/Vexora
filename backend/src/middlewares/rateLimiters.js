import rateLimit from "express-rate-limit";

const isTestEnv = process.env.NODE_ENV === "test";
const passThrough = (req, res, next) => next();

const createLimiter = (options) => (isTestEnv ? passThrough : rateLimit(options));

export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = createLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const registerLimiter = createLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  message: {
    success: false,
    message: "Too many signup attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = createLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetPasswordLimiter = createLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many reset attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
