// page/api/movies/[idComment]/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Db, MongoClient, ObjectId } from "mongodb";

export async function GET(request: Request, { params }: { params: { idComment: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: "Invalid comment ID", error: "ID format is incorrect" });
    }

    const comment = await db.collection("comment").findOne({ _id: new ObjectId(idComment) });

    if (!comment) {
      return NextResponse.json({
        status: 404,
        message: "Comment not found",
        error: "No comment found with the given ID",
      });
    }

    return NextResponse.json({ status: 200, data: { comment } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}
