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

const ERROR_USER_EXISTS = "User already exists";
const ERROR_INTERNAL = "Internal server error";
const ERROR_DB_CONNECTION = "Database connection error";
const ERROR_CREDENTIAL = "Invalid credential";

export async function POST(req: Request) {
  try {
    await connectToDb();
    const { name, email, password } = await req.json();
    await signupUser(name, email, password);
    return NextResponse.json({ message: "Session started" }, { status: 201 });
  } catch (error: any) {
    if (error.status === 409) {
      return NextResponse.json({ error: error }, { status: 409 });
    }
    if (error.status === 401) {
      return NextResponse.json({ error: ERROR_CREDENTIAL }, { status: 401 });
    } else if (error.message === ERROR_DB_CONNECTION) {
      return NextResponse.json({ message: ERROR_INTERNAL }, { status: 500 });
    }
    return NextResponse.json({ message: ERROR_INTERNAL, error: error.message }, { status: 500 });
  }
}
