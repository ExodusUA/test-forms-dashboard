import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  role: z.enum(["admin", "individual"]),
});

export type User = z.infer<typeof userSchema>;
export type UserRole = User["role"];
