import { useState, useEffect, useMemo } from 'react';
import { MapPin, Clock, Zap, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useSearch } from '../components/SearchContext';
import { useRole } from '../context/RoleContext';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ShipmentDetailPanel, { type ShipmentDetail } from '../components/ShipmentDetailPanel';
import AiInsights from '../components/AiInsights';

type ShipmentStatus = 'On Time' | 'Delayed' | 'At Risk';
type RiskLevel = 'Low' | 'Medium' | 'High';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  riskLevel: RiskLevel;
  eta: string;
  currentLocation?: string;
  carrier?: string;
  weight?: string;
}

interface Alert {
  id: string;
  message: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
}

const mockShipments: Shipment[] = [
  { id: 'SH-001', origin: 'Shanghai', destination: 'Los Angeles', status: 'On Time', riskLevel: 'Low', eta: '2026-05-02 14:30', carrier: 'Maersk', weight: '24,000 kg', currentLocation: 'Pacific Ocean' },
  { id: 'SH-002', origin: 'Rotterdam', destination: 'New York', status: 'Delayed', riskLevel: 'High', eta: '2026-04-30 09:15', carrier: 'MSC', weight: '18,500 kg', currentLocation: 'English Channel' },
  { id: 'SH-003', origin: 'Singapore', destination: 'Dubai', status: 'At Risk', riskLevel: 'High', eta: '2026-05-01 18:00', carrier: 'CMA CGM', weight: '32,100 kg', currentLocation: 'Malacca Strait' },
  { id: 'SH-004', origin: 'Hamburg', destination: 'Miami', status: 'On Time', riskLevel: 'Low', eta: '2026-05-03 11:45', carrier: 'Hapag-Lloyd', weight: '21,800 kg', currentLocation: 'Atlantic Ocean' },
  { id: 'SH-005', origin: 'Tokyo', destination: 'Seattle', status: 'At Risk', riskLevel: 'Medium', eta: '2026-05-01 20:30', carrier: 'ONE', weight: '28,900 kg', currentLocation: 'North Pacific' },
  { id: 'SH-006', origin: 'Busan', destination: 'Long Beach', status: 'On Time', riskLevel: 'Low', eta: '2026-05-04 08:00', carrier: 'Evergreen', weight: '19,200 kg', currentLocation: 'Sea of Japan' },
];

const mockAlerts: Alert[] = [
  { id: '1', message: 'SH-002 delayed due to port congestion', time: '12 min ago', severity: 'high' },
  { id: '2', message: 'Weather alert: Storm approaching Dubai route', time: '28 min ago', severity: 'medium' },
  { id: '3', message: 'SH-005 at risk - traffic detected', time: '1 hr ago', severity: 'medium' },
  { id: '4', message: 'Customs clearance completed for SH-001', time: '2 hrs ago', severity: 'low' },
];

