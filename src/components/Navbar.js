import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBell, FiSettings, FiLogOut, FiHome } from 'react-icons/fi';

export default function Navbar({ unreadCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (path) =>
    `p-2 rounded-lg transition-colors ${
      location.pathname === path
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">NewsAlert</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/" className={navLink('/')}>
            <FiHome size={18} />
          </Link>

          <Link to="/alerts" className={`${navLink('/alerts')} relative`}>
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <Link to="/preferences" className={navLink('/preferences')}>
            <FiSettings size={18} />
          </Link>

          <div className="h-5 w-px bg-gray-200 mx-1" />

          <span className="text-sm text-gray-600 font-medium hidden sm:block">
            {user?.name}
          </span>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}