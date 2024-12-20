import { Link, useNavigate } from "react-router-dom";
import { generateAvatar } from "@/lib/dicebear";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LogOutIcon, MoonIcon, NotepadTextIcon, SunIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";
import Invitations from "./invitations";
import { useAuth } from "./providers/auth-provider";
import { useTheme } from "./providers/theme-provider";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar({ isDashboard }: { isDashboard?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { auth, setAuth, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleLogout() {
    try {
      await logout();
      queryClient.clear();
      navigate("/auth/login");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setAuth(null);
        navigate("/auth/login");
        return;
      }
      toast.error("Error logging out");
    }
  }

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
        <div className="flex items-center gap-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-8 cursor-pointer" title="Menu">
                  <AvatarImage src={generateAvatar(auth!.name ?? auth!.email)} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/dashboard/profile">
                    <UserIcon className="size-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOutIcon className="size-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