export default function Dashboard() {
  const { searchQuery } = useSearch();
  const { isAdmin } = useRole();

  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'All'>('All');
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetail | null>(null);
  const [hoveredShipment, setHoveredShipment] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredShipments = useMemo(() => {
    return mockShipments.filter(shipment => {
      const matchesSearch = !searchQuery.trim() ||
        shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const kpis = {
    activeShipments: mockShipments.length,
    delayed: mockShipments.filter(s => s.status === 'Delayed').length,
    atRisk: mockShipments.filter(s => s.status === 'At Risk').length,
    avgDelay: '4.2h'
  };

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case 'On Time': return 'bg-green-100 text-green-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      case 'At Risk': return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const handleKpiClick = (filter: ShipmentStatus | 'All') => {
    setStatusFilter(filter);
  };

  const handleShipmentClick = (shipment: Shipment) => {
    setSelectedShipment({
      ...shipment,
      carrier: shipment.carrier || 'Unknown',
      weight: shipment.weight || 'N/A',
    });
  };

  const positions = [
    { x: 15, y: 20 },
    { x: 45, y: 35 },
    { x: 75, y: 25 },
    { x: 25, y: 60 },
    { x: 60, y: 70 },
    { x: 80, y: 55 },
  ];

  return (
    <Layout>
      <div className="p-4 sm:p-8">
        {/* KPIs */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => handleKpiClick('All')}
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                statusFilter === 'All' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="text-sm text-gray-500 mb-1">Active Shipments</div>
              <div className="text-3xl font-semibold text-gray-900">{kpis.activeShipments}</div>
            </button>
            <button
              onClick={() => handleKpiClick('Delayed')}
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                statusFilter === 'Delayed' ? 'ring-2 ring-red-500' : ''
              }`}
            >
              <div className="text-sm text-gray-500 mb-1">Delayed</div>
              <div className="text-3xl font-semibold text-red-600">{kpis.delayed}</div>
            </button>
            <button
              onClick={() => handleKpiClick('At Risk')}
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                statusFilter === 'At Risk' ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              <div className="text-sm text-gray-500 mb-1">At Risk</div>
              <div className="text-3xl font-semibold text-yellow-600">{kpis.atRisk}</div>
            </button>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-500 mb-1">Avg Delay Time</div>
              <div className="text-3xl font-semibold text-gray-900">{kpis.avgDelay}</div>
            </div>
          </div>
        )}

        {statusFilter !== 'All' && (
          <div className="mb-4 flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
            <span className="text-sm text-gray-600">Filtered by:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(statusFilter)}`}>
              {statusFilter}
            </span>
            <button
              onClick={() => setStatusFilter('All')}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear filter
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-6">
          {/* Map */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Live Shipment Tracking</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | 'All')}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="All">All Routes</option>
                    <option value="On Time">On Time</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <LoadingState variant="map" />
                ) : (
                  <div className="h-[500px] bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl relative overflow-hidden border border-gray-200">
                    {filteredShipments.length === 0 ? (
                      <EmptyState variant="map" />
                    ) : (
                      <>
                        {filteredShipments.map((shipment, index) => {
                          const pos = positions[index % positions.length];

                          const lineColor =
                            shipment.status === 'On Time' ? '#10b981' :
                            shipment.status === 'At Risk' ? '#f59e0b' :
                            '#ef4444';

                          return (
                            <div key={shipment.id}>
                              <svg
                                className="absolute inset-0 w-full h-full pointer-events-none"
                                style={{ zIndex: hoveredShipment === shipment.id ? 20 : 10 }}
                              >
                                <defs>
                                  <marker
                                    id={`arrow-${shipment.id}`}
                                    markerWidth="10"
                                    markerHeight="10"
                                    refX="9"
                                    refY="3"
                                    orient="auto"
                                    markerUnits="strokeWidth"
                                  >
                                    <path
                                      d="M0,0 L0,6 L9,3 z"
                                      fill={lineColor}
                                    />
                                  </marker>
                                </defs>
                                <line
                                  x1={`${pos.x - 10}%`}
                                  y1={`${pos.y}%`}
                                  x2={`${pos.x + 20}%`}
                                  y2={`${pos.y + 15}%`}
                                  stroke={lineColor}
                                  strokeWidth={hoveredShipment === shipment.id ? "3" : "2"}
                                  strokeDasharray="5,5"
                                  markerEnd={`url(#arrow-${shipment.id})`}
                                  opacity={hoveredShipment === shipment.id ? "1" : "0.7"}
                                />
                              </svg>

                              <button
                                onMouseEnter={() => setHoveredShipment(shipment.id)}
                                onMouseLeave={() => setHoveredShipment(null)}
                                onClick={() => handleShipmentClick(shipment)}
                                className={`absolute transition-all duration-200 ${
                                  hoveredShipment === shipment.id ? 'scale-125 z-30' : 'z-20'
                                }`}
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                              >
                                <div className={`w-3 h-3 rounded-full ${
                                  shipment.status === 'On Time' ? 'bg-green-500' :
                                  shipment.status === 'At Risk' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                } shadow-lg ring-2 ring-white`}></div>
                              </button>

                              <div
                                className="absolute text-xs bg-white/90 px-2 py-1 rounded shadow-sm pointer-events-none backdrop-blur-sm"
                                style={{ left: `${pos.x - 10}%`, top: `${pos.y - 5}%` }}
                              >
                                {shipment.origin}
                              </div>
                              <div
                                className="absolute text-xs bg-white/90 px-2 py-1 rounded shadow-sm pointer-events-none backdrop-blur-sm"
                                style={{ left: `${pos.x + 20}%`, top: `${pos.y + 15}%` }}
                              >
                                {shipment.destination}
                              </div>
                            </div>
                          );
                        })}

                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-200">
                          <p className="text-xs mb-2 font-medium text-gray-700">Legend</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">On Time</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">At Risk</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">Delayed</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              </div>
              {isLoading ? (
                <LoadingState variant="list" rows={4} />
              ) : mockAlerts.length === 0 ? (
                <EmptyState variant="alerts" />
              ) : (
                <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {mockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} transition-all duration-200 hover:shadow-sm`}
                    >
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Shipment Table */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Shipment List</h2>
                <span className="text-sm text-gray-500">{filteredShipments.length} results</span>
              </div>
              {isLoading ? (
                <LoadingState variant="table" rows={5} />
              ) : filteredShipments.length === 0 ? (
                <EmptyState variant={searchQuery ? 'search' : 'shipments'} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">ID</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Origin</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Destination</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Status</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">ETA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredShipments.map((shipment) => (
                        <tr
                          key={shipment.id}
                          onClick={() => handleShipmentClick(shipment)}
                          className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {shipment.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{shipment.origin}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{shipment.destination}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                              {shipment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{shipment.eta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Route Optimization */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Route Optimization</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-1">Suggested alternate route</p>
                  <p className="text-sm text-blue-600">SH-003: Via Suez Canal</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span>Save 6.5 hours</span>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Optimize Route
                </button>
                {!isAdmin && (
                  <p className="text-xs text-gray-500 text-center">Admin access required for full optimization</p>
                )}
              </div>
            </div>

            {/* AI Insights */}
            <AiInsights shipments={filteredShipments} />

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">On Time Rate</span>
                  <span className="text-sm font-semibold text-green-600">
                    {Math.round((mockShipments.filter(s => s.status === 'On Time').length / mockShipments.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(mockShipments.filter(s => s.status === 'On Time').length / mockShipments.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">Avg Risk Level</span>
                  <span className="text-sm font-semibold text-yellow-600">Low-Medium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Detail Side Panel */}
      <ShipmentDetailPanel
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />
    </Layout>
  );
}
