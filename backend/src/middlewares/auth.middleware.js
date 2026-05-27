import { verifyAccessToken } from "../utilis/jwt.js";
import { User } from "../models/index.js";
import { apiResponse } from "../utilis/apiResponse.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(apiResponse(false, "No authorized , No Token"));
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json(apiResponse(false, "User no longer exists"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(apiResponse(false, "Token expired or invalid"));
  }
};

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(401).json(apiResponse(false, "You do not have permission"));
    }
    next();
  };
