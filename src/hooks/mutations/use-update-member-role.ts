import axios from "@/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type MutationArgs = {
  id: string;
  memberId: string;
  role: string;
};

export default function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, memberId, role }: MutationArgs) => {
      const res = await axios.patch(`/notes/${id}/members/${memberId}`, { role });
      return res.data;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    },
  });
}
