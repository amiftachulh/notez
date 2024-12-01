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
import useUpdateEmail from "@/hooks/mutations/use-update-email";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { emailSchema, EmailSchema } from "@/schemas/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function EmailForm() {
  const { auth } = useAuth();
  const mutation = useUpdateEmail();
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: auth!.email,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    mutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          toast.success("Email updated successfully.");
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} />
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
