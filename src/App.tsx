import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "react-day-picker/style.css";
import { AuthProvider } from "@/context/AuthContext";
import { Router } from "./Router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
export function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  });
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </AuthProvider>
      <Toaster richColors closeButton />
    </BrowserRouter>
  );
}
