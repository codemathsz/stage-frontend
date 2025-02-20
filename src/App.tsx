import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "react-day-picker/style.css";
import { AuthProvider } from "@/context/AuthContext";
import { Router } from "./Router";
import { ProjectProvider } from "./context/ProjectContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  });
  return (
    <AuthProvider>
      <ProjectProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </QueryClientProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}
