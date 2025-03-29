// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  // access bdd --> delete session
  const response = NextResponse.json({ message: "Logged out" });

  // Supprimer les cookies
  response.cookies.set("token", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });
  response.cookies.set("refreshToken", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });

  return response;
}
