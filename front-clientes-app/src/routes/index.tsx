import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Clientes from '../pages/Clientes';
import Selecionados from '../pages/Selecionados';
import { useClientes } from '../context/ClienteContext';
import type { JSX } from 'react';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { usuario } = useClientes();
  return usuario ? children : <Navigate to="/" />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/clientes" element={
        <ProtectedRoute>
          <Clientes />
        </ProtectedRoute>
      } />
      <Route path="/selecionados" element={
        <ProtectedRoute>
          <Selecionados />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
