import { Skeleton } from './ui/skeleton';

interface LoadingStateProps {
  variant?: 'table' | 'card' | 'map' | 'list';
  rows?: number;
}

export default function LoadingState({ variant = 'table', rows = 5 }: LoadingStateProps) {
  if (variant === 'table') {
    return (
      <div className="w-full p-6 space-y-3">
        {/* Header row */}
        <div className="flex gap-4 pb-3 border-b border-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-4 flex-1" />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex gap-4 items-center py-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <div className="flex-1 flex justify-end">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (variant === 'map') {
    return (
      <div className="w-full h-[500px] bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading map data...</span>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

