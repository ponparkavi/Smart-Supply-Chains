import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
  value: { lat: number; lng: number; name: string } | null;
  onChange: (location: { lat: number; lng: number; name: string }) => void;
  label: string;
}

// List of major ports/regions for location suggestions
const majorPorts = [
  { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
  { name: 'Los Angeles, USA', lat: 33.7405, lng: -118.2720 },
  { name: 'Rotterdam, Netherlands', lat: 51.9225, lng: 4.4792 },
  { name: 'New York, USA', lat: 40.6892, lng: -74.0445 },
  { name: 'Singapore', lat: 1.2644, lng: 103.8198 },
  { name: 'Sydney, Australia', lat: -33.8600, lng: 151.2090 },
  { name: 'Dubai, UAE', lat: 25.2697, lng: 55.3094 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Hamburg, Germany', lat: 53.5511, lng: 9.9937 },
  { name: 'Tokyo, Japan', lat: 35.4437, lng: 139.6380 },
  { name: 'Hong Kong', lat: 22.2855, lng: 114.1577 },
  { name: 'Busan, South Korea', lat: 35.1028, lng: 129.0403 },
  { name: 'Miami, USA', lat: 25.7617, lng: -80.1918 },
  { name: 'Vancouver, Canada', lat: 49.2827, lng: -123.1207 },
  { name: 'Long Beach, USA', lat: 33.7701, lng: -118.1937 },
  { name: 'Seattle, USA', lat: 47.6062, lng: -122.3321 },
  { name: 'Pacific Ocean', lat: 0.0, lng: -160.0 },
  { name: 'Atlantic Ocean', lat: 30.0, lng: -40.0 },
  { name: 'Suez Canal, Egypt', lat: 30.4550, lng: 32.3500 },
  { name: 'Malacca Strait', lat: 2.5000, lng: 101.5000 },
  { name: 'English Channel', lat: 50.0000, lng: -2.0000 },
  { name: 'Sea of Japan', lat: 40.0, lng: 135.0 },
  { name: 'East China Sea', lat: 30.0, lng: 125.0 },
  { name: 'North Pacific', lat: 45.0, lng: -170.0 },
];

// Component to handle map click events
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (location: { lat: number; lng: number; name: string }) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      // Find closest major port or use coordinates
      const closestPort = majorPorts.reduce((closest, port) => {
        const dist = Math.sqrt(Math.pow(port.lat - lat, 2) + Math.pow(port.lng - lng, 2));
        const closestDist = closest ? Math.sqrt(Math.pow(closest.lat - lat, 2) + Math.pow(closest.lng - lng, 2)) : Infinity;
        return dist < closestDist ? port : closest;
      }, null as typeof majorPorts[0] | null);
      
      const name = closestPort && Math.sqrt(Math.pow(closestPort.lat - lat, 2) + Math.pow(closestPort.lng - lng, 2)) < 10 
        ? closestPort.name 
        : `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
      
      onLocationSelect({ lat, lng, name });
    },
  });
  return null;
}

// Component to center map on value changes
function MapCenterHandler({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0 || center[1] !== 0) {
      map.setView(center, 10);
    }
  }, [center, map]);
  return null;
}

export default function LocationPicker({ value, onChange, label }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const defaultCenter: [number, number] = value 
    ? [value.lat, value.lng] 
    : [20, 0];
  
  const filteredPorts = majorPorts.filter(port =>
    port.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPort = (port: typeof majorPorts[0]) => {
    onChange({ lat: port.lat, lng: port.lng, name: port.name });
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      
      {/* Selected location display */}
      {value && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-700">{value.name}</span>
          <button 
            type="button"
            onClick={() => onChange({ lat: 0, lng: 0, name: '' })}
            className="ml-auto text-xs text-blue-600 hover:text-blue-800"
          >
            Clear
          </button>
        </div>
      )}
      
      {/* Search/select input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={value ? '' : 'Search for a port or location...'}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Suggestions dropdown */}
        {showSuggestions && filteredPorts.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredPorts.map((port) => (
              <button
                key={port.name}
                type="button"
                onClick={() => handleSelectPort(port)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors"
              >
                {port.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Map */}
      <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={defaultCenter}
          zoom={value ? 5 : 2}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={onChange} />
          <MapCenterHandler center={defaultCenter} />
          {value && value.lat !== 0 && (
            <Marker position={[value.lat, value.lng]} />
          )}
        </MapContainer>
      </div>
      
      <p className="text-xs text-gray-500">
        Click on the map or select from the suggestions above
      </p>
    </div>
  );
}

// Helper to format coordinates for display
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}
