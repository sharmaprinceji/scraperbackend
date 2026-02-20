import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {

    // console.log("MONGO_URI:", env.MONGO_URI);

    await mongoose.connect(env.MONGO_URI);

    // console.log("DB NAME:", mongoose.connection.name);

    logger.info("MongoDB connected successfully");

  } catch (error) {

    logger.error("MongoDB connection failed:", error);

    process.exit(1);
  }
};

export default connectDB;
