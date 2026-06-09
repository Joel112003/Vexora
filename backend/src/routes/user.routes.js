import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getBalance,
  getBetHistory,
  addDemoCoins,
  getAllBets,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protect);
router.get("/balance", getBalance);
router.get("/bets", getBetHistory);
router.get('/bets/all',  getAllBets);    

router.post("/top-up", addDemoCoins);

export default router;
