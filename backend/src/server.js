import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { initSocket } from "./sockets/index.js";
import { connectRedis } from "./config/redis.js";
import { Game } from "./models/index.js";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = initSocket(httpServer);

const ensureGames = async () => {
  const defaults = [
    { name: "dice", type: "dice" },
    { name: "coinflip", type: "coinflip" },
    { name: "mines", type: "mines" },
    { name: "crash", type: "crash" },
  ];
  for (const game of defaults) {
    const existing = await Game.findOne({ type: game.type });
    if (!existing) {
      await Game.create(game);
    }
  }
};

const start = async () => {
  await connectDB();
  await ensureGames();
  await connectRedis();
  httpServer.listen(PORT, () => {
    console.log("All games are ready");
    console.log(`Server is running on port : ${PORT}`);
    console.log(`Socket.Io is ready`);
  });
};

start();
export { httpServer };
