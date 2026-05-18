import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";

import { playDice } from "../controllers/dice.controller.js";
import { playCoinFlip } from "../controllers/coinflip.controller.js";
import {
  startMines,
  revealMineTile,
  cashoutMines,
} from "../controllers/mines.controller.js";
import {
  placeCrashBet,
  cashoutCrash,
  getState,
} from "../controllers/crash.controller.js";

import {
  diceSchema,
  coinflipSchema,
  minesRevealSchema,
  minesStartSchema,
  crashBetSchema,
} from "../validators/game.validator.js";

const router = express.Router();

router.use(protect);

router.post("/dice", validate(diceSchema), playDice);

router.post("/coinflip", validate(coinflipSchema), playCoinFlip);

//mines
router.post("/mines/start", validate(minesStartSchema), startMines);
router.post("/mines/reveal", validate(minesRevealSchema), revealMineTile);
router.post("/mines/cashout", cashoutMines);

//crash
router.post("/crash/state", getState);
router.post("/crash/bet", validate(crashBetSchema), placeCrashBet);
router.post("/crash/cashout", cashoutCrash);

export default router;