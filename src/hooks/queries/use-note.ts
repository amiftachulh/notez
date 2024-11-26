import axios from "@/services/axios";
import { Note } from "@/types/notes";
import { useQuery } from "@tanstack/react-query";

export default function useNote(id: string) {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: async () => {
      const res = await axios.get<Note>(`/notes/${id}`);
      return res.data;
    },
  });
}
