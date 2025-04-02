import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "../../../../lib/authService";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const cookies = req.cookies;
    const accessToken = cookies.get("accessToken")?.value;
    const refreshToken = cookies.get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "Tokens not found" }, { status: 401 });
    }

    await logoutUser(accessToken);

    const response = NextResponse.json({ message: "Session disconnected" }, { status: 200 });

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
