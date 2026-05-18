import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getBalance,
  getBetHistory,
  addDemoCoins,
} from "../controllers/user.controller.js";

const router = express.router();

router.use(protect);
router.get("/balance", getBalance);
router.get("/bets", getBetHistory);
router.post("/top-up", addDemoCoins);

export default router;
