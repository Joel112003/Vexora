import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Vexora_DB",
    });
    mongoose.set("strictQuery", true);
  } catch (error) {
    console.error(`MongoDB connection failed" : ${error.message}`);
    process.exit(1);
  }
};

export default ConnectDB;