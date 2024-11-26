import { Navigate, Outlet } from "react-router-dom";
import useInterceptor from "@/hooks/use-interceptor";
import Navbar from "../navbar";
import { useAuth } from "../providers/auth-provider";

export default function PrivateRoutes() {
  const { auth } = useAuth();

  useInterceptor();

  return auth ? (
    <>
      <Navbar isDashboard />
      <Outlet />
    </>
  ) : (
    <Navigate to="/auth/login" replace />
  );
}
