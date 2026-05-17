import app from "./app.js"
import connectDB from "./config/db.js";
import { createServer } from "http";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
  });
};

start();
export { httpServer };
