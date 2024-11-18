import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "@/services/axios";
import { UserNote } from "@/types/notes";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export const columns: ColumnDef<UserNote>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link to={`./notes/${row.original.id}`} className="hover:underline">
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.role ?? "owner"}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => new Date(row.original.updated_at).toLocaleString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <DeleteButton note={row.original} />,
  },
];

function DeleteButton({ note }: { note: UserNote }) {
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const { mutate } = useSWRConfig();

  async function deleteNote() {
    setLoading(true);
    try {
      await axios.delete(`/notes/${note.id}`);
      toast.success("Note deleted successfully");
      await mutate("/notes");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An error occurred while deleting the note");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      loading={loading}
      disabled={auth?.id !== note.user_id}
      onClick={deleteNote}
    >
      <Trash2Icon />
    </Button>
  );
}
