import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./route/ProtectedRoute";
import { Home } from "./pages/Home";
import { Project } from "./pages/Project";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { ListProjects } from "./pages/ListProjects";
import { DefaultLayout } from "./components/DefaultLayout";
import { Meet } from "./pages/Meet";

export const routes = [
  { path: "/projects", element: <ListProjects />, title: "Projetos" },
  { path: "/project/:id", element: <Project />, title: "Editar Projeto" },
  { path: "/project", element: <Project />, title: "Criar Projeto" },
  { path: "/home", element: <Home />, title: "Inicio" },
  { path: "/meeting/:id", element: <Meet />, title: "Reunião das etapas" },
];
export function Router() {
  function RootRedirect() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      navigate(isAuthenticated ? "/projects" : "/login", { replace: true });
    }, [isAuthenticated, navigate]);

    return null;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<RootRedirect />} />

        <Route element={<ProtectedRoute />}>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
      <Route path="*" element={<div>404 - Página não encontrada</div>} />
    </Routes>
  );
}
