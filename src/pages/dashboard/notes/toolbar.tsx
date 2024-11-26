import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AutosizeTextarea, AutosizeTextAreaRef } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useUpdateNote from "@/hooks/mutations/use-update-note";
import { NOTE_MAX_CONTENT_BYTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Editor, useCurrentEditor } from "@tiptap/react";
import { AxiosError } from "axios";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  UnderlineIcon,
  Undo,
} from "lucide-react";
import { toast } from "sonner";
import Actions from "./actions";

type Level = 1 | 2 | 3 | 4 | 5 | 6;

type Props = {
  title: string;
};

const errorMessage = "An error occurred while updating the note.";

export default function Toolbar({ title }: Props) {
  const [isPinned, setIsPinned] = useState(false);
  const [currentHeading, setCurrentHeading] = useState("p");
  const textAreaRef = useRef<AutosizeTextAreaRef>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { editor } = useCurrentEditor();
  const { id } = useParams();

  useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPinned(entry.intersectionRatio < 1);
      },
      { threshold: 1 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  const mutation = useUpdateNote(id as string);
  async function updateNote() {
    if (!editor || !textAreaRef.current) return;

    const value = textAreaRef.current.textArea.value.trim();
    if (value === "") {
      toast.error("Title cannot be empty.");
      return;
    }
    if (value.length > 300) {
      toast.error("Title must be at most 300 characters.");
      return;
    }

    const encoder = new TextEncoder();
    const html = editor.getHTML();
    const size = encoder.encode(html).length;
    if (size > NOTE_MAX_CONTENT_BYTES) {
      toast.error("Content is too large to save.");
      return;
    }

    mutation.mutate(
      {
        title: value,
        content: html,
      },
      {
        onSuccess: () => {
          toast.success("Note updated successfully.");
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.message || errorMessage);
          } else {
            toast.error(errorMessage);
          }
        },
      }
    );
  }

  useEffect(() => {
    if (!editor) return;

    function updateHeading({ editor }: { editor: Editor }) {
      if (editor.isActive("heading", { level: 1 })) {
        setCurrentHeading("1");
      } else if (editor.isActive("heading", { level: 2 })) {
        setCurrentHeading("2");
      } else if (editor.isActive("heading", { level: 3 })) {
        setCurrentHeading("3");
      } else if (editor.isActive("heading", { level: 4 })) {
        setCurrentHeading("4");
      } else if (editor.isActive("heading", { level: 5 })) {
        setCurrentHeading("5");
      } else if (editor.isActive("heading", { level: 6 })) {
        setCurrentHeading("6");
      } else {
        setCurrentHeading("p");
      }
    }

    editor.on("transaction", updateHeading);

    return () => {
      editor.off("transaction", updateHeading);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <div className="flex justify-center p-4">
        <AutosizeTextarea
          ref={textAreaRef}
          className="w-[65ch] resize-none border-none text-center text-xl font-semibold md:text-2xl"
          placeholder="Title"
          defaultValue={title}
          minHeight={1}
        />
      </div>
      <div
        ref={toolbarRef}
        className={cn("sticky -top-[1px] z-10 mb-3 border-b-transparent bg-background py-2", {
          "border-b border-b-border": isPinned,
        })}
      >
        <div className="flex flex-wrap justify-center gap-2">
          <ToggleGroup type="multiple">
            <ToggleGroupItem
              value="bold"
              title="Bold"
              aria-label="Toggle bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              data-state={editor.isActive("bold") ? "on" : "off"}
            >
              <Bold className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="italic"
              title="Italic"
              aria-label="Toggle italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              data-state={editor.isActive("italic") ? "on" : "off"}
            >
              <Italic className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="underline"
              title="Underline"
              aria-label="Toggle underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              data-state={editor.isActive("underline") ? "on" : "off"}
            >
              <UnderlineIcon className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="strikethrough"
              title="Strikethrough"
              aria-label="Toggle strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              data-state={editor.isActive("strike") ? "on" : "off"}
            >
              <Strikethrough className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation="vertical" />
          <Select
            value={currentHeading}
            onValueChange={(value) => {
              if (value === "p") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .setHeading({ level: parseInt(value) as Level })
                  .run();
              }
            }}
          >
            <SelectTrigger className="w-[15ch]" title="Select heading">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Heading 1</SelectItem>
              <SelectItem value="2">Heading 2</SelectItem>
              <SelectItem value="3">Heading 3</SelectItem>
              <SelectItem value="4">Heading 4</SelectItem>
              <SelectItem value="5">Heading 5</SelectItem>
              <SelectItem value="6">Heading 6</SelectItem>
              <SelectItem value="p">Normal</SelectItem>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" />
          <ToggleGroup type="single">
            <ToggleGroupItem
              value="left"
              title="Align left"
              aria-label="Align left"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              disabled={!editor.can().chain().focus().setTextAlign("left").run()}
              data-state={editor.isActive({ textAlign: "left" }) ? "on" : "off"}
            >
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="center"
              title="Align center"
              aria-label="Align center"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              disabled={!editor.can().chain().focus().setTextAlign("center").run()}
              data-state={editor.isActive({ textAlign: "center" }) ? "on" : "off"}
            >
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="right"
              title="Align right"
              aria-label="Align right"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              disabled={!editor.can().chain().focus().setTextAlign("right").run()}
              data-state={editor.isActive({ textAlign: "right" }) ? "on" : "off"}
            >
              <AlignRight className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="justify"
              title="Align justify"
              aria-label="Align justify"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              disabled={!editor.can().chain().focus().setTextAlign("justify").run()}
              data-state={editor.isActive({ textAlign: "justify" }) ? "on" : "off"}
            >
              <AlignJustify className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation="vertical" />
          <ToggleGroup type="single">
            <ToggleGroupItem
              value="unordered"
              title="Bullet list"
              aria-label="Toggle unordered list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
              data-state={editor.isActive("bulletList") ? "on" : "off"}
            >
              <List className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="ordered"
              title="Ordered list"
              aria-label="Toggle ordered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
              data-state={editor.isActive("orderedList") ? "on" : "off"}
            >
              <ListOrdered className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation="vertical" />
          <ToggleGroup type="multiple">
            <ToggleGroupItem
              value="blockquote"
              title="Blockquote"
              aria-label="Toggle blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              disabled={!editor.can().chain().focus().toggleBlockquote().run()}
              data-state={editor.isActive("blockquote") ? "on" : "off"}
            >
              <Quote className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="code"
              title="Code block"
              aria-label="Toggle code block"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
              data-state={editor.isActive("codeBlock") ? "on" : "off"}
            >
              <Code className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation="vertical" />
          <ButtonGroup>
            <Button
              variant="ghost"
              size="icon"
              title="Undo"
              aria-label="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <Undo className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Redo"
              aria-label="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <Redo className="size-4" />
            </Button>
          </ButtonGroup>
          <Button
            variant="ghost"
            className="min-w-[8ch] sm:bg-primary sm:text-primary-foreground sm:shadow sm:hover:bg-primary/90 sm:hover:text-primary-foreground"
            loading={mutation.isPending}
            onClick={updateNote}
          >
            Save
          </Button>
          <Actions />
        </div>
      </div>
    </>
  );
}
