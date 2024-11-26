import { NoteSchema } from "@/schemas/notes";
import axios from "@/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateNote(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NoteSchema) => {
      const res = await axios.put(`/notes/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
