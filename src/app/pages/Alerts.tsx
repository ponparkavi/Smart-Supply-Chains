import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { Clock, AlertCircle, CheckCircle, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import api from '../../services/api';
import { usePreferences } from '../context/PreferencesContext';

interface AlertItem {
  id: string;
  shipment_id: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case 'high': return 'border-l-red-500 bg-red-50';
    case 'critical': return 'border-l-red-500 bg-red-50';
    case 'medium': return 'border-l-yellow-500 bg-yellow-50';
    case 'low': return 'border-l-blue-500 bg-blue-50';
    default: return 'border-l-gray-300 bg-gray-50';
  }
}

function getSeverityIcon(severity: string) {
  switch (severity.toLowerCase()) {
    case 'high':
    case 'critical':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case 'medium':
      return <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />;
    case 'low':
      return <CheckCircle className="w-5 h-5 text-blue-600" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-600" />;
  }
}

function relativeTime(timestamp: string) {
  const time = new Date(timestamp).getTime();
  const delta = Date.now() - time;
  const minutes = Math.floor(delta / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = usePreferences();

  useEffect(() => {
    let mounted = true;
    api.getAlerts()
      .then((data) => {
        if (!mounted) return;
        setAlerts(
          data.map((alert) => ({
            ...alert,
            severity: alert.severity.toLowerCase() as AlertItem['severity'],
          }))
        );
      })
      .catch(() => {
        // keep fallback empty if backend unavailable
      })
      .finally(() => mounted && setIsLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const activeAlerts = alerts.filter((alert) => alert.severity !== 'low');
  const resolvedAlerts = alerts.filter((alert) => alert.severity === 'low');

  const handleResolve = async (alertId: string) => {
    try {
      await api.deleteAlert(alertId);
      setAlerts((current) => current.filter((alert) => alert.id !== alertId));
    } catch {
      // ignore for now
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl mb-2">{t('alertsAndRisks')}</h1>
          <p className="text-sm text-gray-500">{t('monitorAlerts')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{t('activeAlerts')}</div>
            <div className="text-3xl text-red-600">{isLoading ? '...' : activeAlerts.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{t('highPriority')}</div>
            <div className="text-3xl">{isLoading ? '...' : activeAlerts.filter((alert) => alert.severity === 'high').length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{t('resolvedToday')}</div>
            <div className="text-3xl text-green-600">{isLoading ? '...' : resolvedAlerts.length}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg">{t('activeAlertsHeading')}</h2>
            </div>
            <div className="p-4 space-y-3">
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading alerts...</div>
              ) : activeAlerts.length === 0 ? (
                <div className="text-sm text-gray-500">No active alerts at the moment.</div>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} flex items-start gap-4`}
                  >
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2 gap-4">
                        <div>
                          <span className="inline-block px-2 py-1 bg-white rounded text-xs text-gray-600 mb-2">
                            Shipment {alert.shipment_id}
                          </span>
                          <p className="text-sm text-gray-800">{alert.message}</p>
                        </div>
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Resolve
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {relativeTime(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg">{t('resolvedAlertsHeading')}</h2>
            </div>
            <div className="p-4 space-y-3">
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading alerts...</div>
              ) : resolvedAlerts.length === 0 ? (
                <div className="text-sm text-gray-500">No resolved alerts yet.</div>
              ) : (
                resolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 bg-gray-50 rounded-lg flex items-start gap-4 opacity-80"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 bg-white rounded text-xs text-gray-600 mb-2">
                        Shipment {alert.shipment_id}
                      </span>
                      <p className="text-sm text-gray-800 line-through">{alert.message}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <Clock className="w-3 h-3" />
                        {relativeTime(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
