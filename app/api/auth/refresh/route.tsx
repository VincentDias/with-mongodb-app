// route.ts
import { NextRequest, NextResponse } from "next/server";
import { refreshUser } from "../../../../lib/authService";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      console.log("refrresh token recupéré du header ::       ", refreshToken);
      return NextResponse.json({ error: "No refresh token found" }, { status: 401 });
    }
    const response = await refreshUser(refreshToken);

    if (response?.status === 201) {
      const nextResponse = NextResponse.json({ message: "Tokens refreshed" });
    }

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
