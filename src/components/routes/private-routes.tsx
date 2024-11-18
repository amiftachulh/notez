import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../navbar";
import { useAuth } from "../providers/auth-provider";

export default function PrivateRoutes() {
  const { auth } = useAuth();

  return auth ? (
    <>
      <Navbar isDashboard />
      <Outlet />
    </>
  ) : (
    <Navigate to="/auth/login" replace />
  );
}
