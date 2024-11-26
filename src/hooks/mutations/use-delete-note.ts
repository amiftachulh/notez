import axios from "@/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteNote(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/notes/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
