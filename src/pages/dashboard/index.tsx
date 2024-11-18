import { useState } from "react";
import { useForm } from "react-hook-form";
import Container from "@/components/container";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { noteSchema, NoteSchema } from "@/schemas/notes";
import axios, { fetcher } from "@/services/axios";
import { UserNote } from "@/types/notes";
import { Pagination } from "@/types/response";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { columns } from "./columns";
import DataTable from "./data-table";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<Pagination<UserNote>>("/notes", fetcher);
  const form = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: null,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    try {
      await axios.post("/notes", values);
      mutate();
      toast.success("Note added successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <Container className="p-3">
      <div className="flex items-center justify-between gap-3">
        <Input className="md:max-w-[20rem]" placeholder="Search notes..." />
        <Popover open={open} onOpenChange={setOpen}>
          <Button asChild>
            <PopoverTrigger>
              <PlusCircleIcon />
              <span className="hidden sm:inline">Add Note</span>
            </PopoverTrigger>
          </Button>
          <PopoverContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="grid gap-2">
                <div>
                  <h1 className="text-lg font-semibold">Add Note</h1>
                  <p className="text-sm text-muted-foreground">
                    Please enter a title for your note
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AutosizeTextarea
                          className="resize-none"
                          placeholder="Title"
                          minHeight={1}
                          maxLength={300}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              onSubmit();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" loading={loading}>
                  Save
                </Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading notes</p>
      ) : data ? (
        <DataTable columns={columns} data={data.items} />
      ) : null}
    </Container>
  );
}
