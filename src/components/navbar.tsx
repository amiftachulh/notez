import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateAvatar } from "@/lib/dicebear";
import { AvatarImage } from "@radix-ui/react-avatar";
import { AxiosError } from "axios";
import { Loader2Icon, LogOutIcon, MoonIcon, NotepadTextIcon, SunIcon } from "lucide-react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import Invitations from "./invitations";
import { useAuth } from "./providers/auth-provider";
import { useTheme } from "./providers/theme-provider";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function Navbar({ isDashboard }: { isDashboard?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-sidebar">
      <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between gap-2 px-3">
        <Link
          to="/dashboard"
          className="flex items-center justify-between gap-2 text-lg font-semibold"
        >
          <NotepadTextIcon strokeWidth={1.5} />
          <span>Notez</span>
        </Link>
        <div className="flex items-center gap-2">
          {isDashboard && <Invitations />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          {isDashboard ? (
            <Profile />
          ) : (
            <Button asChild>
              <Link to="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

function Profile() {
  const [loading, setLoading] = useState(false);

  const { mutate } = useSWRConfig();
  const { auth, setAuth, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      mutate(() => true, undefined, { revalidate: false });
      navigate("/auth/login");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setAuth(null);
        navigate("/auth/login");
        return;
      }
      toast.error("Error logging out");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarImage src={generateAvatar(auth!.name ?? auth!.email)} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go to profile</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        variant="ghost"
        className="sm:bg-secondary sm:text-secondary-foreground sm:shadow-sm sm:hover:bg-secondary/80"
        disabled={loading}
        onClick={handleLogout}
      >
        {loading ? <Loader2Icon /> : <LogOutIcon />}
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </>
  );
}
