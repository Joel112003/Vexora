import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import xssClean from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import gameRoutes from './routes/game.routes.js';
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xssClean());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api/v1/auth", authRoutes);
app.use('/api/v2/games', gameRoutes);
app.use('/api/v3/user',  userRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ success: false, message });
});

export default app;
