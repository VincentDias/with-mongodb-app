// page/api/theaters/[idTheater]/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Db, MongoClient, ObjectId } from "mongodb";

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     summary: Retrieve a theater by ID
 *     description: Returns a single theater object based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         description: The ID of the theater to retrieve
 *         schema:
 *           type: string
 */
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

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     summary: Create a new theater
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Theater created successfully
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");
    const theaterData = await request.json();

    const result = await db.collection("idTheater").insertOne(theaterData);

    return NextResponse.json({ status: 201, message: "Theater created", data: { id: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}
