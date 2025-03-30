import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
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
  const token = generateToken(email);
  setTokenCookie(response, token);

  const session = {
    user_id: newUser._id,
    token: token,
  };

  const result = await db.collection("sessions").insertOne(session);

  await newUser.save();

  return { status: 201, message: "session started" };
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

// ✅ Authentifier un utilisateur
export async function authenticateUser(email: string, password: string) {
  await connectToDb();

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const token = generateToken(user._id.toString()); // ✅ Génère un token
  return token; // Le token peut être renvoyé ou stocké dans un cookie
}

// ✅ Déconnexion de l'utilisateur
export async function logoutUser(request: Request, response: NextResponse) {
  try {
    const token = await getTokenFromCookie(request); // ✅ Extraire le token du cookie
    console.log(`Token extracted: ${token}`);

    removeTokenCookie(response); // ✅ Supprimer le token du cookie
    return response.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return response.json({ message: "Error during logout" });
  }
}
