export type NoteRole = "editor" | "viewer";

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  role?: NoteRole;
  created_at: string;
  updated_at: string;
};

export type UserNote = Omit<Note, "content">;

export type NoteInvitation = {
  id: string;
  note: {
    id: string;
    title: string;
  };
  inviter: {
    id: string;
    email: string;
    name: string | null;
  };
  role: NoteRole;
  created_at: string;
};
