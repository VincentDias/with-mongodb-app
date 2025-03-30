// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";
// import { db } from "../../../api/lib/db";
// import { loginSchema } from "../../../schemas/authSchema";

// if (!process.env.JWT_SECRET) {
//   throw new Error("Missing JWT_SECRET environment variable");
// }
// const SECRET_KEY = process.env.JWT_SECRET;

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     await loginSchema.validate({ email, password }, { abortEarly: false });

//     const user = await db.collection("users").findOne({ email });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
//     }

//     const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

//     const response = NextResponse.json({ message: "Authenticated", token });
//     response.cookies.set("token", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });

//     response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });
//     await db.collection("sessions").updateOne(
//       { user_id: user._id },
//       {
//         $set: {
//           jwt: token,
//         },
//       },
//       { upsert: false }
//     );

//     return response;
//   } catch (error: any) {
//     console.error("Authentication error:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { authenticateUser } from "../../lib/authService";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const token = await authenticateUser(email, password);

    const response = NextResponse.json({ message: "Authenticated", token });
    response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
