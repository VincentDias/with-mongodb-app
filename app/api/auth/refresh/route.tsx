// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { db } from "../../../api/lib/db";

// if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
//   throw new Error("Missing JWT_SECRET or REFRESH_SECRET environment variable");
// }

// const SECRET_KEY = process.env.JWT_SECRET;
// const REFRESH_SECRET = process.env.REFRESH_SECRET;

// export async function POST(req: Request) {
//   try {
//     // Retrieve refresh token from cookies
//     const refreshToken = (await cookies()).get("refresh_token")?.value;
//     if (!refreshToken) {
//       return NextResponse.json({ error: "No refresh token provided" }, { status: 400 });
//     }

//     // Validate refresh token
//     let decodedToken: any;
//     try {
//       decodedToken = jwt.verify(refreshToken, REFRESH_SECRET);
//     } catch (error) {
//       return NextResponse.json({ error: "Invalid refresh token" }, { status: 400 });
//     }

//     // Recherche de l'utilisateur basé sur l'ID du refresh token
//     const user = await db.collection("users").findOne({ _id: decodedToken.userId });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Generate new token
//     const newToken = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

//     // Update collection sessions with new token
//     await db.collection("sessions").updateOne({ user_id: user._id }, { $set: { jwt: newToken } });

//     // Response with the new token
//     const response = NextResponse.json({ message: "Token refreshed", newToken });

//     // Update cookie with new token
//     response.cookies.set("token", newToken, { httpOnly: true, secure: true, path: "/" });

//     return response;
//   } catch (error: any) {
//     console.error("Error refreshing token:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { refreshToken } from "../../lib/authService";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const newToken = refreshToken(token);

    return NextResponse.json({ message: "Token refreshed", token: newToken });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
