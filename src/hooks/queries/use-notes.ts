import axios from "@/services/axios";
import { NotesQuery, UserNote } from "@/types/notes";
import { Pagination } from "@/types/response";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useNotes(params?: NotesQuery) {
  return useQuery({
    queryKey: ["notes", params],
    queryFn: async () => {
      const res = await axios.get<Pagination<UserNote>>("/notes", { params });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}
