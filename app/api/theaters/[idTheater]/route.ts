// page/api/theaters/[idTheater]/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Db, MongoClient, ObjectId } from "mongodb";

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     description: Returns theaters
 *     responses:
 *       200:
 *         description: Hello Theaters
 */
export async function GET(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const { idTheater } = await params;
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

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
 *     summary: Met à jour un film existant
 *     description: Met à jour les détails d'un film dans la base de données.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Le titre du film
 *               director:
 *                 type: string
 *                 description: Le réalisateur du film
 *     responses:
 *       200:
 *         description: Film mis à jour avec succès
 *       400:
 *         description: Requête incorrecte
 *       404:
 *         description: Film non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function PUT(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const { idTheater } = await params;
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: "Invalid theater ID", error: "ID format is incorrect" });
    }

    const theaterData = await request.json();

    const result = await db.collection("theaters").updateOne({ _id: new ObjectId(idTheater) }, { $set: theaterData });

    if (result.matchedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Theater not found",
        error: "No theater found with the given ID",
      });
    }

    return NextResponse.json({ status: 200, message: "Theater updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: "Internal Server Error", error: error.message });
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
export async function DELETE(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const { idTheater } = params;
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_mflix");

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
