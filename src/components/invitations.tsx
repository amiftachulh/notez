import { useState } from "react";
import axios, { fetcher } from "@/services/axios";
import { NoteInvitation } from "@/types/notes";
import { AxiosError } from "axios";
import { AlertCircleIcon, MailIcon } from "lucide-react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Respond = "accept" | "decline";

export default function Invitations() {
  const [loading, setLoading] = useState<Respond | null>(null);

  const { data, error, isLoading } = useSWR<NoteInvitation[]>("/note-invitations", fetcher);
  const { mutate } = useSWRConfig();

  async function respondInvitation(id: string, accept: boolean) {
    try {
      await axios.patch(`/note-invitations/${id}`, { accept });
      toast.success(`Invitation ${accept ? "accepted" : "declined"} successfully`);
      mutate("/note-invitations");
      if (accept) {
        mutate("/notes");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error responding to invitation");
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MailIcon />
          {data && data.length > 0 && (
            <span className="absolute right-0 top-0 rounded-full bg-primary px-1 text-xs text-primary-foreground">
              {data.length > 99 ? "99+" : data.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <div className="text-lg font-semibold leading-none">Invitations</div>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : data && data.length > 0 ? (
            <Accordion type="single" collapsible>
              {data.map((invitation) => (
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
                      loading={loading === "accept"}
                      onClick={() => {
                        setLoading("accept");
                        respondInvitation(invitation.id, true);
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      loading={loading === "decline"}
                      onClick={() => {
                        setLoading("decline");
                        respondInvitation(invitation.id, false);
                      }}
                    >
                      Decline
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : error ? (
            <Alert>
              <AlertCircleIcon className="size-4" />
              <AlertDescription>An error occurred while getting invitations data.</AlertDescription>
            </Alert>
          ) : (
            <div className="text-sm text-muted-foreground">Currently there are no invitations.</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
