import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { initSocket } from "./sockets/index.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = initSocket(httpServer);

const start = async () => {
  await connectDB();
  await connectRedis();
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
    console.log(`Socket.Io is ready`);
  });
};

start();
export { httpServer };
