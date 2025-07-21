/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useClienteStore } from '../store/clienteStore';
import { ClienteCard } from '../components/ClienteCard';
import { NumericFormat } from 'react-number-format'; 
import ClienteService from '../services/clienteService';
import { Header } from '../components/Header';

export default function Clientes() {
  const [showForm, setShowForm] = useState(false);
  const { clientes, adicionar } = useClienteStore();
  

  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [erro, setErro] = useState('');

  
  ClienteService();
  

  function handleAdicionar() {
    setShowForm(!showForm);
  }

  
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
      <Header />
      <div className="p-6">
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
                <NumericFormat
                  value={salario}
                  onValueChange={(e) => setSalario(e.value)} // ← valor limpo para POST
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="Salário R$"
                  className="w-full border rounded px-3 py-2"
                  required
                />

                <NumericFormat
                  value={empresa}
                  onValueChange={(values) => setEmpresa(values.value)} // ← valor numérico limpo
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="Empresa R$"
                  className="w-full border rounded px-3 py-2"
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
    </div>
  );
}
