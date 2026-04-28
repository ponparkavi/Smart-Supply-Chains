import Layout from '../components/layout/Layout';
import { Clock, AlertCircle, CheckCircle, AlertTriangle as AlertTriangleIcon } from 'lucide-react';

interface Alert {
  id: string;
  message: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
  resolved: boolean;
}

const mockAlerts: Alert[] = [
  { id: '1', message: 'SH-002 delayed due to port congestion at Rotterdam', time: '12 min ago', severity: 'high', type: 'Delay', resolved: false },
  { id: '2', message: 'Weather alert: Storm approaching Dubai route (SH-003)', time: '28 min ago', severity: 'medium', type: 'Weather', resolved: false },
  { id: '3', message: 'SH-005 at risk - heavy traffic detected on Pacific route', time: '1 hr ago', severity: 'medium', type: 'Traffic', resolved: false },
  { id: '4', message: 'Customs clearance completed for SH-001', time: '2 hrs ago', severity: 'low', type: 'Customs', resolved: true },
  { id: '5', message: 'Port capacity warning: Los Angeles experiencing high volume', time: '3 hrs ago', severity: 'medium', type: 'Capacity', resolved: false },
  { id: '6', message: 'SH-008 delayed - mechanical issue reported', time: '4 hrs ago', severity: 'high', type: 'Mechanical', resolved: false },
  { id: '7', message: 'Fuel surcharge update applied to active shipments', time: '5 hrs ago', severity: 'low', type: 'System', resolved: true },
  { id: '8', message: 'Route optimization available for SH-003', time: '6 hrs ago', severity: 'low', type: 'Optimization', resolved: true },
];

export default function Alerts() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium': return <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const activeAlerts = mockAlerts.filter(a => !a.resolved);
  const resolvedAlerts = mockAlerts.filter(a => a.resolved);

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl mb-2">Alerts & Risks</h1>
          <p className="text-sm text-gray-500">Monitor and manage supply chain alerts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Active Alerts</div>
            <div className="text-3xl text-red-600">{activeAlerts.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">High Priority</div>
            <div className="text-3xl">{mockAlerts.filter(a => a.severity === 'high' && !a.resolved).length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Resolved Today</div>
            <div className="text-3xl text-green-600">{resolvedAlerts.length}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg">Active Alerts</h2>
            </div>
            <div className="p-4 space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} flex items-start gap-4`}
                >
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="inline-block px-2 py-1 bg-white rounded text-xs text-gray-600 mb-2">
                          {alert.type}
                        </span>
                        <p className="text-sm text-gray-800">{alert.message}</p>
                      </div>
                      <button className="text-xs text-blue-600 hover:underline">Resolve</button>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg">Resolved Alerts</h2>
            </div>
            <div className="p-4 space-y-3">
              {resolvedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 bg-gray-50 rounded-lg flex items-start gap-4 opacity-60"
                >
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-white rounded text-xs text-gray-600 mb-2">
                      {alert.type}
                    </span>
                    <p className="text-sm text-gray-800 line-through">{alert.message}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
