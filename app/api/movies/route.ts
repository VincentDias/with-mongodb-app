//movies

import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     description: Get all movies
 *     responses:
 *       200:
 *         description: Comment found
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
export async function GET(): Promise<NextResponse> {
  try {
    const movies = await db.collection("movies").find({}).limit(20).toArray();

    return NextResponse.json({ status: 200, data: movies });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     description: Create a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Movie's title
 *               director:
 *                 type: string
 *                 description: Movie's director
 *               poster:
 *                 type: string
 *                 description: Movie's poster URL
 *               plot:
 *                  type: string
 *                  description: Movie's plot
 *               year:
 *                  type: string
 *                  format: date
 *                  description: The release year of the movie (YYYY-MM-DD)
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
    const movieData = await request.json();

    if (!movieData.title || !movieData.director) {
      return NextResponse.json({ status: 400, message: "Bad Request", error: "Title and director are required" });
    }

    if (movieData.year) {
      const parsedYear = new Date(movieData.year);
      if (isNaN(parsedYear.getTime())) {
        return NextResponse.json({
          status: 400,
          message: "Bad Request",
          error: "Invalid year format",
        });
      }
      movieData.year = parsedYear;
    }

    movieData.lastupdated = new Date();

    const result = await db.collection("movies").insertOne(movieData);

    return NextResponse.json({ status: 201, data: { id: result.insertedId, ...movieData } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}
