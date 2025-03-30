import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}
const SECRET_KEY = process.env.JWT_SECRET;

export function generateToken(email: string) {
  try {
    console.log();
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
    return token;
  } catch (error: any) {
    throw new Error("Token generation failed");
  }
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY) as { email: string };
  } catch (error: any) {
    throw new Error("Error generating token");
  }
}

export function refreshToken(oldToken: string) {
  const decoded = verifyToken(oldToken);
  return generateToken(decoded.email);
}

export function setTokenCookie(response: NextResponse, token: string) {
  try {
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
      sameSite: "strict",
    });
  } catch {
    throw new Error("Error generating token");
  }
}

export async function getTokenFromCookie(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Token not found");
  return token;
}

export function removeTokenCookie(response: NextResponse) {
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
  });
}
