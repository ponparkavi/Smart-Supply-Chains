import { PackageX, SearchX, MapPinOff, BellOff } from 'lucide-react';

interface EmptyStateProps {
  variant?: 'shipments' | 'search' | 'map' | 'alerts';
  message?: string;
}

export default function EmptyState({ variant = 'shipments', message }: EmptyStateProps) {
  const configs = {
    shipments: {
      icon: PackageX,
      defaultMessage: 'No shipments found',
      subMessage: 'Try adjusting your filters or add a new shipment.',
    },
    search: {
      icon: SearchX,
      defaultMessage: 'No results found',
      subMessage: 'Try searching with different keywords.',
    },
    map: {
      icon: MapPinOff,
      defaultMessage: 'No locations to display',
      subMessage: 'Add shipments to see them on the map.',
    },
    alerts: {
      icon: BellOff,
      defaultMessage: 'No alerts',
      subMessage: 'Everything looks good. No active alerts at the moment.',
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        {message || config.defaultMessage}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">{config.subMessage}</p>
    </div>
  );
}

