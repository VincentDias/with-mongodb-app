// page/api/movies/[idComment]/route.ts

import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { db } from "../../../../../../lib/db";

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   get:
 *     summary: Get a comment for a given movie
 *     description: Get a comment by ID for a given movie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
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
export async function GET(
  request: Request,
  { params }: { params: Promise<{ idMovie: string; idComment: string }> }
): Promise<NextResponse> {
  try {
    const { idMovie, idComment } = await params;
    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid movie ID",
        error: "ID format is incorrect",
      });
    }

    const comment = await db.collection("comments").findOne({
      _id: new ObjectId(idComment),
      movie_id: new ObjectId(idMovie),
    });

    if (!comment) {
      return NextResponse.json({
        status: 404,
        message: "Comment not found",
        error: "No comment found with the given ID",
      });
    }

    return NextResponse.json({ status: 200, data: { comment } });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   put:
 *     summary: Update a comment for a given movie
 *     description: Update a comment for a given movie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - name
 *             properties:
 *               text:
 *                 type: string
 *                 description: The comment text
 *               name:
 *                 type: string
 *                 description: The name of the commenter
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
  { params }: { params: Promise<{ idMovie: string; idComment: string }> }
): Promise<NextResponse> {
  try {
    const { idMovie, idComment } = await params;
    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid comment ID",
        error: "ID format is incorrect",
      });
    }

    const commentData = await request.json();

    const result = await db.collection("comments").updateOne({ _id: new ObjectId(idComment) }, { $set: commentData });

    if (result.matchedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Comment not found",
        error: "No comment found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Comment updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   delete:
 *     summary: Delete a comment for a given movie
 *     description: Delete a comment for a given movie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ idMovie: string; idComment: string }> }
): Promise<NextResponse> {
  try {
    const { idMovie, idComment } = await params;
    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid comment ID",
        error: "ID format is incorrect",
      });
    }

    const result = await db.collection("comments").deleteOne({ _id: new ObjectId(idComment) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Comment not found",
        error: "No comment found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
