// // store/clienteStore.ts
// import { create } from 'zustand';

// export interface Cliente {
//   id: string;
//   nome: string;
//   salario: number;
//   empresa: string;
//   selecionado?: boolean;
// }

// interface ClienteStore {
//   clientes: Cliente[];
//   setClientes: (clientes: Cliente[]) => void;
//   adicionar: (cliente: Cliente) => void;
//   limpar: () => void;
// }

// export const useClienteStore = create<ClienteStore>((set, get) => ({
//   clientes: [],

//   setClientes: (novosClientes) => set({ clientes: novosClientes }),

//   adicionar: (novo) => {
//     const existentes = get().clientes;
//     const jaExiste = existentes.some(c => c.id === novo.id);
//     if (!jaExiste) {
//       set({ clientes: [...existentes, novo] });
//     }
//   },

//   limpar: () => set({ clientes: [] }),
// }));

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
};

export const useClienteStore = create<ClienteStore>((set) => ({
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
    set((state) => ({
      clientes: state.clientes.map((c) =>
        c.id === id ? { ...c, selecionado: !c.selecionado } : c
      ),
    })),
}));
