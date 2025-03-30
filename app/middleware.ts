import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Clé secrète utilisée pour signer les tokens JWT
const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";

// Liste des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ["/login", "/register", "/api-doc"];

export async function middleware(req: NextRequest) {
  // Si la route demandée est publique, on passe directement à la suivante (pas de vérification d'authentification)
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // On récupère le token et le refresh token depuis les cookies de la requête
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // Si aucun des deux tokens n'existe, on redirige l'utilisateur vers la page de connexion
  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Vérification de la validité du token JWT
    jwt.verify(token!, SECRET_KEY);
    // Si le token est valide, on laisse passer la requête
    return NextResponse.next();
  } catch (error) {
    // Si le token est invalide, mais qu'un refresh token existe, on tente de rafraîchir le token
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Tentative de rafraîchissement du token en envoyant une requête à l'API pour obtenir un nouveau token
    try {
      const refreshResponse = await fetch(new URL("/api/auth/refresh", req.url), {
        method: "POST",
        headers: { Cookie: `refreshToken=${refreshToken}` },
      });

      if (!refreshResponse.ok) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Si le rafraîchissement est réussi, on extrait le nouveau token et on le remet dans les cookies
      const { token: newToken } = await refreshResponse.json();
      const response = NextResponse.next();
      response.cookies.set("token", newToken, { httpOnly: true, secure: true, path: "/" });

      return response;
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

// Configuration pour indiquer les routes qui doivent passer par ce middleware
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
