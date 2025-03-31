import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import Session from "../../api/models/session";
import User from "../../api/models/user";
import { generateToken, getTokenFromCookie, removeTokenCookie, setTokenCookie } from "../lib/tokenService";
import { connectToDb, db } from "./db";

const ERROR_USER_EXISTS = "User already exists";
const ERROR_INTERNAL = "Internal server error";
const ERROR_DB_CONNECTION = "Database connection error";
const ERROR_CREDENTIAL = "Invalid credential";

export async function signupUser(name: string, email: string, password: string) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw { status: 409, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  const response = NextResponse.next();
  const token = await generateToken(email);
  setTokenCookie(response, token);

  const session = {
    user_id: newUser._id,
    token: token,
  };

  await db.collection("sessions").insertOne(session);

  await User.create(newUser);

  return NextResponse.json({ status: 201, data: newUser, message: "Session started" }, { status: 201 });
}

// if (!process.env.JWT_SECRET) {
//   throw new Error("Missing JWT_SECRET environment variable");
// }
// const SECRET_KEY = process.env.JWT_SECRET;

// export async function authenticateUser(email: string, password: string) {
//   const user = await User.findOne({ email });
//   if (!user) {
//     console.error("Unknown user", email);
//     throw new Error("Invalid credentials");
//   }

//   const passwordMatch = await bcrypt.compare(password, user.password);
//   if (!passwordMatch) {
//     throw new Error("Invalid credentials");
//   }

//   const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

//   await db.collection("sessions").insertOne({ user_id: user._id, jwt: token });

//   return token;
// }

export async function authenticateUser(email: string, password: string) {
  try {
    await connectToDb();
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: 404, error: "User not found" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw { status: 401, error: "401 Unauthorized" };
    }

    const response = NextResponse.next();
    const token = await generateToken(user.email);
    setTokenCookie(response, token);

    const session = Session.findOne({ user_id: user._id });

    if (!session) {
      const newSession = new Session({
        user_id: user._id,
        jwt: token,
      });
      await Session.create(newSession);
    } else {
      await Session.updateOne({ user_id: user._id }, { $set: { jwt: token } });
    }
  } catch (error: any) {
    console.log(error);
    throw { status: error.status, error: error.error };
  }

  return { status: 201, message: "session started" };
}

export async function logoutUser(request: Request, response: NextResponse) {
  try {
    await connectToDb();
    //const user = await Session.findOne({ user_id });

    const token = await getTokenFromCookie(request);
    console.log(`Token extracted: ${token}`);

    removeTokenCookie(response);

    return { status: 200, message: "session closed" };
  } catch (error) {
    console.error("Error during logout:", error);
    //return response.json({ message: "Error during logout" });
  }
}
