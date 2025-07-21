import { useEffect,useRef } from 'react';
import { useClienteStore } from "../store/clienteStore";

export interface ClienteInput {
  nome: string;
  salario: number;
  valorEmpresa: number;
}

export default function ClienteService() {
    const carregado = useRef(false);
    const { setClientes } = useClienteStore();
    
   
    useEffect(() => {
        if (carregado.current) return;
        carregado.current = true;
    
        async function fetchClientes() {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Token não encontrado.');
            return;
          }
    
          try {
            const response = await fetch('http://localhost:3000/cliente?page=1&perPage=10', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (!response.ok) {
              throw new Error(`Erro: ${response.status}`);
            }
    
            const data = await response.json();
            setClientes(data.data); // evita duplicação
          } catch (error) {
            console.error('Erro ao buscar clientes:', error);
          }
        }        
    
        fetchClientes();
    }, [setClientes]);
    
}

