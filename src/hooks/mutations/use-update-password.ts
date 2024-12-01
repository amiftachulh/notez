import { UpdatePasswordSchema } from "@/schemas/users";
import axios from "@/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePasswordSchema) => {
      const res = await axios.patch("/profile/password", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
