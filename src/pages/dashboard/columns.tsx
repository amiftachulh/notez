import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/providers/auth-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useDeleteNote from "@/hooks/mutations/use-delete-note";
import { UserNote } from "@/types/notes";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

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
    enableSorting: false,
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
    enableSorting: false,
  },
];

const errorMessage = "An error occurred while deleting the note.";

function DeleteButton({ note }: { note: UserNote }) {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();

  const mutation = useDeleteNote(note.id);
  async function deleteNote() {
    mutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Note deleted successfully.");
        setOpen(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message || errorMessage);
        } else {
          toast.error(errorMessage);
        }
      },
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" disabled={auth!.id !== note.user_id}>
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {note.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this note? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              loading={mutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                deleteNote();
              }}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
