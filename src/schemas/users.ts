import { z } from "zod";

export const nameSchema = z.object({
  name: z.string().trim().max(256, "Name must be less than 256 characters."),
});

export type NameSchema = z.infer<typeof nameSchema>;

export const emailSchema = z.object({
  email: z.string().trim().email("Email address is not valid."),
});

export type EmailSchema = z.infer<typeof emailSchema>;

export const updatePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(64, "Password must be less than 64 characters.")
      .regex(/^[^\p{Cc}]+$/u, "Password must not contain invalid characters."),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
