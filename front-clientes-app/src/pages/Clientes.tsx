/* eslint-disable @typescript-eslint/no-explicit-any */
import {useCallback,useEffect, useState } from 'react';
import { useClienteStore } from '../store/clienteStore';
import { ClienteCard } from '../components/ClienteCard';
import { NumericFormat } from 'react-number-format';
import { Header } from '../components/Header';

export default function Clientes() {
  const { clientes, setClientes, adicionar } = useClienteStore();
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [erro, setErro] = useState('');

  // paginação
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const carregarClientes = useCallback(async (pagina = 1, porPagina = 10) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`http://localhost:3000/cliente?page=${pagina}&perPage=${porPagina}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setClientes(data.data);
    setTotal(data.total);
    setPage(data.page);
  }, [setClientes]);

  useEffect(() => {
    carregarClientes(page, perPage);
  }, [page, perPage, carregarClientes]);

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
      adicionar(novoCliente);
      setShowForm(false);
      setNome('');
      setSalario('');
      setEmpresa('');
    } catch (err:any) {
      setErro(err.message || 'Erro desconhecido');
    }
  }

  const totalPaginas = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <div className="flex justify-between items-center mt-6 mb-4">
          <p className="text-base font-semibold">
            clientes encontrados:
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="perPage">Clientes por página:</label>
            <select
              id="perPage"
              className="border border-gray-300 px-2 py-1 rounded"
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1); // resetar para a página 1
              }}
            >
              {[8, 10, 16, 32].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clientes.map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowForm(true)}
            className="border border-orange-500 text-orange-500 px-6 py-2 rounded hover:bg-orange-100 transition"
          >
            Criar cliente
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
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
                  onValueChange={(e) => setSalario(e.value)}
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
                  onValueChange={(e) => setEmpresa(e.value)}
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

        {/* Paginação dinâmica */}
        <div className="mt-6 flex justify-center gap-2 text-sm text-gray-700 flex-wrap">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-2 py-1 rounded ${page === i + 1 ? 'text-orange-500 font-bold' : 'hover:underline'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
