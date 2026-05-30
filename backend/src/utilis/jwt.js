import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN || "test-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN || "test-refresh-secret";

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, ACCESS_SECRET, {
    expiresIn: "10m",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, REFRESH_SECRET, {
    expiresIn: "3d",
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};
