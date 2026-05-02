import { useState, useEffect, useRef, useCallback } from 'react';

// Google Maps API types
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

interface GoogleLocationPickerProps {
  value: { lat: number; lng: number; name: string } | null;
  onChange: (location: { lat: number; lng: number; name: string }) => void;
  label: string;
  apiKey?: string;
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

// Load Google Maps script
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }
    
    window.initMap = () => resolve();
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
}

export default function GoogleLocationPicker({ value, onChange, label, apiKey = '' }: GoogleLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const defaultCenter = value ? { lat: value.lat, lng: value.lng } : { lat: 20, lng: 0 };

  const filteredPorts = majorPorts.filter(port =>
    port.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize map
  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (!mapRef.current) return;

        const map = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: value ? 5 : 2,
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#a2d9ff' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }]
            }
          ]
        });
        
        mapInstanceRef.current = map;

        // Add click listener
        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            
            // Find closest major port
            const closestPort = majorPorts.reduce((closest, port) => {
              const dist = Math.sqrt(Math.pow(port.lat - lat, 2) + Math.pow(port.lng - lng, 2));
              const closestDist = closest ? Math.sqrt(Math.pow(closest.lat - lat, 2) + Math.pow(closest.lng - lng, 2)) : Infinity;
              return dist < closestDist ? port : closest;
            }, null as typeof majorPorts[0] | null);
            
            const name = closestPort && Math.sqrt(Math.pow(closestPort.lat - lat, 2) + Math.pow(closestPort.lng - lng, 2)) < 10 
              ? closestPort.name 
              : `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
            
            onChange({ lat, lng, name });
          }
        });

        setIsMapLoaded(true);
      })
      .catch(err => console.error('Failed to load Google Maps:', err));
  }, [apiKey]);

  // Update marker when value changes
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    if (value && value.lat !== 0) {
      markerRef.current = new window.google.maps.Marker({
        position: { lat: value.lat, lng: value.lng },
        map: mapInstanceRef.current,
        title: value.name,
        animation: window.google.maps.Animation.DROP
      });
      
      mapInstanceRef.current.setCenter({ lat: value.lat, lng: value.lng });
      mapInstanceRef.current.setZoom(5);
    }
  }, [value, isMapLoaded]);

  const handleSelectPort = (port: typeof majorPorts[0]) => {
    onChange({ lat: port.lat, lng: port.lng, name: port.name });
    setSearchQuery('');
    setShowSuggestions(false);
  };

  if (!apiKey) {
    // Fallback to simple input if no API key
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={value?.name || ''}
          onChange={(e) => onChange({ lat: 0, lng: 0, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter location name"
        />
      </div>
    );
  }

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
      
      {/* Google Map */}
      <div ref={mapRef} className="h-64 rounded-lg overflow-hidden border border-gray-200" />
      
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
