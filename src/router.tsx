import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/providers/auth-provider";
import PrivateRoutes from "./components/routes/private-routes";
import PublicRoutes from "./components/routes/public-routes";
import Home from "./pages";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/dashboard/profile";

export const router = createBrowserRouter(
  [
    {
      element: <AuthProvider />,
      children: [
        {
          path: "/auth",
          element: <PublicRoutes />,
          children: [
            { path: "register", element: <Register /> },
            { path: "login", element: <Login /> },
          ],
        },
        {
          element: <PrivateRoutes />,
          path: "/dashboard",
          children: [
            { path: "", element: <Dashboard /> },
            { path: "profile", element: <Profile /> },
            { path: "notes/:id", lazy: () => import("./pages/dashboard/notes") },
          ],
        },
      ],
    },
    { path: "/", element: <Home /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
