import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/spinner";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
