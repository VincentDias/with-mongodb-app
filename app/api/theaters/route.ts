// page/api/theaters/[idTheater]/route.ts

import { theaterSchema } from "@/app/schemas/theaterSchema";
import clientPromise from "@/lib/mongodb";
import { Db, MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import * as yup from "yup";

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     summary: Get theater by id
 *     description: Get theater by id
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         description: The ID of the theater to retrieve
 *         schema:
 *           type: string
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ idTheater: string }> }
): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

    const { idTheater } = await params;
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
 *     description: Create a new theater
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street1:
 *                 type: string
 *                 description: Street
 *               city:
 *                 type: string
 *                 description: City
 *               state:
 *                 type: string
 *                 description: State
 *               zipcode:
 *                 type: string
 *                 description: Zipcode
 *     responses:
 *       201:
 *         description: Movie successfully created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

    const theaterData = await request.json();

    await theaterSchema.validate(theaterData, { abortEarly: false });

    try {
      await theaterSchema.validate(theaterData, { abortEarly: false });
    } catch (validationError: any) {
      return NextResponse.json({
        status: 400,
        message: "Validation failed",
        errors: validationError.errors,
      });
    }

    const maxTheaterId = await db.collection("theaters").find().sort({ theaterId: -1 }).limit(1).toArray();

    if (!maxTheaterId || maxTheaterId.length === 0) {
      throw new Error("No theaters found in the database.");
    }

    const newTheaterId = maxTheaterId[0].theaterId + 1;

    const newTheater = {
      ...theaterData,
      theaterId: newTheaterId,
      location: {
        address: {
          street1: theaterData.street1,
          city: theaterData.city,
          state: theaterData.state,
          zipcode: theaterData.zipcode,
        },
        geo: {
          type: "Point",
          coordinates: [theaterData.geo?.longitude || 0, theaterData.geo?.latitude || 0],
        },
      },
    };

    const result = await db.collection("theaters").insertOne(newTheater);

    return NextResponse.json({ status: 201, message: "Theater added successfully", data: result, newTheater });
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ status: 400, message: "Validation failed", errors: error.errors });
    }

    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}
