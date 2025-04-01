"use server";

import { MongoClient } from "mongodb";
import clientPromise from "../lib/mongodb";

export async function testDatabaseConnection() {
  let isConnected = false;
  try {
    const mongoClient: MongoClient = await clientPromise;
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return !isConnected;
  } catch (e) {
    console.error(e);
    return isConnected;
  }
}
