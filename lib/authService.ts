import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Session from "../app/models/session";
import User from "../app/models/user";
import { JWT_SECRET, REFRESH_SECRET } from "../app/tokenConfig";
import { connectToDb } from "./db";

export async function signupUser(name: string, email: string, password: string) {
  await connectToDb();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw { status: 403, error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
  });
}

export async function loginUser(email: string, password: string) {
  await connectToDb();
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 404, error: "User not found" };
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw { status: 401, error: "401 Bad credencials" };
  }
  const { newAccessToken, newRefreshToken } = generateTokens(email);

  const session = await Session.findOne({ user_id: user._id });

  if (!session) {
    await Session.create({ user_id: user._id, jwt: newRefreshToken });
  } else {
    await Session.updateOne({ user_id: user._id }, { $set: { jwt: newRefreshToken } });
  }

  return { newAccessToken, newRefreshToken };
}

export async function refreshUser(newRefreshToken: string): Promise<NextResponse> {
  try {
    await connectToDb();

    const session = await Session.findOne({ jwt: newRefreshToken });

    if (!session) {
      throw { status: 401, error: "Session not found" };
    }

    let decoded: any;
    try {
      decoded = jwt.verify(newRefreshToken, REFRESH_SECRET);
    } catch (err) {
      throw { status: 401, error: "Invalid or expired refresh token" };
    }

    // const { accessToken, refreshToken } = generateTokens(decoded);

    // if (!session) {
    //   await Session.create({ user_id: user._id, jwt: accessToken });
    // } else {
    //   await Session.updateOne({ user_id: user._id }, { $set: { jwt: accessToken } });
    // }

    // return { status: 201, newAccessToken, newRefreshToken };
    return NextResponse.json({ status: 200, message: "Session refresh" });
  } catch (error) {
    throw error;
  }
}

export async function logoutUser(newRefreshToken: string) {
  try {
    const sessionJwt = await Session.findOne({ jwt: newRefreshToken });
    if (!sessionJwt) {
      throw new Error("Session not found");
    }

    const userJwt = await User.findById(sessionJwt.user_id);
    if (!userJwt) {
      throw new Error("User not found");
    }

    const tokenJwt = await verifyToken(newRefreshToken);
    if (!tokenJwt) {
      throw new Error("Invalid token");
    }

    if (tokenJwt.email !== userJwt.email) {
      throw new Error("Invalid email in token");
    }

    await Session.deleteOne({ user_id: userJwt._id });
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
}

export function generateTokens(email: string) {
  const newAccessToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "15m" });
  const newRefreshToken = jwt.sign({ email }, REFRESH_SECRET, { expiresIn: "7d" });
  return { newAccessToken, newRefreshToken };
}

export async function verifyToken(token: string): Promise<any> {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}
