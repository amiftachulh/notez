import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useNote from "@/hooks/queries/use-note";
import { DialogProps } from "@radix-ui/react-dialog";
import Member from "./member";

export default function MembersList(props: DialogProps) {
  const { id } = useParams();
  const query = useNote(id as string);

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Members List</DialogTitle>
          <DialogDescription>List of members who have access to this note.</DialogDescription>
        </DialogHeader>
        <div>
          <h3 className="text-sm font-medium uppercase text-muted-foreground">Owner</h3>
          <Member {...query.data!.owner} />
        </div>
        {query.data!.members.length > 0 && (
          <div>
            <h3 className="text-sm font-medium uppercase text-muted-foreground">Members</h3>
            {query.data!.members.map((member) => (
              <Member key={member.id} {...member} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
