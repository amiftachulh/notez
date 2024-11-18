import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";

export default function Members(props: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite user to your note</DialogTitle>
          <DialogDescription>
            Please enter the email address of the user you want to invite to this note.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>Footer</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
