import { useClienteStore} from '../store/clienteStore';
import { ClienteCard } from '../components/ClienteCard';
import { useEffect, useRef } from 'react';
import { Header } from '../components/Header';

export default function Selecionados() {
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
  
  const getSelecionados = useClienteStore((state) => state.getSelecionados);
  const selecionados = getSelecionados();  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Título */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selecionados.length > 1 ? 'clientes selecionados' : 'cliente selecionado'}
          </h2>          
        </div>

        {/* Lista de clientes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selecionados.length > 0 ? (
            selecionados.map((cliente) => (
              <ClienteCard key={cliente.id} cliente={cliente} />
            ))
          ) : (
            <p className="col-span-full text-gray-600 text-center">
              Nenhum cliente selecionado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
