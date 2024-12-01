import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUpdateProfile from "@/hooks/mutations/use-update-profile";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { nameSchema, NameSchema } from "@/schemas/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function NameForm() {
  const { auth } = useAuth();
  const mutation = useUpdateProfile();
  const form = useForm<NameSchema>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: auth!.name ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    mutation.mutate(
      { name: data.name },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully.");
        },
        onError: (error) => {
          const msg = error instanceof AxiosError && error.response?.data.message;
          toast.error(msg || GENERIC_ERROR_MESSAGE);
        },
      }
    );
  });

  return (
    <Form {...form}>
      <form className="space-y-4 rounded-md border p-6" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Display name <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button loading={mutation.isPending}>Save</Button>
      </form>
    </Form>
  );
}
