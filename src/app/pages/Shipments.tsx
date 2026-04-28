import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { Filter, Plus, X, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useSearch } from '../components/SearchContext';
import { useRole } from '../context/RoleContext';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ShipmentDetailPanel, { type ShipmentDetail } from '../components/ShipmentDetailPanel';
import AiInsights from '../components/AiInsights';

type ShipmentStatus = 'On Time' | 'Delayed' | 'At Risk';
type RiskLevel = 'Low' | 'Medium' | 'High';
type SortField = 'eta' | 'risk' | 'status';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  riskLevel: RiskLevel;
  eta: string;
  carrier: string;
  weight: string;
  currentLocation?: string;
}

const mockShipments: Shipment[] = [
  { id: 'SH-001', origin: 'Shanghai', destination: 'Los Angeles', status: 'On Time', riskLevel: 'Low', eta: '2026-05-02 14:30', carrier: 'Maersk', weight: '24,000 kg', currentLocation: 'Pacific Ocean' },
  { id: 'SH-002', origin: 'Rotterdam', destination: 'New York', status: 'Delayed', riskLevel: 'High', eta: '2026-04-30 09:15', carrier: 'MSC', weight: '18,500 kg', currentLocation: 'English Channel' },
  { id: 'SH-003', origin: 'Singapore', destination: 'Dubai', status: 'At Risk', riskLevel: 'High', eta: '2026-05-01 18:00', carrier: 'CMA CGM', weight: '32,100 kg', currentLocation: 'Malacca Strait' },
  { id: 'SH-004', origin: 'Hamburg', destination: 'Miami', status: 'On Time', riskLevel: 'Low', eta: '2026-05-03 11:45', carrier: 'Hapag-Lloyd', weight: '21,800 kg', currentLocation: 'Atlantic Ocean' },
  { id: 'SH-005', origin: 'Tokyo', destination: 'Seattle', status: 'At Risk', riskLevel: 'Medium', eta: '2026-05-01 20:30', carrier: 'ONE', weight: '28,900 kg', currentLocation: 'North Pacific' },
  { id: 'SH-006', origin: 'Busan', destination: 'Long Beach', status: 'On Time', riskLevel: 'Low', eta: '2026-05-04 08:00', carrier: 'Evergreen', weight: '19,200 kg', currentLocation: 'Sea of Japan' },
  { id: 'SH-007', origin: 'Hong Kong', destination: 'Vancouver', status: 'On Time', riskLevel: 'Low', eta: '2026-05-05 16:20', carrier: 'COSCO', weight: '26,400 kg', currentLocation: 'East China Sea' },
  { id: 'SH-008', origin: 'Dubai', destination: 'London', status: 'Delayed', riskLevel: 'Medium', eta: '2026-04-29 22:00', carrier: 'Maersk', weight: '15,700 kg', currentLocation: 'Suez Canal' },
];

const riskOrder: Record<RiskLevel, number> = { Low: 1, Medium: 2, High: 3 };
const statusOrder: Record<ShipmentStatus, number> = { 'On Time': 1, 'At Risk': 2, 'Delayed': 3 };

