import { useParams } from "react-router-dom";
import Container from "@/components/container";
import { extensions } from "@/lib/tiptap";
import { cn } from "@/lib/utils";
import { fetcher } from "@/services/axios";
import { Note } from "@/types/notes";
import { EditorProvider } from "@tiptap/react";
import { Loader2Icon } from "lucide-react";
import useSWR from "swr";
import Toolbar from "./toolbar";

const editorClassname =
  "prose dark:prose-invert px-3 sm:px-0 pb-3 focus:outline-none mx-auto before:first:[&>p.is-editor-empty]:text-muted-foreground before:first:[&>p.is-editor-empty]:content-[attr(data-placeholder)] before:first:[&>p.is-editor-empty]:float-left before:first:[&>p.is-editor-empty]:h-0 before:first:[&>p.is-editor-empty]:pointer-events-none";

export function Component() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR<Note>(`/notes/${id}`, fetcher);

  if (error) {
    throw new Error("Error fetching notes");
  }

  return isLoading ? (
    <div className="grid h-[calc(100svh-4rem)] place-items-center">
      <Loader2Icon className="size-10 animate-spin" />
    </div>
  ) : data ? (
    data.role !== "viewer" ? (
      <EditorProvider
        slotBefore={<Toolbar title={data.title} />}
        extensions={extensions}
        content={data.content ?? ""}
        editorProps={{
          attributes: {
            class: editorClassname,
          },
        }}
      />
    ) : (
      <Container className={cn(editorClassname, "p-4")}>
        <h1>{data.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: data.content ?? "" }} />
      </Container>
    )
  ) : null;
}
