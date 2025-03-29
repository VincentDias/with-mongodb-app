// page/api/movies/[idMovie]/route.ts

import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     summary: Get a movie by id
 *     description: Get a movie by id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: idMovie
 *     responses:
 *       200:
 *         description: Movie found
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ idMovie: string }> }
): Promise<NextResponse> {
  try {
    const { idMovie } = await params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: "Invalid movie ID", error: "ID format is incorrect" });
    }

    const movie = await db.collection("movies").findOne({ _id: new ObjectId(idMovie) });

    if (!movie) {
      return NextResponse.json({ status: 404, message: "Movie not found", error: "No movie found with the given ID" });
    }

    return NextResponse.json({ status: 200, data: { movie } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   put:
 *     summary: Update a movie by id
 *     description: Update a movie by id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - poster
 *               - title
 *               - plot
 *             properties:
 *               poster:
 *                 type: string
 *                 description: Movie's poster URL
 *               title:
 *                 type: string
 *                 description: Movie's title
 *               plot:
 *                  type: string
 *                  description: Movie's plot
 *               year:
 *                  type: string
 *                  format: date
 *                  description: The release year of the movie (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ idMovie: string }> }
): Promise<NextResponse> {
  try {
    const { idMovie } = await params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json(
        { status: 400, message: "Invalid movie ID", error: "ID format is incorrect" },
        { status: 400 }
      );
    }

    const { poster, title, plot, year } = await request.json();

    if (!poster || !title || !plot) {
      return NextResponse.json(
        { status: 400, message: "Missing required fields", error: "Poster, title, and plot are required" },
        { status: 400 }
      );
    }

    const updateData: any = { poster, title, plot, lastupdated: new Date() };
    if (year) {
      updateData.year = year;
    }

    const result = await db.collection("movies").updateOne({ _id: new ObjectId(idMovie) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { status: 404, message: "Movie not found", error: "No movie found with the given ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 200, message: "Movie updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   delete:
 *     summary: Delete movie
 *     description: Delete movie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to delete
 *     responses:
 *       200:
 *         description: Movie successfully deleted
 *       400:
 *         description: Bad request
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ idMovie: string }> }
): Promise<NextResponse> {
  try {
    const { idMovie } = await params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: "Invalid movie ID", error: "ID format is incorrect" });
    }

    const result = await db.collection("movies").deleteOne({ _id: new ObjectId(idMovie) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Movie not founded",
        error: "No movie found with the given ID",
      });
    }

    return NextResponse.json({ status: 200, message: "Movie deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}
