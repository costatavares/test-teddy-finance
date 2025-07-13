import { useClienteStore } from '../store/clienteStore';
import { ClienteCard } from '../components/ClienteCard';

export default function Selecionados() {
  const { selecionados } = useClienteStore();

  return (
    <div className="p-4">
      <h2>Clientes Selecionados ({selecionados.length})</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {selecionados.map(cliente => <ClienteCard key={cliente.id} cliente={cliente} />)}
      </div>
    </div>
  );
}
