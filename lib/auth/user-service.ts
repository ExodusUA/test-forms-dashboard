import store from "@/data/users.json";
import { SignJWT } from "jose";
import { User, userSchema } from "../types/user";

const users = store.map((user) => userSchema.parse(user));

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function authenticateUser(
  email: string,
  role: "individual" | "admin",
) {
  const user = users.find(
    (user: User) => user.email === email && user.role === role,
  );

  if (!user) {
    throw new Error("User not found");
  }

  return generateToken(String(user.id), user.email, user.role);
}

async function generateToken(
  userId: string,
  email: string,
  role: "individual" | "admin",
) {
  const token = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}
