import { useState } from "react";
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
import { emailSchema, EmailSchema } from "@/schemas/users";
import axios, { fetcher } from "@/services/axios";
import { User } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import useSWR from "swr";

export default function EmailForm() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const { data, mutate } = useSWR<User>("/auth/check", fetcher);
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: data!.email ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    try {
      await axios.patch("/profile/email", { email: data.email });
      const auth = await mutate();
      if (auth) {
        form.reset({ email: auth.email });
        setAuth(auth);
      }
      toast.success("Email updated successfully.");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
        <Button loading={loading}>Save</Button>
      </form>
    </Form>
  );
}
