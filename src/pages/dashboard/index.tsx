import { useState } from "react";
import { useForm } from "react-hook-form";
import Container from "@/components/container";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useCreateNote from "@/hooks/mutations/use-create-note";
import useNotes from "@/hooks/queries/use-notes";
import useDebounceFn from "@/hooks/use-debounce-fn";
import useTableState from "@/hooks/use-table-state";
import { cn } from "@/lib/utils";
import { noteSchema, NoteSchema } from "@/schemas/notes";
import { NotesQuery } from "@/types/notes";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { CheckIcon, ChevronsUpDownIcon, PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { columns } from "./columns";
import DataTable from "./data-table";

const roles = [
  {
    value: "owner",
    label: "Owner",
  },
  {
    value: "editor",
    label: "Editor",
  },
  {
    value: "viewer",
    label: "Viewer",
  },
];

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [roleFilterOpen, setRoleFilterOpen] = useState(false);
  const [roleValue, setRoleValue] = useState("");

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
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
        <Input
          placeholder="Search notes..."
          className="w-full sm:flex-1"
          onChange={(e) =>
            debounceSetQueryParams((prev) => ({ ...prev, q: e.target.value || undefined }))
          }
        />
        <Popover open={roleFilterOpen} onOpenChange={setRoleFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between font-normal sm:w-[120px]",
                !roleValue && "text-muted-foreground"
              )}
            >
              {roleValue ? roles.find((role) => role.value === roleValue)?.label : "Role"}
              <ChevronsUpDownIcon className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 sm:w-[120px]">
            <Command>
              <CommandList>
                <CommandEmpty>No role found.</CommandEmpty>
                <CommandGroup>
                  {roles.map((role) => (
                    <CommandItem
                      key={role.value}
                      value={role.value}
                      onSelect={(val) => {
                        setRoleValue(val === roleValue ? "" : val);
                        setQueryParams((prev) => ({
                          ...prev,
                          role: val === roleValue ? undefined : (val as NotesQuery["role"]),
                        }));
                        setRoleFilterOpen(false);
                      }}
                    >
                      {role.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto",
                          roleValue === role.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button>
              <PlusCircleIcon />
              <span>Add Note</span>
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
