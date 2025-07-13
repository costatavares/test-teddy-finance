import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClienteStore } from '../store/clienteStore';
import { ClienteCard } from '../components/ClienteCard';

export default function Clientes() {
  const navigate = useNavigate();
  const { clientes, setClientes } = useClienteStore();
  const [loading, setLoading] = useState(true);
  const carregado = useRef(false);

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
      } finally {
        setLoading(false);
      }
    }

    fetchClientes();
  }, [setClientes]);

  function handleAdicionar() {
    navigate('/criar-cliente');
  }

  if (loading) return <p>Carregando clientes...</p>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-4">
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <img src="/logo-branco.png" alt="Logo" className="h-10 object-contain" />
          <nav className="flex gap-4 text-sm text-gray-700 items-center">
            <a href="/clientes" className="text-orange-500 font-semibold">Clientes</a>
            <a href="/selecionados">Clientes selecionados</a>
            <a href="/logout">Sair</a>
          </nav>
        </div>
        <span className="text-sm text-gray-700">Olá, <strong>Usuário!</strong></span>
      </header>

      {/* Info + Filtro */}
      <div className="flex justify-between items-center mt-6 mb-4">
        <p className="text-base font-semibold">
          {clientes.length} clientes encontrados:
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="perPage">Clientes por página:</label>
          <select
            id="perPage"
            className="border border-gray-300 px-2 py-1 rounded"
            defaultValue="10"
          >
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="16">16</option>
            <option value="32">32</option>
          </select>
        </div>
      </div>

      {/* Grid de clientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {clientes.map((cliente) => (
          <ClienteCard key={cliente.id} cliente={cliente} />
        ))}
      </div>

      {/* Criar cliente */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleAdicionar}
          className="border border-orange-500 text-orange-500 px-6 py-2 rounded hover:bg-orange-100 transition"
        >
          Criar cliente
        </button>
      </div>

      {/* Paginação (estática por enquanto) */}
      <div className="mt-6 flex justify-center gap-2 text-sm text-gray-700">
        <button className="hover:underline">1</button>
        <span>...</span>
        <span className="font-bold text-orange-500">4</span>
        <button className="hover:underline">5</button>
        <span>...</span>
        <button className="hover:underline">12</button>
      </div>
    </div>
  );
}
