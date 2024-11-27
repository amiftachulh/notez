import { useState } from "react";
import useRespondNoteInvitation from "@/hooks/mutations/use-respond-note-invitation";
import useNoteInvitations from "@/hooks/queries/use-note-invitations";
import { AxiosError } from "axios";
import { AlertCircleIcon, MailIcon } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const errorMessage = "An error occurred while responding to the invitation.";

export default function Invitations() {
  const [loadingAction, setLoadingAction] = useState<{
    id: string;
    action: "accept" | "decline";
  } | null>(null);

  const query = useNoteInvitations();
  const mutation = useRespondNoteInvitation();

  async function handleRespondInvitation(id: string, accept: boolean) {
    setLoadingAction({ id, action: accept ? "accept" : "decline" });

    mutation.mutate(
      { id, accept },
      {
        onSuccess: () => {
          toast.success(`Invitation ${accept ? "accepted" : "declined"} successfully`);
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.message || errorMessage);
          } else {
            toast.error(errorMessage);
          }
        },
        onSettled: () => {
          setLoadingAction(null);
        },
      }
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MailIcon />
          {query.data && query.data.length > 0 && (
            <span className="absolute right-0 top-0 rounded-full bg-primary px-1 text-xs text-primary-foreground">
              {query.data.length > 99 ? "99+" : query.data.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <div className="text-lg font-semibold leading-none">Invitations</div>
          {query.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : query.isError ? (
            <Alert>
              <AlertCircleIcon className="size-4" />
              <AlertDescription>An error occurred while getting invitations data.</AlertDescription>
            </Alert>
          ) : query.data && query.data.length > 0 ? (
            <Accordion type="single" collapsible>
              {query.data.map((invitation) => (
                <AccordionItem key={invitation.id} value={invitation.id}>
                  <AccordionTrigger className="group">
                    <div>
                      <div className="font-medium group-hover:underline">
                        {invitation.note.title}{" "}
                        <Badge variant="secondary" className="capitalize">
                          {invitation.role}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Invited by {invitation.inviter.name ?? invitation.inviter.email}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex justify-end gap-2 pt-2">
                    <Button
                      loading={
                        loadingAction?.id === invitation.id && loadingAction.action === "accept"
                      }
                      disabled={loadingAction !== null}
                      onClick={() => handleRespondInvitation(invitation.id, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      loading={
                        loadingAction?.id === invitation.id && loadingAction.action === "decline"
                      }
                      disabled={loadingAction !== null}
                      onClick={() => handleRespondInvitation(invitation.id, false)}
                    >
                      Decline
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-sm text-muted-foreground">Currently there are no invitations.</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
