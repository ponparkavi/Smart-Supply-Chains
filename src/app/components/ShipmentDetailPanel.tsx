import { X, MapPin, Clock, Package, TrendingUp, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

type ShipmentStatus = 'On Time' | 'Delayed' | 'At Risk';
type RiskLevel = 'Low' | 'Medium' | 'High';

const verifiedPlaces = ['Shanghai', 'Los Angeles', 'Rotterdam', 'New York', 'Singapore', 'Dubai', 'Miami', 'Tokyo', 'Seattle', 'Hamburg', 'Vancouver', 'Busan', 'London', 'Hong Kong'];
const verifyPlace = (place: string) => verifiedPlaces.some((known) => place.toLowerCase().includes(known.toLowerCase()));

export interface ShipmentDetail {
  id: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  riskLevel: RiskLevel;
  risk_level?: RiskLevel; // API format
  eta: string;
  carrier: string;
  weight: string;
  currentLocation?: string;
  current_location?: string; // API format
}

interface ShipmentDetailPanelProps {
  shipment: ShipmentDetail | null;
  onClose: () => void;
}

const timelineEvents = [
  { status: 'Dispatched', location: 'Origin Port', completed: true },
  { status: 'In Transit', location: 'En Route', completed: true },
  { status: 'Customs Clearance', location: 'Border Control', completed: false },
  { status: 'Arrived', location: 'Destination Port', completed: false },
];

export default function ShipmentDetailPanel({ shipment, onClose }: ShipmentDetailPanelProps) {
  if (!shipment) return null;

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

  const getStatusDotColor = (status: ShipmentStatus) => {
    switch (status) {
      case 'On Time': return 'bg-green-500';
      case 'Delayed': return 'bg-red-500';
      case 'At Risk': return 'bg-yellow-500';
    }
  };

  return (
    <Sheet open={!!shipment} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">Shipment Details</SheetTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* ID & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Shipment ID</p>
              <p className="text-2xl font-semibold text-gray-900">{shipment.id}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
              {shipment.status}
            </span>
          </div>

          {/* Route */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900">{shipment.origin}</p>
                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mt-1">
                  {verifyPlace(shipment.origin) ? <CheckCircle className="w-3 h-3 text-green-600" /> : <AlertTriangle className="w-3 h-3 text-yellow-600" />}
                  <span>{verifyPlace(shipment.origin) ? 'Verified' : 'Needs verification'}</span>
                </div>
                <p className="text-xs text-gray-500">Origin</p>
              </div>
              <div className="flex-1 px-4">
                <div className="relative h-0.5 bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusDotColor(shipment.status)} ring-4 ring-white`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 absolute right-0 -top-2" />
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">{shipment.currentLocation || 'En Route'}</p>
              </div>
              <div className="text-center">
                <MapPin className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900">{shipment.destination}</p>
                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mt-1">
                  {verifyPlace(shipment.destination) ? <CheckCircle className="w-3 h-3 text-green-600" /> : <AlertTriangle className="w-3 h-3 text-yellow-600" />}
                  <span>{verifyPlace(shipment.destination) ? 'Verified' : 'Needs verification'}</span>
                </div>
                <p className="text-xs text-gray-500">Destination</p>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Route Preview</p>
            <div className="h-40 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl border border-gray-200 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 400 160">
                  <path
                    d="M 40 80 Q 120 30, 200 80 T 360 80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  <circle cx="40" cy="80" r="6" fill="#3b82f6" />
                  <circle cx="360" cy="80" r="6" fill="#10b981" />
                  <circle cx="200" cy="55" r="5" fill={shipment.status === 'On Time' ? '#10b981' : shipment.status === 'At Risk' ? '#f59e0b' : '#ef4444'} />
                </svg>
              </div>
              <div className="relative z-10 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Live tracking active</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">ETA</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{shipment.eta}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Package className="w-4 h-4" />
                <span className="text-xs">Weight</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{shipment.weight}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Carrier</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{shipment.carrier}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Risk Level</span>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(shipment.riskLevel)}`}>
                {shipment.riskLevel}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Shipment Progress</p>
            <div className="space-y-0">
              {timelineEvents.map((event, index) => (
                <div key={event.status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${event.completed ? 'bg-blue-500' : 'bg-gray-200'} ring-2 ring-white`} />
                    {index < timelineEvents.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[24px] ${event.completed ? 'bg-blue-200' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className={`pb-4 ${event.completed ? '' : 'opacity-50'}`}>
                    <p className="text-sm font-medium text-gray-900">{event.status}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

