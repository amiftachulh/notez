import { Order } from ".";

export type NoteRole = "editor" | "viewer";

export type Note = {
  id: string;
  title: string;
  content: string | null;
  role: NoteRole | null;
  owner: Omit<NoteMember, "role" | "created_at">;
  members: NoteMember[];
  created_at: string;
  updated_at: string;
};

export type UserNote = Omit<Note, "content" | "owner"> & { user_id: string };

export type NoteMember = {
  id: string;
  email: string;
  name: string | null;
  role: NoteRole;
  created_at: string;
};

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

export type NotesQuery = {
  q?: string;
  page?: number;
  page_size?: number;
  // sort?: "id" | "title" | "created_at" | "updated_at";
  sort?: string;
  order?: Order;
};
