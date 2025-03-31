//movies

import { NextResponse } from "next/server";
import movieSchema from "../../schemas/movieSchema";
import { connectToDb, db } from "../lib/db";
import { Movie } from "../models/movie";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get movies
 *     description: Get movies
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
 *     summary: Add a new movie
 *     description: Add a new movie
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
 *                 type: url
 *                 description: Movie's poster URL
 *               plot:
 *                  type: string
 *                  description: Movie's plot
 *               year:
 *                  type: date
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

    let schemaValide;
    try {
      schemaValide = await movieSchema.validate(movieData, { abortEarly: false });
    } catch (error: any) {
      throw { status: 400, message: "Bad request", errors: error.errors };
    }

    await connectToDb();

    const newMovie = await Movie.create(schemaValide);

    return NextResponse.json({ status: 201, data: newMovie }, { status: 201 });
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json({ status: error.status, message: error.message, errors: error.errors }, { status: 400 });
    }

    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
