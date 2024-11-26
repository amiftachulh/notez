import { useParams } from "react-router-dom";
import Container from "@/components/container";
import useNote from "@/hooks/queries/use-note";
import { extensions } from "@/lib/tiptap";
import { cn } from "@/lib/utils";
import { EditorProvider } from "@tiptap/react";
import { Loader2Icon } from "lucide-react";
import Toolbar from "./toolbar";

const editorClassname =
  "prose dark:prose-invert px-3 sm:px-0 pb-3 focus:outline-none mx-auto before:first:[&>p.is-editor-empty]:text-muted-foreground before:first:[&>p.is-editor-empty]:content-[attr(data-placeholder)] before:first:[&>p.is-editor-empty]:float-left before:first:[&>p.is-editor-empty]:h-0 before:first:[&>p.is-editor-empty]:pointer-events-none";

export function Component() {
  const { id } = useParams();
  const query = useNote(id as string);

  if (query.isPending) {
    return (
      <div className="grid h-[calc(100svh-4rem)] place-items-center">
        <Loader2Icon className="size-10 animate-spin" />
      </div>
    );
  }

  if (query.isError) {
    return null;
  }

  if (query.data.role !== "viewer") {
    return (
      <EditorProvider
        slotBefore={<Toolbar title={query.data.title} />}
        extensions={extensions}
        content={query.data.content ?? ""}
        editorProps={{
          attributes: {
            class: editorClassname,
          },
        }}
      />
    );
  }

  return (
    <Container className={cn(editorClassname, "p-4")}>
      <h1>{query.data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: query.data.content ?? "" }} />
    </Container>
  );
}
