import axios from "@/services/axios";
import { NoteInvitation } from "@/types/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type MutationArgs = {
  id: string;
  accept: boolean;
};

export default function useRespondNoteInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, accept }: MutationArgs) => {
      const res = await axios.patch(`/note-invitations/${id}`, { accept });
      return res.data;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["note-invitations"] });
      const previousInvitations = queryClient.getQueryData<NoteInvitation[]>(["note-invitations"]);
      if (previousInvitations) {
        const newInvitations = previousInvitations.filter((invitation) => invitation.id !== id);
        queryClient.setQueryData<NoteInvitation[]>(["note-invitations"], newInvitations);
      }
      return { previousInvitations };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note-invitations"] });
    },
  });
}
