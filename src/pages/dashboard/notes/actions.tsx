import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useNote from "@/hooks/queries/use-note";
import { EllipsisVerticalIcon } from "lucide-react";
import Invite from "./invite";
import MembersList from "./members-list";

export default function Actions() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);

  const { id } = useParams();
  const { data } = useNote(id as string);
  const { auth } = useAuth();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {auth!.id === data!.owner.id && (
            <DropdownMenuItem onSelect={() => setInviteOpen(true)}>Invite</DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setMemberOpen(true)}>Members</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {auth!.id === data!.owner.id && <Invite open={inviteOpen} onOpenChange={setInviteOpen} />}
      <MembersList open={memberOpen} onOpenChange={setMemberOpen} />
    </>
  );
}
