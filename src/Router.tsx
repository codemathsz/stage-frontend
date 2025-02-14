import {  Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./route/ProtectedRoute";
import Home from "./pages/Home";
import Project from "./pages/Project";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
export function Router() {


    const RootRedirect: React.FC = () => {
        const { isAuthenticated } = useAuth();
        const navigate = useNavigate();
      
        useEffect(() => {
          navigate(isAuthenticated ? "/home" : "/login", { replace: true });
        }, [isAuthenticated, navigate]);
      
        return null; 
      };
      
  return (
    <Routes>
      {/* Redirecionamento da raiz baseado em autenticação */}
      <Route path="/" element={<RootRedirect />} />

      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/project/:id?" element={<Project />} />
      </Route>

      <Route path="*" element={<div>404 - Página não encontrada</div>} />
    </Routes>
  );
}
