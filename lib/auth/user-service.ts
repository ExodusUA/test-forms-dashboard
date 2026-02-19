import store from "@/data/users.json";
import { SignJWT } from "jose";
import { User, userSchema } from "../types/user";
import { JWT_SECRET } from "./jwt-config";

const users = store.map((user) => userSchema.parse(user));

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
