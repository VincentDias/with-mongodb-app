import { loginUser } from "@/lib/authService";
import { NextResponse } from "next/server";
import { loginSchema } from "../../../schemas/authSchema";

export async function POST(login: Request): Promise<NextResponse> {
  try {
    const { email, password } = await login.json();

    try {
      await loginSchema.validate({ email, password }, { abortEarly: true });
    } catch (error: any) {
      return NextResponse.json({ status: 400, message: error.message }, { status: 400 });
    }

    const { newAccessToken, newRefreshToken } = await loginUser(email, password);

    const response = NextResponse.json({ status: 200, message: "Session started" }, { status: 200 });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
      sameSite: "strict",
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ status: error.status, error: error.error }, { status: error.status });
  }
}
