// page/api/comments/[idComment]/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Db, MongoClient, ObjectId } from "mongodb";

/**
 * @swagger
 * /api/movies/{idMovie}/comments/:
 *   get:
 *     summary: Get all comments for a movie
 *     description: Get all comments by idMovie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment's idMovie
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
export async function GET(request: Request, { params }: { params: { idMovie: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

    const { idMovie } = await params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: "Invalid movie ID", error: "ID format is incorrect" });
    }

    const comments = await db
      .collection("comments")
      .find({ movie_id: new ObjectId(idMovie) })
      .limit(20)
      .toArray();

    if (!comments) {
      return NextResponse.json({
        status: 404,
        message: "Comment not found",
        error: "No comment found with the given ID",
      });
    }

    return NextResponse.json({ status: 200, data: { comments } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}/comments:
 *   post:
 *     description: Add a comment to a movie
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
 *              - name
 *              - email
 *              - idMovie
 *              - text
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 *       400:
 *         description: Wrong request
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request, { params }: { params: { idMovie: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

    const { idMovie } = await params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid movie ID",
        error: "ID format is incorrect",
      });
    }

    const commentData = await request.json();

    if (!commentData.name || !commentData.email || !commentData.text) {
      return NextResponse.json({
        status: 400,
        message: "Bad Request",
        error: "Name, email and text are required",
      });
    }

    const comment = {
      ...commentData,
      movie_id: new ObjectId(idMovie),
      date: new Date(),
    };

    const result = await db.collection("comments").insertOne(comment);

    return NextResponse.json({
      status: 201,
      data: { id: result.insertedId, ...comment },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
