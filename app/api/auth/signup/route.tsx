// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";
// import { db } from "../../../api/lib/db";
// import { signUpSchema } from "../../../schemas/authSchema";

// if (!process.env.JWT_SECRET) {
//   throw new Error("Missing JWT secret key");
// }

// const SECRET_KEY = process.env.JWT_SECRET;

// export async function POST(req: Request) {
//   try {
//     const { name, email, password } = await req.json();

//     await signUpSchema.validate({ name, email, password }, { abortEarly: false });

//     const userExists = await db.collection("users").findOne({ email });
//     if (userExists) {
//       return NextResponse.json({ error: "User already exists" }, { status: 400 });
//     }

//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const result = await db.collection("users").insertOne({ name, email, password: hashedPassword });

//     const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

//     const response = NextResponse.json({ message: "User created", jwt: token });
//     response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/", maxAge: 60 * 60 * 1000 });

//     return response;
//   } catch (error: any) {
//     console.error("Authentification error:", error);
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

import { NextResponse } from "next/server";
import { connectToDb } from "../../../api/lib/db";
import { signupUser } from "../../lib/authService";
import { signUpSchema } from "./../../../schemas/authSchema";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    await connectToDb();
    const { name, email, password } = await req.json();

    try {
      await signUpSchema.validate({ name, email, password }, { abortEarly: true });
    } catch (error: any) {
      throw { status: 400, message: error.error, errors: error.errors };
    }

    await signupUser(name, email, password);
    return NextResponse.json({ message: "Session started" }, { status: 201 });
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json({ error: error }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
