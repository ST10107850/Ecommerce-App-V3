import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env.const";

export const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err: any) {
    console.error("Failed to connect: ", err.message);
    process.exit(1);
  }
};
