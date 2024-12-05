import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthCheck from "@/hooks/queries/use-auth-check";
import { generateAvatar } from "@/lib/dicebear";
import EmailForm from "./email-form";
import NameForm from "./name-form";
import PasswordForm from "./password-form";

export default function Profile() {
  const { data, isError, error, isPending } = useAuthCheck();

  if (isError) {
    throw error;
  }

  return (
    <div className="mx-auto max-w-[1024px] p-4">
      {isPending && <p>Loading...</p>}
      {data && (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <Avatar className="size-40 self-center sm:self-auto">
            <AvatarImage src={generateAvatar(data.name ?? data.email)} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Configure your name, email, and password.
            </p>
            <div className="w-full space-y-4">
              <NameForm />
              <EmailForm />
              <PasswordForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
