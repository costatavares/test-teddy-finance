/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useClienteStore, type Cliente } from '../store/clienteStore';
import { useLocation } from 'react-router-dom';


type Props = {
  cliente: Cliente;
};

export function ClienteCard({ cliente }: Props) {
  const {atualizar, remover, selecionar } = useClienteStore();
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const location = useLocation();
  const isActive = () =>
    location.pathname === '/selecionados' ? 'md:hidden ':'';

  async function handleUpdateSubmit(e: React.FormEvent) {
    console.error('Editando cliente:', editando);
    e.preventDefault();
    if (!editando) return;

    const token = localStorage.getItem('token');
    if (!token) return alert('Token não encontrado');

    const editandoId = editando.id;
    if (!editandoId) return alert('ID do cliente não encontrado'); 
    
    try {
      const res = await fetch(`http://localhost:3000/cliente/${editandoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: editando.nome,
          salario: parseFloat(editando.salario),
          valorEmpresa: parseFloat(editando.valorEmpresa),
          ...(typeof editando.selecionado === 'boolean' && { selecionado: editando.selecionado }),  
        }),
      });

      if (!res.ok) throw new Error('Erro ao atualizar');

      const atualizado = await res.json();
      atualizar(atualizado);
      setEditando(null);
    } catch (err: any) {
      alert(err.message || 'Erro desconhecido');
    }
  }

  async function handleUpdate(cliente: Cliente) {
    selecionar(cliente.id);
    const clienteSelecionado = useClienteStore.getState().getClienteById(cliente.id);
    

    if (!cliente.id) return;

    const token = localStorage.getItem('token');
    if (!token) return alert('Token não encontrado');

    const editandoId = clienteSelecionado?.id;
    if (!editandoId) return alert('ID do cliente não encontrado'); 
    
    try {
      const res = await fetch(`http://localhost:3000/cliente/${editandoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selecionado: clienteSelecionado.selecionado ,  
        }),
      });       
      if (!res.ok) throw new Error('Erro ao atualizar');

      const atualizado = await res.json();
      atualizar(atualizado);
      setEditando(null);
    } catch (err: any) {
      alert(err.message || 'Erro desconhecido');
    }
  }

  async function handleDelete() {
    const token = localStorage.getItem('token');
    if (!token) return alert('Token não encontrado');

    try {
      const res = await fetch(`http://localhost:3000/cliente/${cliente.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Erro ao deletar');

      remover(cliente.id);
      setConfirmDelete(false);
    } catch (err: any) {
      alert(err.message || 'Erro desconhecido');
    }
  }

  return (
    <>
      <div className="border p-4 rounded shadow bg-white">
        <h3 className="font-bold">{cliente.nome}</h3>
        <p>
          Salário:{' '}
          <NumericFormat
            value={cliente.salario}
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
          />
        </p>
        <p>
          Empresa:{' '}
          <NumericFormat
            value={cliente.valorEmpresa}
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
          />
        </p>
        <div className="flex justify-between mt-2">
          <button onClick={() => handleUpdate(cliente)} title='selecionar' className="text-blue-500 hover:underline">
            {cliente.selecionado ? '✔️' : '❌'}
          </button>
          <button onClick={() => setEditando(cliente)} title='editar' className={isActive()} >✏️</button>
          <button
            onClick={() => setConfirmDelete(true)}
            className={`${isActive()} text-red-500`}
            title='excluir'
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Modal de edição */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setEditando(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Editar cliente
            </h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={editando.nome}
                onChange={(e) =>
                  setEditando({ ...editando, nome: e.target.value })
                }
                required
              />

              <NumericFormat
                value={editando.salario}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                className="w-full border px-3 py-2 rounded"
                placeholder="Salário R$"
                onValueChange={(values) =>
                  setEditando({
                    ...editando,
                    salario: values.value, // salva só número limpo: 3500.00
                  })
                }
                required
              />
              
              <NumericFormat
                value={editando.valorEmpresa}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                className="w-full border px-3 py-2 rounded"
                placeholder="Empresa R$"
                onValueChange={(values) =>
                  setEditando({
                    ...editando,
                    valorEmpresa: values.value,
                  })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="border px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmação de deleção */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center space-y-4">
            <p>Tem certeza que deseja excluir <strong>{cliente.nome}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="border px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
