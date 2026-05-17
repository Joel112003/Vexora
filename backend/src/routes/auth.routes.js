import express from "express";
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post('/register'  , validate(registerSchema) , register);
router.post('/login' , validate(loginSchema) , login);

router.post('/logout' , protect , logout);
router.post('/refres' , refreshToken);

router.get('/me' , protect , getMe);

export default router;