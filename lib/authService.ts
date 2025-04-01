import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Session from "../app/models/session";
import User from "../app/models/user";
import { JWT_SECRET, REFRESH_SECRET } from "../app/tokenConfig";
import { connectToDb } from "./db";

export async function signupUser(name: string, email: string, password: string) {
  try {
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

    return generateTokens(email);
  } catch (error: any) {
    throw error;
  }
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
    await Session.create({ user_id: user._id, jwt: newAccessToken });
  } else {
    await Session.updateOne({ user_id: user._id }, { $set: { jwt: newAccessToken } });
  }

  return { newAccessToken, newRefreshToken };
}

export async function refreshUser(refreshToken: string): Promise<NextResponse> {
  try {
    await connectToDb();

    const session = await Session.findOne({ jwt: refreshToken });

    if (!session) {
      throw { status: 401, error: "Session not found" };
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
      throw { status: 401, error: "Invalid or expired refresh token" };
    }

    console.log("decode      ", decoded);

    // const { accessToken, refreshToken } = generateTokens(decoded);

    // if (!session) {
    //   await Session.create({ user_id: user._id, jwt: accessToken });
    // } else {
    //   await Session.updateOne({ user_id: user._id }, { $set: { jwt: accessToken } });
    // }

    // return { status: 201, newAccessToken, newRefreshToken };
    return NextResponse.json({ okok: "okok" });
  } catch (error) {
    throw error;
  }
}

export async function logoutUser(token: string) {
  try {
    console.log("et l'email??              ", token);
    const decoded = await verifyToken(token);

    console.log("decoded      ", decoded);

    // if (decoded.email !== expectedEmail) {
    //   throw new Error("Invalid email in token");
    // }

    if (!decoded || !decoded.user_id) {
      throw new Error("Invalid token");
    }

    const userId = decoded.user_id;
    console.log("userId ????????  ", userId);

    await Session.deleteOne({ user_id: userId });
  } catch (error) {
    throw error;
  }
}

export function generateTokens(email: string) {
  const newAccessToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "15m" });
  const newRefreshToken = jwt.sign({ email }, REFRESH_SECRET, { expiresIn: "7d" });
  return { newAccessToken, newRefreshToken };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}

export async function verifyToken(token: string): Promise<any> {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}
