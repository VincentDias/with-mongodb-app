// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ status: 400, message: "Email et mot de passe sont requis." });
    }

    const client: MongoClient = await clientPromise;
    const db = client.db("sample_mflix");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ status: 400, message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword };

    const result = await db.collection("users").insertOne(newUser);
    return NextResponse.json({ status: 201, message: "Utilisateur créé avec succès." });
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Erreur serveur", error: error });
  }
}
