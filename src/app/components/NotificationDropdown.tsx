import { useState, useRef, useEffect } from 'react';
import { Bell, Clock, AlertCircle, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
}

const mockNotifications: Notification[] = [
  { id: '1', message: 'SH-002 delayed due to port congestion at Rotterdam', time: '12 min ago', severity: 'high', type: 'Delay' },
  { id: '2', message: 'Weather alert: Storm approaching Dubai route (SH-003)', time: '28 min ago', severity: 'medium', type: 'Weather' },
  { id: '3', message: 'SH-005 at risk - heavy traffic detected on Pacific route', time: '1 hr ago', severity: 'medium', type: 'Traffic' },
  { id: '4', message: 'Customs clearance completed for SH-001', time: '2 hrs ago', severity: 'low', type: 'Customs' },
  { id: '5', message: 'Port capacity warning: Los Angeles experiencing high volume', time: '3 hrs ago', severity: 'medium', type: 'Capacity' },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.severity === 'high' || n.severity === 'medium').length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500 shrink-0" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 hover:bg-red-100';
      case 'medium': return 'bg-yellow-50 hover:bg-yellow-100';
      case 'low': return 'bg-blue-50 hover:bg-blue-100';
      default: return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} new alerts` : 'All caught up'}
              </p>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={() => setNotifications([])}
                className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 flex items-start gap-3 transition-colors duration-200 ${getSeverityBg(notification.severity)}`}
                  >
                    {getSeverityIcon(notification.severity)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded">
                          {notification.type}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="p-1 hover:bg-white/80 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              View all alerts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

