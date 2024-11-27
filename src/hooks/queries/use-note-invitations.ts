import axios from "@/services/axios";
import { NoteInvitation } from "@/types/notes";
import { useQuery } from "@tanstack/react-query";

export default function useNoteInvitations() {
  return useQuery({
    queryKey: ["note-invitations"],
    queryFn: async () => {
      const res = await axios.get<NoteInvitation[]>("/note-invitations");
      return res.data;
    },
  });
}
