import { z } from "zod";

export const createNoteInvitationSchema = z.object({
  email: z.string().trim().email(),
  note_id: z.string(),
  role: z.enum(["editor", "viewer"]),
});

export type CreateNoteInvitationSchema = z.infer<typeof createNoteInvitationSchema>;
