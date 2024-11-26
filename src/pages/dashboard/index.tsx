import { useState } from "react";
import { useForm } from "react-hook-form";
import Container from "@/components/container";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useCreateNote from "@/hooks/mutations/use-create-note";
import useNotes from "@/hooks/queries/use-notes";
import useDebounceFn from "@/hooks/use-debounce-fn";
import useTableState from "@/hooks/use-table-state";
import { noteSchema, NoteSchema } from "@/schemas/notes";
import { NotesQuery } from "@/types/notes";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { columns } from "./columns";
import DataTable from "./data-table";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  const { queryParams, setQueryParams, sorting, onSortingChange, pagination, onPaginationChange } =
    useTableState<NotesQuery>({
      sort: "updated_at",
      order: "desc",
    });
  const query = useNotes(queryParams);
  const debounceSetQueryParams = useDebounceFn(setQueryParams);
  const form = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: null,
    },
  });
  const mutation = useCreateNote();

  const onSubmit = form.handleSubmit(async (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Note added successfully");
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });
  });

  return (
    <Container className="p-4">
      <div className="flex items-center gap-4">
        <Input
          className="md:max-w-[20rem]"
          placeholder="Search notes..."
          onChange={(e) =>
            debounceSetQueryParams((prev) => ({ ...prev, q: e.target.value || undefined }))
          }
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="ml-auto">
              <PlusCircleIcon />
              <span className="hidden sm:inline">Add Note</span>
            </Button>
          </PopoverTrigger>
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
                <Button type="submit" loading={mutation.isPending}>
                  Save
                </Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </div>
      <DataTable
        columns={columns}
        data={query.data?.items ?? []}
        queryState={{
          isPending: query.isPending,
          isFetching: query.isFetching,
          isError: query.isError,
          refetch: query.refetch,
        }}
        sorting={sorting}
        onSortingChange={onSortingChange}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={query.data?.total ?? 0}
      />
    </Container>
  );
}
