import { useParams } from "react-router-dom";
import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateAvatar } from "@/lib/dicebear";
import axios from "@/services/axios";
import { Note, NoteMember, NoteRole } from "@/types/notes";
import { AxiosError } from "axios";
import { CheckIcon, EllipsisVerticalIcon } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";

type Props = Omit<NoteMember, "role" | "created_at"> & {
  role?: NoteRole;
  created_at?: string;
};

export default function Member(props: Props) {
  const { auth } = useAuth();
  const { id } = useParams();
  const { data, mutate } = useSWR<Note>(`/notes/${id}`);

  async function updateMemberRole(role: NoteRole) {
    if (auth?.id !== data?.owner.id || role === props.role) return;

    try {
      await axios.patch(`/notes/${id}/members/${props.id}`, { role });
      await mutate();
      toast.success("Role has been updated successfully.");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  }

  async function kickMember() {
    if (auth?.id !== data?.owner.id) return;

    try {
      await axios.delete(`/notes/${id}/members/${props.id}`);
      await mutate();
      toast.success("Member has been kicked successfully.");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  }

  return (
    <div className="flex gap-2 py-2">
      <Avatar>
        <AvatarImage src={generateAvatar(props.name ?? props.email)} />
      </Avatar>
      <div>
        <div className="font-medium">
          {props.name ?? "-"}{" "}
          {props.role !== undefined && (
            <Badge variant="outline" className="capitalize">
              {props.role}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{props.email}</div>
      </div>
      {auth && props.role !== undefined && (
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto">
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => updateMemberRole("editor")}>
                    Editor {props.role === "editor" && <CheckIcon className="ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateMemberRole("viewer")}>
                    Viewer {props.role === "viewer" && <CheckIcon className="ml-auto" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={kickMember}>Kick</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
