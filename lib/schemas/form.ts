import { z } from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  fieldsCount: z
    .number()
    .int("Must be a whole number")
    .min(0, "Must be at least 0")
    .max(50, "Must be at most 50"),
  status: z.enum(["draft", "active", "archived"], {
    message: "Please select a valid status",
  }),
});

export const fullFormSchema = formSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type FormData = z.infer<typeof formSchema>;
export type Form = z.infer<typeof fullFormSchema>;
