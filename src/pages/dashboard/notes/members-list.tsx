import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetcher } from "@/services/axios";
import { Note } from "@/types/notes";
import { DialogProps } from "@radix-ui/react-dialog";
import useSWR from "swr";
import Member from "./member";

export default function MembersList(props: DialogProps) {
  const { id } = useParams();
  const { data } = useSWR<Note>(`/notes/${id}`, fetcher);

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Members List</DialogTitle>
          <DialogDescription>List of members who have access to this note.</DialogDescription>
        </DialogHeader>
        <div>
          <h3 className="text-sm font-medium uppercase text-muted-foreground">Owner</h3>
          <Member {...data!.owner} />
        </div>
        {data!.members.length > 0 && (
          <div>
            <h3 className="text-sm font-medium uppercase text-muted-foreground">Members</h3>
            {data!.members.map((member) => (
              <Member key={member.id} {...member} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
