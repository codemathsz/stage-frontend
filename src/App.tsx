import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "react-day-picker/style.css";
import { AuthProvider } from "@/context/AuthContext";
import { Router } from "./Router";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}
