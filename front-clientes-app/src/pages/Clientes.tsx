/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useClienteStore } from '../store/clienteStore';
import { ClienteCard } from '../components/ClienteCard';
import { useClientes } from '../context/ClienteContext';
import { useNavigate } from 'react-router-dom';

export default function Clientes() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const { clientes, setClientes, adicionar } = useClienteStore();
  const [loading, setLoading] = useState(true);
  const carregado = useRef(false);

  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [erro, setErro] = useState('');

  const { logout, usuario } = useClientes();

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
    setShowForm(!showForm);
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Token não encontrado');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          salario: parseFloat(salario),
          valorEmpresa: parseFloat(empresa),
        }),
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro || 'Erro ao criar cliente');
      }

      const novoCliente = await response.json();
      adicionar(novoCliente); // adiciona no Zustand
      setShowForm(false);     // fecha formulário
      setNome('');
      setSalario('');
      setEmpresa('');
    } catch (err: any) {
      setErro(err.message || 'Erro desconhecido');
    }
  }

  // if (loading) return <p>Carregando clientes...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between px-4 py-3">
       
        <div className="flex items-center gap-6">
          <img src="/logo-branco.png" alt="Logo" className="h-10 object-contain" />
          <nav className="flex gap-4 text-sm text-gray-700 items-center">
            <a href="/clientes" className="text-orange-500 font-semibold">Clientes</a>
            <a href="/selecionados">Clientes selecionados</a>
            <button onClick={handleLogout} className="text-red-500 hover:underline">Sair</button>
          </nav>
        </div>
        <span className="text-sm text-gray-700">Olá, <strong>{usuario}</strong></span>
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

      {/* Formulário embutido */}
      {showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            
            {/* Botão de fechar (X) */}
            <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                aria-label="Fechar modal"
            >
                &times;
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center">Novo cliente</h2>

            {erro && (
                <p className="text-red-500 text-sm mb-2 text-center">{erro}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                placeholder="Nome"
                className="w-full border rounded px-3 py-2"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                />
                <input
                type="number"
                placeholder="Salário"
                className="w-full border rounded px-3 py-2"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                required
                />
                <input
                type="number"
                placeholder="Empresa"
                className="w-full border rounded px-3 py-2"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                required
                />
                <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                    Criar
                </button>
                </div>
            </form>
            </div>
      </div>
       )}




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
