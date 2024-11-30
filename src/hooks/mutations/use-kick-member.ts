import axios from "@/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type MutationArgs = {
  id: string;
  memberId: string;
};

export default function useKickMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, memberId }: MutationArgs) => {
      const res = await axios.delete(`/notes/${id}/members/${memberId}`);
      return res.data;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    },
  });
}
