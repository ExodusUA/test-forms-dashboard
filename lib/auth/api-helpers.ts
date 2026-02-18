import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface JWTPayload {
  userId: string;
  email: string;
  role: "individual" | "admin";
}

// Check if user has admin role
export async function requireAdmin(request: NextRequest): Promise<JWTPayload> {
  const user = await verifyAuthToken(request);

  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return user;
}

// Verify JWT token from cookies
export async function verifyAuthToken(
  request: NextRequest,
): Promise<JWTPayload> {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    throw new Error("Invalid or expired token");
  }
}
