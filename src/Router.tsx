import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./route/ProtectedRoute";
import Home from "./pages/Home";
import Project from "./pages/Project";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { ListProjects } from "./pages/ListProjects/ListProjects";
import { DefaultLayout } from "./components/DefaultLayout";
export function Router() {
  function RootRedirect() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      navigate(isAuthenticated ? "/projects" : "/", { replace: true });
    }, [isAuthenticated, navigate]);

    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<ListProjects />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/project/:id?" element={<Project />} />
        </Route>
      </Route>

      <Route path="*" element={<div>404 - Página não encontrada</div>} />
    </Routes>
  );
}
