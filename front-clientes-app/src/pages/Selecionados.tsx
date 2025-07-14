import { useClienteStore } from '../store/clienteStore';
import { useClientes } from '../context/ClienteContext';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function Selecionados() {
  const navigate = useNavigate();
  const { logout, usuario } = useClientes();
  const clientes = useClienteStore((state) => state.clientes);
  console.log('clientes:', clientes);

  // const getSelecionados = useClienteStore(state => state.getSelecionados);
  // const selecionados = React.useMemo(() => getSelecionados(), [getSelecionados]);
  // console.log('getSelecionados:', selecionados);  

  const selecionados = React.useMemo(() => {
  return clientes.filter((c) => c.selecionado);
}, [clientes]);

   console.log('selecionados:', selecionados);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <img src="/logo-branco.png" alt="Logo" className="h-10 object-contain" />
          <nav className="flex gap-4 text-sm text-gray-700 items-center">
            <a href="/clientes">Clientes</a>
            <a href="/selecionados" className="text-orange-500 font-semibold">Clientes selecionados</a>
            <button onClick={handleLogout} className="text-red-500 hover:underline">Sair</button>
          </nav>
        </div>
        <span className="text-sm text-gray-700">
          Olá, <strong>{usuario}</strong>
        </span>
      </header>

      {/* Título */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selecionados.length} clientes selecionados
          </h2>
          <button
            onClick={() => navigate('/clientes')}
            className="text-orange-500 hover:underline"
          >
            Voltar
          </button>
        </div>

        {/* Lista de clientes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selecionados.length > 0 ? (
            selecionados.map((cliente) => (
              <div key={cliente.id} className="border p-4 rounded shadow bg-white">
                <h3 className="font-semibold">{cliente.nome}</h3>
                <p>Salário: R$ {cliente.salario.toFixed(2)}</p>
                <p>Empresa: {cliente.valorEmpresa}</p>
              </div>
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
