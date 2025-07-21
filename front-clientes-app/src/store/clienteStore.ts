import { create } from 'zustand';

export type Cliente = {
  id: string;
  nome: string;
  salario: string;
  valorEmpresa: string;
  selecionado?: boolean;
};

type ClienteStore = {
  clientes: Cliente[];
  selecionados:Cliente[];
  setClientes: (clientes: Cliente[]) => void;
  adicionar: (cliente: Cliente) => void;
  atualizar: (clienteAtualizado: Cliente) => void;
  remover: (id: string) => void;
  selecionar: (id: string) => void;
  selecionarUnico: (id: string) => void;
  getClienteById: (id: string) => Cliente | undefined;
  getClienteSelecionado: () => Cliente | null;
  getSelecionados: () => Cliente[]; // <-- Novo método
  toggleSelecionado: (id: string) => void;
  formatarParaReais: (valor: string) => string
    // Remove tudo que não é número
  
};

export const useClienteStore = create<ClienteStore>((set,get) => ({
  clientes: [],
  selecionados:[],
  
  setClientes: (clientes) =>
  set(() => ({
    clientes: clientes.map((c) => ({
      ...c,
      selecionado: c.selecionado ?? false,
    })),
  })),
  adicionar: (cliente) =>
  set((state) => ({
    clientes: [...state.clientes, { ...cliente, selecionado: false }],
  })),

  atualizar: (clienteAtualizado) =>
    set((state) => ({
      clientes: state.clientes.map((c) =>
        c.id === clienteAtualizado.id ? clienteAtualizado : c
      ),
    })),
  getSelecionados: () => get().clientes.filter((c) => c.selecionado === true),  
  getClienteById: (id) => get().clientes.find((c) => c.id === id),  

  getClienteSelecionado: () =>
    get().clientes.find((c) => c.selecionado) || null,  

  remover: (id) =>
    set((state) => ({
      clientes: state.clientes.filter((c) => c.id !== id),
    })),

  selecionar: (id) =>
    set((state) => {
    const atualizados = state.clientes.map((c) =>
      c.id === id ? { ...c, selecionado: !c.selecionado } : c
    );

    return { clientes: atualizados };
  }),
  selecionarUnico: (id) =>
    set((state) => ({
      clientes: state.clientes.map((c) => ({
        ...c,
        selecionado: c.id === id,
      })),
    })),
  toggleSelecionado: (id: string) => {
    set((state) => {
      const jaSelecionado = state.selecionados.some(c => c.id === id);
      const cliente = state.clientes.find(c => c.id === id);
      if (!cliente) return state;

      return {
        selecionados: jaSelecionado
          ? state.selecionados.filter(c => c.id !== id)
          : [...state.selecionados, cliente],
      };
    });
  },
  
  formatarParaReais: (valor) => {
    
    const float = parseFloat(valor.replace(/[^0-9.-]+/g, ''));
    return isNaN(float) 
      ? ''
      : float.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',      
      })
  }
}));
