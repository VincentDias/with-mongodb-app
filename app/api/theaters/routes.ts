// page/api/movies/[idTheater]/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Db, MongoClient, ObjectId } from "mongodb";

export async function GET(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: "Invalid theaters ID", error: "ID format is incorrect" });
    }

    const theater = await db.collection("idTheater").findOne({ _id: new ObjectId(idTheater) });

    if (!theater) {
      return NextResponse.json({
        status: 404,
        message: "Comment not found",
        error: "No theater found with the given ID",
      });
    }

    return NextResponse.json({ status: 200, data: { theater } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}
