import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  role: z.enum(["individual", "admin"], {
    message: "Invalid role",
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
