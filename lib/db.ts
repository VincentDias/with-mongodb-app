import client from "@/lib/mongodb";
import { Db } from "mongodb";

let db: Db | null = null;

export async function getDatabase() {
  if (!db) {
    const mongoClient = await client;
    db = mongoClient.db("sample_mflix");
  }
  return db;
}
