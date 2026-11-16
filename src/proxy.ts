import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Rediriger vers la connexion si pas de cookie (le token est vérifié par l'API)
  if (!request.cookies.has("token")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/projects/:path*", "/profile"],
};
