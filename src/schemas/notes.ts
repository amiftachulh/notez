import { NOTE_MAX_CONTENT_BYTES } from "@/lib/constants";
import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(300, "Title must be less than 300 characters."),
  content: z
    .string()
    .nullable()
    .refine((val) => val === null || Buffer.byteLength(val, "utf-8") <= NOTE_MAX_CONTENT_BYTES, {
      message: `Content must be less than 5 MB.`,
    }),
});

export type NoteSchema = z.infer<typeof noteSchema>;
