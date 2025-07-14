/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Tipos
export interface Cliente {
  id: string;
  nome: string;
  salario: number;
  empresa: string;
  selecionado?: boolean;
}

interface ClienteContextType {
  clientes: Cliente[];
  setClientes: (clientes: Cliente[]) => void;

  selecionados: Cliente[];
  setSelecionados: (clientes: Cliente[]) => void;

  usuario: string;
  setUsuario: (nome: string) => void;
  logout: () => void;
}

// Criação do contexto
const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

// Hook de acesso
export const useClientes = (): ClienteContextType => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error("useClientes deve ser usado dentro de ClienteProvider");
  }
  return context;
};

// Provider
export const ClienteProvider = ({ children }: { children: ReactNode }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selecionados, setSelecionados] = useState<Cliente[]>([]);

  const [usuario, setUsuarioState] = useState<string>(() => {
    return localStorage.getItem("usuario") || "";
  });

  const setUsuario = (nome: string) => {
    localStorage.setItem("usuario", nome);
    setUsuarioState(nome);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    setUsuarioState("");
  };

  return (
    <ClienteContext.Provider
      value={{
        clientes,
        setClientes,
        selecionados,
        setSelecionados,
        usuario,
        setUsuario,
        logout,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
};
