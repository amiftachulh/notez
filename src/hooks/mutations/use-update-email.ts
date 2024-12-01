import { EmailSchema } from "@/schemas/users";
import axios from "@/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email }: EmailSchema) => {
      const res = await axios.patch("/profile/email", { email });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
