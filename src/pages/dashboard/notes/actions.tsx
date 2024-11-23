import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import Invite from "./invite";
import MembersList from "./members-list";

export default function Actions() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setInviteOpen(true)}>Invite</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setMemberOpen(true)}>Members</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Invite open={inviteOpen} onOpenChange={setInviteOpen} />
      <MembersList open={memberOpen} onOpenChange={setMemberOpen} />
    </>
  );
}
