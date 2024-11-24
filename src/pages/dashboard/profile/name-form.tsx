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
import { nameSchema, NameSchema } from "@/schemas/users";
import axios, { fetcher } from "@/services/axios";
import { User } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useSWR from "swr";

export default function NameForm() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const { data, mutate } = useSWR<User>("/auth/check", fetcher);
  const form = useForm<NameSchema>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: data!.name ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    try {
      await axios.patch("/profile", { name: data.name ?? null });
      const auth = await mutate();
      if (auth) {
        form.reset({ name: auth.name ?? "" });
        setAuth(auth);
      }
      toast.success("Profile updated successfully.");
    } catch (_error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <Button loading={loading}>Save</Button>
      </form>
    </Form>
  );
}
