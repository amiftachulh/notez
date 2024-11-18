import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Email address is not valid."),
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

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email address is not valid."),
  password: z.string().min(1, "Password is required."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
