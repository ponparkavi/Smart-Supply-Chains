import { useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Shipments', icon: Package, path: '/shipments' },
  { name: 'Alerts & Risks', icon: AlertTriangle, path: '/alerts' },
  { name: 'Optimization', icon: TrendingUp, path: '/optimization' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl text-blue-600">PulseChain</h1>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ease-in-out group ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:translate-x-0.5'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-200 ${location.pathname === item.path ? '' : 'group-hover:scale-110'}`} />
            <span className="font-medium">{item.name}</span>
            {location.pathname === item.path && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
