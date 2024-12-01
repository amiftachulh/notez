import { NameSchema } from "@/schemas/users";
import axios from "@/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: NameSchema) => {
      const res = await axios.patch("/profile", { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
