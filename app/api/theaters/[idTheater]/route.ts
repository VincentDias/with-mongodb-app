// page/api/theaters/[idTheater]/route.ts

import { theaterSchema } from "@/app/schemas/theaterSchema";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     summary: Get a theater by id
 *     description: Get a theater by id
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the theater
 *     responses:
 *       200:
 *         description: Theater found
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ idTheater: string }> }
): Promise<NextResponse> {
  try {
    const { idTheater } = await params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: "Invalid theater ID", error: "ID format is incorrect" });
    }

    const theater = await db.collection("theaters").findOne({ _id: new ObjectId(idTheater) });

    if (!theater) {
      return NextResponse.json({
        status: 404,
        message: "Theater not found",
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
 * /api/theaters/{idTheater}:
 *   put:
 *     summary: Update theater
 *     description: Update theater
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the theater to update
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
 *       200:
 *         description: Theater successfully updated
 *       400:
 *         description: Invalid request format
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ idTheater: string }> }
): Promise<NextResponse> {
  try {
    const { idTheater } = await params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid theater ID",
        error: "ID format is incorrect",
      });
    }

    const theaterData = await request.json();

    try {
      await theaterSchema.validate(theaterData, { abortEarly: false });
    } catch (validationError: any) {
      // Return validation errors
      return NextResponse.json({
        status: 400,
        message: "Validation failed",
        errors: validationError.errors,
      });
    }

    // Construct the updated theater object
    const theaterUpdated = {
      ...theaterData,
      location: {
        address: {
          street1: theaterData.street1,
          city: theaterData.city,
          state: theaterData.state,
          zipcode: theaterData.zipcode,
        },
      },
    };

    const result = await db
      .collection("theaters")
      .updateOne({ _id: new ObjectId(idTheater) }, { $set: theaterUpdated });

    if (result.matchedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Theater not found",
        error: "No theater found with the given ID",
      });
    }

    return NextResponse.json({ status: 200, message: "Theater updated successfully", theaterUpdated });
  } catch (error: any) {
    console.error("Error occurred while updating theater:", error);

    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message || "An unexpected error occurred",
    });
  }
}

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   delete:
 *     summary: Delete theater
 *     description: Delete theater by ID.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: idTheater to delete
 *     responses:
 *       200:
 *         description: Theater deleted
 *       400:
 *         description: Wrong request
 *       404:
 *         description: Unknown theater
 *       500:
 *         description: Internal error
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ idTheater: string }> }
): Promise<NextResponse> {
  try {
    const { idTheater } = await params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: "Invalid theater ID", error: "ID format is incorrect" });
    }

    const result = await db.collection("theaters").deleteOne({ _id: new ObjectId(idTheater) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Theater not founded",
        error: "No theater found with the given ID",
      });
    }

    return NextResponse.json({ status: 200, message: "Theater deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}
