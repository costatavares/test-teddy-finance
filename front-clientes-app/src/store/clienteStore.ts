import { create } from 'zustand';

export type Cliente = {
  id: string;
  nome: string;
  salario: number;
  valorEmpresa: string;
  selecionado?: boolean;
};

type ClienteStore = {
  clientes: Cliente[];
  setClientes: (clientes: Cliente[]) => void;
  adicionar: (cliente: Cliente) => void;
  atualizar: (clienteAtualizado: Cliente) => void;
  remover: (id: string) => void;
  selecionar: (id: string) => void;
  // getSelecionados: () => Cliente[]; // <-- Novo método
};

export const useClienteStore = create<ClienteStore>((set, get) => ({
  clientes: [],

  setClientes: (clientes) => set(() => ({ clientes })),

  adicionar: (cliente) =>
    set((state) => ({
      clientes: [...state.clientes, cliente],
    })),

  atualizar: (clienteAtualizado) =>
    set((state) => ({
      clientes: state.clientes.map((c) =>
        c.id === clienteAtualizado.id ? clienteAtualizado : c
      ),
    })),

  remover: (id) =>
    set((state) => ({
      clientes: state.clientes.filter((c) => c.id !== id),
    })),

  selecionar: (id) =>
    // set((state) => ({
    //   clientes: state.clientes.map((c) =>
    //     c.id === id ? { ...c, selecionado: !c.selecionado } : c
    //   ),
    // })),
    set((state) => {
    const atualizados = state.clientes.map((c) =>
      c.id === id ? { ...c, selecionado: !c.selecionado } : c
    );

    console.log(`Cliente ${id} atualizado:`, atualizados.find(c => c.id === id));

    return { clientes: atualizados };
  })
}));
