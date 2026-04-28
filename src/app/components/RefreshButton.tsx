import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh?: () => void;
  className?: string;
}

export default function RefreshButton({ onRefresh, className = '' }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onRefresh?.();
    setIsRefreshing(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isRefreshing}
      className={`
        flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white
        border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300
        transition-all duration-200 active:scale-95 disabled:opacity-60
        ${isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh Data'}</span>
    </button>
  );
}

