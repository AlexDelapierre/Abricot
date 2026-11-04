import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasToken = request.cookies.has("token");
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!hasToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard",
    "/projects/:path*",
    "/profile",
  ],
};
