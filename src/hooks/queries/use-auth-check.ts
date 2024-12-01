import axios from "@/services/axios";
import { User } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

export default function useAuthCheck() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await axios.get<User>("/auth/check");
      return res.data;
    },
  });
}
