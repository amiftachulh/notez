import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { router } from "./router";

export default function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ThemeProvider>
  );
}
