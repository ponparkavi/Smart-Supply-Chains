import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { MapPin, Clock, TrendingDown, CheckCircle } from 'lucide-react';

interface RouteOptimization {
  id: string;
  shipmentId: string;
  currentRoute: string;
  suggestedRoute: string;
  currentEta: string;
  optimizedEta: string;
  timeSaved: string;
  confidenceScore: number;
  delayRiskReduction: string;
}

const mockOptimizations: RouteOptimization[] = [
  {
    id: '1',
    shipmentId: 'SH-003',
    currentRoute: 'Singapore → Malacca Strait → Dubai',
    suggestedRoute: 'Singapore → Suez Canal → Dubai',
    currentEta: '2026-05-01 18:00',
    optimizedEta: '2026-05-01 11:30',
    timeSaved: '6.5 hours',
    confidenceScore: 94,
    delayRiskReduction: '45%'
  },
  {
    id: '2',
    shipmentId: 'SH-005',
    currentRoute: 'Tokyo → North Pacific → Seattle',
    suggestedRoute: 'Tokyo → Great Circle Route → Seattle',
    currentEta: '2026-05-01 20:30',
    optimizedEta: '2026-05-01 16:00',
    timeSaved: '4.5 hours',
    confidenceScore: 88,
    delayRiskReduction: '32%'
  },
  {
    id: '3',
    shipmentId: 'SH-002',
    currentRoute: 'Rotterdam → English Channel → New York',
    suggestedRoute: 'Rotterdam → North Atlantic → New York',
    currentEta: '2026-04-30 09:15',
    optimizedEta: '2026-04-30 06:00',
    timeSaved: '3.25 hours',
    confidenceScore: 91,
    delayRiskReduction: '28%'
  },
  {
    id: '4',
    shipmentId: 'SH-007',
    currentRoute: 'Hong Kong → Taiwan Strait → Vancouver',
    suggestedRoute: 'Hong Kong → Direct Pacific → Vancouver',
    currentEta: '2026-05-05 16:20',
    optimizedEta: '2026-05-05 14:00',
    timeSaved: '2.33 hours',
    confidenceScore: 86,
    delayRiskReduction: '18%'
  },
];

export default function Optimization() {
  const [selectedOptimization, setSelectedOptimization] = useState<RouteOptimization | null>(mockOptimizations[0]);
  const [sortBy, setSortBy] = useState<'timeSaved' | 'confidence'>('timeSaved');

  const sortedOptimizations = [...mockOptimizations].sort((a, b) => {
    if (sortBy === 'timeSaved') {
      return parseFloat(b.timeSaved) - parseFloat(a.timeSaved);
    } else {
      return b.confidenceScore - a.confidenceScore;
    }
  });

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
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg">Route Comparison</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'timeSaved' | 'confidence')}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="timeSaved">Sort by Time Saved</option>
                  <option value="confidence">Sort by Confidence</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Shipment ID</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Current Route</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Suggested Route</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Current ETA</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Optimized ETA</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Time Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedOptimizations.map((opt) => (
                      <tr
                        key={opt.id}
                        onClick={() => setSelectedOptimization(opt)}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedOptimization?.id === opt.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 text-sm">{opt.shipmentId}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{opt.currentRoute}</td>
                        <td className="px-6 py-4 text-sm text-blue-600">{opt.suggestedRoute}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{opt.currentEta}</td>
                        <td className="px-6 py-4 text-sm text-green-600">{opt.optimizedEta}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {opt.timeSaved}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            {selectedOptimization ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg mb-4">Optimization Details</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Shipment</p>
                    <p className="text-lg">{selectedOptimization.shipmentId}</p>
                  </div>

                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100"></div>
                    <div className="relative z-10 text-center">
                      <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Route preview</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Time Saved</span>
                      <span className="text-lg text-green-600">{selectedOptimization.timeSaved}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Delay Risk Reduction</span>
                      <span className="text-lg text-blue-600">{selectedOptimization.delayRiskReduction}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence Score</span>
                      <span className="text-lg">{selectedOptimization.confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Recommended optimization</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Route Details</p>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Current</p>
                      <p className="text-sm">{selectedOptimization.currentRoute}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {selectedOptimization.currentEta}
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 mb-1">Suggested</p>
                      <p className="text-sm text-blue-900">{selectedOptimization.suggestedRoute}</p>
                      <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                        <Clock className="w-3 h-3" />
                        {selectedOptimization.optimizedEta}
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Optimization
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-500 text-center">Select a route to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
