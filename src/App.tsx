import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "react-day-picker/style.css";
import { AuthProvider } from "@/context/AuthContext";
import { Router } from "./Router";
import { ProjectProvider } from "./context/ProjectContext";

export function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}
