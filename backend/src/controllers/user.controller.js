import { User, Bet } from "../models/index.js";
import { apiResponse } from "../utilis/apiResponse.js";
import {
  getCachedBalance,
  cacheBalance,
  getCachedBetHistory,
  cacheBetHistory,
  invalidatedBalance,
} from "../cache/index.js";

export const getBalance = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const cached = await getCachedBalance(userId);
    if (cached !== null) {
      return res.json(
        apiResponse(true, "Balance Fetched", {
          balance: cached,
          fromCache: true,
        }),
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(apiResponse(false, "User not found"));
    }

    await cacheBalance(userId, user.balance);
    res.json(
      apiResponse(true, "Balance fetched", {
        balance: user.balance,
        fromCache: false,
      }),
    );
  } catch (error) {
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const getBetHistory = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const cached = await getCachedBetHistory(userId);
    if (cached) {
      return res.json(
        apiResponse(true, "Bet history fetched", {
          bets: cached,
          fromCache: true,
        }),
      );
    }

    const bets = await Bet.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    await cacheBetHistory(userId, bets);

    res.json(
      apiResponse(true, "Bet history fetched", { bets, fromCache: false }),
    );
  } catch (error) {
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const addDemoCoins = async (req, res) => {
  try {
    const MAX_BALANCE = 5000;
    const TOPUP_AMOUNT = 1000;

    const user = await User.findById(req.user._id);

    if (user.balance >= MAX_BALANCE) {
      return res.status(400).json(
        apiResponse(
          false,
          `You already have ${user.balance} coins. Please play some games first`,
        ),
      );
    }

    user.balance = Math.min(user.balance + TOPUP_AMOUNT, MAX_BALANCE);
    await user.save();

    await invalidatedBalance(req.user._id.toString());
    res.json(
      apiResponse(true, "Demo coins added", { balance: user.balance }),
    );
  } catch (error) {
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const getAllBets = async (req, res) => {
  try {
    const page     = parseInt(req.query.page)     || 1;
    const limit    = parseInt(req.query.limit)    || 20;
    const gameType = req.query.gameType;
    const skip     = (page - 1) * limit;

    const filter = { userId: req.user._id };
    if (gameType) filter.gameType = gameType;

    const [bets, total] = await Promise.all([
      Bet.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Bet.countDocuments(filter),
    ]);

    res.json(apiResponse(true, 'Bet history fetched', { bets, total, page }));
  } catch (error) {
    res.status(500).json(apiResponse(false, error.message));
  }
};
