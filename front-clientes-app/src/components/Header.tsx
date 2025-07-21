import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClientes } from '../context/ClienteContext';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, usuario } = useClientes();

  const [menuAberto, setMenuAberto] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path ? 'text-orange-500 font-semibold' : 'text-gray-700';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo + botão hambúrguer */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-4">
            <img src="/logo-branco.png" alt="Logo" className="h-10 object-contain" />
            <span className="md:hidden text-sm font-semibold text-gray-700">
              Olá, <strong>{usuario}</strong>
            </span>
          </div>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Navegação desktop */}
        <nav className="hidden md:flex gap-4 text-sm items-center ml-6">
          <Link to="/clientes" className={isActive('/clientes')}>
            Clientes
          </Link>
          <Link to="/selecionados" className={isActive('/selecionados')}>
            Clientes selecionados
          </Link>
          <Link to="/" onClick={handleLogout} className="text-gray-700">
            Sair
          </Link>
        </nav>

        {/* Saudação desktop */}
        <span className="hidden md:block text-sm text-gray-700">
          Olá, <strong>{usuario}</strong>
        </span>
      </div>

      {/* Navegação mobile */}
      {menuAberto && (
        <nav className="flex flex-col gap-2 mt-3 md:hidden text-sm text-gray-700">
          <Link to="/clientes" className={isActive('/clientes')} onClick={() => setMenuAberto(false)}>
            Clientes
          </Link>
          <Link to="/selecionados" className={isActive('/selecionados')} onClick={() => setMenuAberto(false)}>
            Clientes selecionados
          </Link>
          <Link to="/" onClick={() => { setMenuAberto(false); handleLogout(); }}>
            Sair
          </Link>
        </nav>
      )}
    </header>
  );
}
