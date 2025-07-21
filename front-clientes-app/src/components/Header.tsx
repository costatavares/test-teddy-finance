import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClientes } from '../context/ClienteContext';

interface HeaderProps {
  usuario: string;
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout, usuario } = useClientes();

  const isActive = (path: string) =>
    location.pathname === path ? 'text-orange-500 font-semibold' : 'text-gray-700';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-6">
        <img src="/logo-branco.png" alt="Logo" className="h-10 object-contain" />
        <nav className="flex gap-4 text-sm items-center">
          <Link to="/clientes" onClick={() => navigate('/clientes')} className={isActive('/clientes')}>
            Clientes
          </Link>
          <Link to="/selecionados" onClick={() => navigate('/selecionados')} className={isActive('/selecionados')}>
            Clientes selecionados
          </Link>
          <Link to="/" onClick={handleLogout} className="text-gray-700">
            Sair
          </Link>
        </nav>
      </div>
      <span className="text-sm text-gray-700">
        Olá, <strong>{usuario}</strong>
      </span>
    </header>
  );
}
