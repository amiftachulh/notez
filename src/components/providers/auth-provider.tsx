import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "@/services/axios";
import { User } from "@/types/users";
import { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";

type AuthProviderState = {
  auth: User | null;
  setAuth: (auth: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthProviderState>({} as AuthProviderState);

export function AuthProvider() {
  const [auth, setAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get("/auth/check");
        setAuth(res.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          console.log("Not authenticated");
        } else {
          console.error("Error checking authenticated");
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    const res = await axios.post("/auth/login", { email, password });
    setAuth(res.data);
  }

  async function logout() {
    await axios.post("/auth/logout");
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {loading ? <Loader /> : <Outlet />}
    </AuthContext.Provider>
  );
}

function Loader() {
  return (
    <main className="grid h-screen place-items-center">
      <Loader2Icon size={32} className="animate-spin" />
    </main>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
