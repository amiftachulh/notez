import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { updatePasswordSchema, UpdatePasswordSchema } from "@/schemas/users";
import axios, { fetcher } from "@/services/axios";
import { User } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";

export default function PasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWR<User>("/auth/check", fetcher);
  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    try {
      await axios.patch("/profile/password", data);
      await mutate();
      form.reset();
      toast.success("Password updated successfully.");
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error.response?.data.error;
        Object.keys(err).forEach((key) => {
          form.setError(
            key as keyof UpdatePasswordSchema,
            { message: err[key] },
            { shouldFocus: true }
          );
        });
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
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    className="pr-10"
                    placeholder="Your current password"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-0 px-3"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                  >
                    {showCurrentPassword ? (
                      <EyeClosedIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    placeholder="Your new password"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-0 px-3"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-10"
                    placeholder="Retype your new password"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-0 px-3"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeClosedIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
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
