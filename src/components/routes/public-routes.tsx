import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/auth-provider";

export default function PublicRoutes() {
  const { auth } = useAuth();

  return !auth ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
