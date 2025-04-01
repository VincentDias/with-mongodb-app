import { NextResponse } from "next/server";
import { signupUser } from "../../../../lib/authService";
import { signUpSchema } from "./../../../schemas/authSchema";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, email, password } = await req.json();

    try {
      await signUpSchema.validate({ name, email, password }, { abortEarly: true });
    } catch (error: any) {
      throw { status: 400, error: error.message };
    }

    const { newAccessToken, newRefreshToken } = await signupUser(name, email, password);

    const response = NextResponse.json({ status: 200, message: "User registered successfully" }, { status: 200 });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
      sameSite: "strict",
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { status: error.status || 500, error: error.error || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}