export default function Shipments() {
  const { searchQuery } = useSearch();
  const { isAdmin } = useRole();

  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortField>('eta');
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetail | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newShipment, setNewShipment] = useState({
    id: '',
    origin: '',
    destination: '',
    status: 'On Time' as ShipmentStatus,
    riskLevel: 'Low' as RiskLevel,
    eta: '',
    carrier: '',
    weight: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Simulate loading on mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...shipments];

    // Global search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.id.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(s => s.status === statusFilter);
    }

    // Risk filter
    if (riskFilter !== 'All') {
      result = result.filter(s => s.riskLevel === riskFilter);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'eta':
          return new Date(a.eta).getTime() - new Date(b.eta).getTime();
        case 'risk':
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        case 'status':
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return result;
  }, [shipments, searchQuery, statusFilter, riskFilter, sortBy]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newShipment.id) newErrors.id = 'Shipment ID is required';
    if (!newShipment.origin) newErrors.origin = 'Origin is required';
    if (!newShipment.destination) newErrors.destination = 'Destination is required';
    if (!newShipment.eta) newErrors.eta = 'ETA is required';
    if (!newShipment.carrier) newErrors.carrier = 'Carrier is required';
    if (!newShipment.weight) newErrors.weight = 'Weight is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddShipment = () => {
    if (!validateForm()) return;
    const shipmentToAdd: Shipment = { ...newShipment };
    setShipments([shipmentToAdd, ...shipments]);
    setShowAddModal(false);
    setSuccessMessage('Shipment added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setNewShipment({
      id: '',
      origin: '',
      destination: '',
      status: 'On Time',
      riskLevel: 'Low',
      eta: '',
      carrier: '',
      weight: ''
    });
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewShipment({
      id: '',
      origin: '',
      destination: '',
      status: 'On Time',
      riskLevel: 'Low',
      eta: '',
      carrier: '',
      weight: ''
    });
    setErrors({});
  };

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case 'On Time': return 'bg-green-100 text-green-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      case 'At Risk': return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'Low': return 'bg-blue-100 text-blue-700';
      case 'Medium': return 'bg-orange-100 text-orange-700';
      case 'High': return 'bg-red-100 text-red-700';
    }
  };

  const hasActiveFilters = statusFilter !== 'All' || riskFilter !== 'All' || searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setStatusFilter('All');
    setRiskFilter('All');
  };

  return (
    <Layout>
      <div className="p-4 sm:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl mb-1">Shipments</h1>
            <p className="text-sm text-gray-500">Manage and track all shipments</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-md active:scale-95 self-start sm:self-auto"
            >
              <Plus className="w-5 h-5" />
              Add Shipment
            </button>
          )}
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="text-green-700 hover:text-green-900 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters & Sorting Bar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="On Time">On Time</option>
              <option value="At Risk">At Risk</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="text-sm bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All">All Risk</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="text-sm bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="eta">Sort by ETA</option>
              <option value="risk">Sort by Risk</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}

          {searchQuery && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-3 py-1.5 rounded-lg">
              <Search className="w-3 h-3" />
              <span>Searching: "{searchQuery}"</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Table */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">All Shipments</h2>
                <span className="text-sm text-gray-500">{filteredAndSorted.length} results</span>
              </div>

              {isLoading ? (
                <LoadingState variant="table" rows={5} />
              ) : filteredAndSorted.length === 0 ? (
                <EmptyState variant={searchQuery ? 'search' : 'shipments'} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">ID</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Origin</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Destination</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Carrier</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Status</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">Risk</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase font-semibold">ETA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAndSorted.map((shipment) => (
                        <tr
                          key={shipment.id}
                          onClick={() => setSelectedShipment(shipment)}
                          className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {shipment.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{shipment.origin}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{shipment.destination}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{shipment.carrier}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                              {shipment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(shipment.riskLevel)}`}>
                              {shipment.riskLevel}
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

          {/* AI Insights Sidebar */}
          <div className="xl:col-span-1">
            <AiInsights shipments={filteredAndSorted} />
          </div>
        </div>

        {/* Add Shipment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-xl font-semibold">Add New Shipment</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Shipment ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newShipment.id}
                      onChange={(e) => setNewShipment({ ...newShipment, id: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.id ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., SH-009"
                    />
                    {errors.id && <p className="text-xs text-red-500 mt-1">{errors.id}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Carrier <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newShipment.carrier}
                      onChange={(e) => setNewShipment({ ...newShipment, carrier: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.carrier ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., Maersk"
                    />
                    {errors.carrier && <p className="text-xs text-red-500 mt-1">{errors.carrier}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Origin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newShipment.origin}
                      onChange={(e) => setNewShipment({ ...newShipment, origin: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.origin ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., Shanghai"
                    />
                    {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Destination <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newShipment.destination}
                      onChange={(e) => setNewShipment({ ...newShipment, destination: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.destination ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., Los Angeles"
                    />
                    {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newShipment.status}
                      onChange={(e) => setNewShipment({ ...newShipment, status: e.target.value as ShipmentStatus })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="On Time">On Time</option>
                      <option value="At Risk">At Risk</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Risk Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newShipment.riskLevel}
                      onChange={(e) => setNewShipment({ ...newShipment, riskLevel: e.target.value as RiskLevel })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Weight <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newShipment.weight}
                      onChange={(e) => setNewShipment({ ...newShipment, weight: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.weight ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="e.g., 24,000 kg"
                    />
                    {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Estimated Time of Arrival (ETA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newShipment.eta}
                    onChange={(e) => setNewShipment({ ...newShipment, eta: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.eta ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.eta && <p className="text-xs text-red-500 mt-1">{errors.eta}</p>}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddShipment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-md active:scale-95"
                >
                  Add Shipment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipment Detail Side Panel */}
        <ShipmentDetailPanel
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      </div>
    </Layout>
  );
}

