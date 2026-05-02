import { useState, useEffect, useMemo } from 'react';
import { MapPin, Clock, Zap, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useSearch } from '../components/SearchContext';
import { useRole } from '../context/RoleContext';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ShipmentDetailPanel, { type ShipmentDetail } from '../components/ShipmentDetailPanel';
import AiInsights from '../components/AiInsights';
import { api, type Shipment, type Alert, type OptimizationResult } from '../../services/api';

type ShipmentStatus = 'On Time' | 'Delayed' | 'At Risk';
type RiskLevel = 'Low' | 'Medium' | 'High';

export default function Dashboard() {
  const { searchQuery } = useSearch();
  const { isAdmin } = useRole();

  const [isLoading, setIsLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'All'>('All');
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetail | null>(null);
  const [hoveredShipment, setHoveredShipment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch shipments and alerts in parallel
        const [shipmentsData, alertsData] = await Promise.all([
          api.getShipments(),
          api.getAlerts(),
        ]);
        
        setShipments(shipmentsData);
        
        // Transform alerts to match frontend format
        const transformedAlerts: Alert[] = alertsData.map(alert => ({
          id: alert.id,
          shipment_id: alert.shipment_id,
          message: alert.message,
          severity: alert.severity.toLowerCase() as 'low' | 'medium' | 'critical',
          timestamp: new Date(alert.timestamp).toLocaleString(),
        }));
        setAlerts(transformedAlerts);
        
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to connect to backend. Please ensure the server is running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      const matchesSearch = !searchQuery.trim() ||
        shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, shipments]);

  const kpis = {
    activeShipments: shipments.length,
    delayed: shipments.filter(s => s.status === 'Delayed').length,
    atRisk: shipments.filter(s => s.status === 'At Risk').length,
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
      case 'critical':
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const verifiedPlaces = ['Shanghai', 'Los Angeles', 'Rotterdam', 'New York', 'Singapore', 'Dubai', 'Miami', 'Tokyo', 'Seattle', 'Hamburg', 'Vancouver', 'Busan', 'London', 'Hong Kong'];
  const verifyPlace = (place: string) => verifiedPlaces.some((known) => place.toLowerCase().includes(known.toLowerCase()));
  const getVerificationBadge = (place: string) => {
    return verifyPlace(place) ? 'Verified' : 'Verification required';
  };

  const handleKpiClick = (filter: ShipmentStatus | 'All') => {
    setStatusFilter(filter);
  };

  const handleShipmentClick = (shipment: Shipment) => {
    setSelectedShipment({
      id: shipment.id,
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status,
      riskLevel: shipment.risk_level,
      eta: shipment.eta,
      currentLocation: shipment.current_location,
      carrier: 'Unknown',
      weight: 'N/A',
    });
  };

  const handleOptimize = async (shipmentId: string) => {
    try {
      const result = await api.optimizeRoute(shipmentId);
      setOptimization(result);
    } catch (err) {
      console.error('Failed to optimize route:', err);
    }
  };

  // Dynamic positions based on shipment count
  const getPosition = (index: number, total: number) => {
    const positions = [
      { x: 15, y: 20 },
      { x: 45, y: 35 },
      { x: 75, y: 25 },
      { x: 25, y: 60 },
      { x: 60, y: 70 },
      { x: 80, y: 55 },
    ];
    return positions[index % positions.length];
  };

  return (
    <Layout>
      <div className="p-4 sm:p-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

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
                          const pos = getPosition(index, filteredShipments.length);

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
                                <div>{shipment.origin}</div>
                                <div className="text-[10px] text-gray-500">{getVerificationBadge(shipment.origin)}</div>
                              </div>
                              <div
                                className="absolute text-xs bg-white/90 px-2 py-1 rounded shadow-sm pointer-events-none backdrop-blur-sm"
                                style={{ left: `${pos.x + 20}%`, top: `${pos.y + 15}%` }}
                              >
                                <div>{shipment.destination}</div>
                                <div className="text-[10px] text-gray-500">{getVerificationBadge(shipment.destination)}</div>
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
              ) : alerts.length === 0 ? (
                <EmptyState variant="alerts" />
              ) : (
                <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} transition-all duration-200 hover:shadow-sm`}
                    >
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
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
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {shipment.origin}
                            <div className="text-[10px] text-gray-500 mt-1">{getVerificationBadge(shipment.origin)}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {shipment.destination}
                            <div className="text-[10px] text-gray-500 mt-1">{getVerificationBadge(shipment.destination)}</div>
                          </td>
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
              {optimization ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 mb-1">Suggested route</p>
                    <p className="text-sm text-blue-600 font-medium">{optimization.suggested_route}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>Save {optimization.time_saved} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-600">↓</span>
                    <span>{optimization.risk_reduction}% risk reduction</span>
                  </div>
                  <button 
                    onClick={() => setOptimization(null)}
                    className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Select a shipment to optimize its route</p>
                  <button 
                    onClick={() => shipments.length > 0 && handleOptimize(shipments[0].id)}
                    disabled={shipments.length === 0}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Optimize Route
                  </button>
                  {!isAdmin && (
                    <p className="text-xs text-gray-500 text-center">Admin access required for full optimization</p>
                  )}
                </div>
              )}
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
                    {shipments.length > 0 ? Math.round((shipments.filter(s => s.status === 'On Time').length / shipments.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${shipments.length > 0 ? (shipments.filter(s => s.status === 'On Time').length / shipments.length) * 100 : 0}%` }}
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
