import { BrainCircuit, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'On Time' | 'Delayed' | 'At Risk';
  riskLevel?: 'Low' | 'Medium' | 'High';
  eta: string;
}

interface AiInsightsProps {
  shipments: Shipment[];
}

export default function AiInsights({ shipments }: AiInsightsProps) {
  const highRiskCount = shipments.filter(s => s.riskLevel === 'High' || s.status === 'At Risk').length;
  const delayedCount = shipments.filter(s => s.status === 'Delayed').length;
  const onTimeCount = shipments.filter(s => s.status === 'On Time').length;

  // Dynamic insights based on data
  const insights: { icon: React.ReactNode; text: string; highlight: string; color: string }[] = [];

  if (highRiskCount > 0) {
    insights.push({
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      text: `${highRiskCount} shipment${highRiskCount > 1 ? 's' : ''} at high risk`,
      highlight: `${highRiskCount} shipment${highRiskCount > 1 ? 's' : ''}`,
      color: 'text-red-600',
    });
  }

  if (delayedCount > 0) {
    insights.push({
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
      text: `Delays increased in ${shipments.find(s => s.status === 'Delayed')?.origin || 'some'} region`,
      highlight: `Delays increased`,
      color: 'text-yellow-600',
    });
  }

  if (onTimeCount > delayedCount) {
    insights.push({
      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
      text: `${Math.round((onTimeCount / shipments.length) * 100)}% on-time performance`,
      highlight: `${Math.round((onTimeCount / shipments.length) * 100)}%`,
      color: 'text-green-600',
    });
  }

  // Fallback
  if (insights.length === 0) {
    insights.push({
      icon: <BrainCircuit className="w-4 h-4 text-blue-500" />,
      text: 'All systems operational',
      highlight: 'Operational',
      color: 'text-blue-600',
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200 group">
            <div className="mt-0.5">{insight.icon}</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className={`font-semibold ${insight.color} group-hover:underline`}>
                {insight.highlight}
              </span>{' '}
              {insight.text.replace(insight.highlight, '').trim()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

