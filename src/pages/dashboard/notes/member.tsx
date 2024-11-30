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
import useKickMember from "@/hooks/mutations/use-kick-member";
import useUpdateMemberRole from "@/hooks/mutations/use-update-member-role";
import useNote from "@/hooks/queries/use-note";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { generateAvatar } from "@/lib/dicebear";
import { NoteMember, NoteRole } from "@/types/notes";
import { AxiosError } from "axios";
import { CheckIcon, EllipsisVerticalIcon } from "lucide-react";
import { toast } from "sonner";

type Props = Omit<NoteMember, "role" | "created_at"> & {
  role?: NoteRole;
  created_at?: string;
};

export default function Member(props: Props) {
  const { auth } = useAuth();
  const { id } = useParams();
  const { data } = useNote(id as string);
  const updateRole = useUpdateMemberRole();
  const kickMember = useKickMember();

  async function updateMemberRole(role: NoteRole) {
    if (auth!.id !== data!.owner.id || role === props.role) return;

    updateRole.mutate(
      { id: id as string, memberId: props.id, role },
      {
        onSuccess: () => {
          toast.success("Role has been updated successfully.");
        },
        onError: (error) => {
          const msg = error instanceof AxiosError && error.response?.data.message;
          toast.error(msg ? msg : GENERIC_ERROR_MESSAGE);
        },
      }
    );
  }

  async function kick() {
    if (auth!.id !== data!.owner.id) return;

    kickMember.mutate(
      { id: id as string, memberId: props.id },
      {
        onSuccess: () => {
          toast.success("Member has been kicked successfully.");
        },
        onError: (error) => {
          const msg = error instanceof AxiosError && error.response?.data.message;
          toast.error(msg ? msg : GENERIC_ERROR_MESSAGE);
        },
      }
    );
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
      {auth!.id === data!.owner.id && (
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
            <DropdownMenuItem onClick={kick}>Kick</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
