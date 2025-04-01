import { MongoClient } from "mongodb";
import mongoose from "mongoose";

// MongoDb connection
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not defined in .env.local");

const client = new MongoClient(uri);
export const db = client.db("sample_mflix");

// Mongoose connection
export const connectToDb = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(uri, { dbName: "sample_mflix" });
  } catch (error) {
    console.error("MongoDB connection error via Mongoose", error);
    process.exit(1);
  }
};
