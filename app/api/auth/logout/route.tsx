// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { db } from "../../../api/lib/db";

// if (!process.env.JWT_SECRET) {
//   throw new Error("Missing JWT secret key in environment variables");
// }

// const SECRET_KEY = process.env.JWT_SECRET;

// export async function POST(req: Request) {
//   try {
//     // Récupération du token JWT stocké dans les cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ error: "No token found" }, { status: 401 });
//     }

//     let decodedToken;
//     try {
//       decodedToken = jwt.verify(token, SECRET_KEY);
//     } catch (error) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     const userId = (decodedToken as jwt.JwtPayload)?.id;
//     if (!userId) {
//       console.warn("⚠️ L'ID utilisateur est manquant dans le token");
//       return NextResponse.json({ error: "Invalid user ID" }, { status: 401 });
//     }

//     console.log(`🆔 ID utilisateur récupéré : ${userId}`);

//     // Suppression de la session de l'utilisateur en base de données
//     try {
//       const deleteResult = await db.collection("sessions").deleteOne({ user_id: userId });

//       if (deleteResult.deletedCount === 0) {
//         console.warn("⚠️ Aucune session trouvée pour l'utilisateur, possible déconnexion déjà effectuée.");
//       } else {
//         console.log("✅ Session supprimée avec succès");
//       }
//     } catch (dbError) {
//       console.error("❌ Erreur lors de la suppression de la session :", dbError);
//       return NextResponse.json({ error: "Database error during logout" }, { status: 500 });
//     }

//     // Suppression des cookies côté client
//     const response = NextResponse.json({ message: "Logged out successfully" });
//     response.cookies.set("token", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });
//     response.cookies.set("refreshToken", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });

//     console.log("✅ Cookies supprimés, l'utilisateur est maintenant déconnecté");

//     return response;
//   } catch (error: any) {
//     console.error("❌ Erreur inattendue dans le processus de déconnexion :", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { logoutUser } from "../../lib/authService";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    await logoutUser(userId);

    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.set("token", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
