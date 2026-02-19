import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "./lib/auth/jwt-config";

interface JWTPayload {
  userId: string;
  email: string;
  role: "individual" | "admin";
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/", "/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Private routes - require authentication
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect if already logged in
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin-only routes
  const adminRoutes = ["/forms/new"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isEditRoute = /^\/forms\/\d+$/.test(pathname); // /forms/:id

  if (isAdminRoute || isEditRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const decoded = payload as unknown as JWTPayload;

      if (decoded.role !== "admin") {
        const url = new URL("/forms", request.url);
        url.searchParams.set("error", "admin_required");
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
