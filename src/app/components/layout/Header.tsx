import { Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSearch } from '../SearchContext';
import { useRole } from '../../context/RoleContext';
import NotificationDropdown from '../NotificationDropdown';
import RefreshButton from '../RefreshButton';

export default function Header() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  const { role, logout } = useRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search shipments, routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>
          <RefreshButton />
          <NotificationDropdown />
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700 hidden sm:inline capitalize">{role}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
