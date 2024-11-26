import { NoteSchema } from "@/schemas/notes";
import axios from "@/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NoteSchema) => {
      const res = await axios.post("/notes", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
