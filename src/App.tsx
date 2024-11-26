import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { router } from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        failureCount < 3 &&
        error instanceof AxiosError &&
        (!error.response || error.response.status! >= 500),
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toaster />
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
