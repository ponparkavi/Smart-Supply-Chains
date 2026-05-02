import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { MapPin, Clock, CheckCircle } from 'lucide-react';
import api, { type Shipment, type OptimizationResult } from '../../services/api';

interface ShipmentOption {
  id: string;
  origin: string;
  destination: string;
  eta: string;
  current_location: string;
}

export default function Optimization() {
  const [shipments, setShipments] = useState<ShipmentOption[]>([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('');
  const [selectedOptimization, setSelectedOptimization] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api.getShipments()
      .then((data) => {
        if (!mounted) return;
        setShipments(data.map((shipment) => ({
          id: shipment.id,
          origin: shipment.origin,
          destination: shipment.destination,
          eta: shipment.eta,
          current_location: shipment.current_location,
        })));
        if (data.length > 0) {
          setSelectedShipmentId(data[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load shipments:', err);
        setError('Unable to load shipments for optimization. Using fallback recommendations.');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const handleOptimize = async (shipmentId: string) => {
    setSelectedShipmentId(shipmentId);
    setError(null);
    setOptimizing(true);
    try {
      const result = await api.optimizeRoute(shipmentId);
      setSelectedOptimization(result);
    } catch (err) {
      console.error('Route optimization failed:', err);
      setError('Route optimization is unavailable right now.');
    } finally {
      setOptimizing(false);
    }
  };

  const selectedShipment = shipments.find((shipment) => shipment.id === selectedShipmentId);
  const currentRoute = selectedShipment ? `${selectedShipment.origin} → ${selectedShipment.destination}` : 'Route preview not available';

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl mb-2">Route Optimization</h1>
          <p className="text-sm text-gray-500">Compare and apply optimized routes to reduce delays</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg">Available Shipments</h2>
                <select
                  value={selectedShipmentId}
                  onChange={(e) => handleOptimize(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {shipments.map((shipment) => (
                    <option key={shipment.id} value={shipment.id}>
                      {shipment.id} — {shipment.origin} to {shipment.destination}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Shipment ID</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Route</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">ETA</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {shipments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-sm text-gray-500">
                          {loading ? 'Loading shipments...' : 'No shipments available.'}
                        </td>
                      </tr>
                    ) : (
                      shipments.map((shipment) => (
                        <tr
                          key={shipment.id}
                          className={`cursor-pointer hover:bg-gray-50 ${selectedShipmentId === shipment.id ? 'bg-blue-50' : ''}`}
                          onClick={() => handleOptimize(shipment.id)}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{shipment.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{shipment.origin} → {shipment.destination}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{shipment.eta}</td>
                          <td className="px-6 py-4 text-sm text-blue-600">Optimize</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Optimization Details</h3>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-sm text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current route</p>
                  <p className="text-lg text-gray-900">{currentRoute}</p>
                </div>

                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100" />
                  <div className="relative z-10 text-center">
                    <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Route preview</p>
                  </div>
                </div>

                {selectedOptimization ? (
                  <>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Suggested route</span>
                        <span className="text-sm text-blue-600 font-medium">Optimized</span>
                      </div>
                      <p className="text-sm text-blue-900">{selectedOptimization.suggested_route}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Time Saved</span>
                        <span className="text-lg text-green-600">{selectedOptimization.time_saved} min</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Risk Reduction</span>
                        <span className="text-lg text-blue-600">{selectedOptimization.risk_reduction}%</span>
                      </div>
                      <div className="text-sm text-gray-600">Alternative routes: {selectedOptimization.alternative_routes.join(', ')}</div>
                    </div>

                    <button
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={optimizing}
                    >
                      {optimizing ? 'Optimizing...' : 'Apply Optimization'}
                    </button>
                  </>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                    Select a shipment to view optimization details.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
