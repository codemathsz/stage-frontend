import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import "react-day-picker/style.css";
import Login from './pages/Login';
import Home from './pages/Home';
import Project from './pages/Project';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/route/ProtectedRoute';

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
};

export default App;