import { NextResponse } from "next/server";
import { connectToDb } from "../../../api/lib/db";
import { authenticateUser } from "../../lib/authService";
import { loginSchema } from "./../../../schemas/authSchema";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    await connectToDb();
    const { email, password } = await req.json();

    try {
      await loginSchema.validate({ email, password }, { abortEarly: true });
    } catch (error: any) {
      throw { status: 405, error: error.error };
    }
    try {
      await authenticateUser(email, password);
    } catch (error: any) {
      throw { status: error.status, error: error.error };
    }

    return NextResponse.json({ status: 201, message: "Session started" }, { status: 201 });
  } catch (error: any) {
    if (error.status && error.status !== 500) {
      return NextResponse.json({ error: error }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal error", error: error.message }, { status: 500 });
  }
}
