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
    await signupUser(name, email, password);
    return NextResponse.json({ status: 200, message: "User registered successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: error.status, error: error.error }, { status: error.status });
  }
}
