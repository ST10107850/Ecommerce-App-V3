import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env.const";

export const dbConnection = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB URI is missing from environment variables.");
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Closes sockets after 45s of inactivity
    });

    console.log("✅ MongoDB Connected Successfully!");

    // 🔹 Event Listeners for Debugging
    mongoose.connection.on("connected", () => {
      console.log("✅ Mongoose connected to DB.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected.");
    });
  } catch (error: any) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Stop server if DB connection fails
  }
};
