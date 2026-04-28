import Layout from '../components/layout/Layout';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const delayTrendsData = [
  { month: 'Jan', delays: 12 },
  { month: 'Feb', delays: 15 },
  { month: 'Mar', delays: 18 },
  { month: 'Apr', delays: 22 },
  { month: 'May', delays: 19 },
  { month: 'Jun', delays: 16 },
];

const shipmentsByRegionData = [
  { region: 'Asia', shipments: 145 },
  { region: 'Europe', shipments: 98 },
  { region: 'Americas', shipments: 122 },
  { region: 'Middle East', shipments: 67 },
  { region: 'Africa', shipments: 34 },
];

const riskDistributionData = [
  { name: 'On Time', value: 62, color: '#10b981' },
  { name: 'At Risk', value: 23, color: '#f59e0b' },
  { name: 'Delayed', value: 15, color: '#ef4444' },
];

export default function Analytics() {
  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl mb-2">Analytics</h1>
          <p className="text-sm text-gray-500">Supply chain performance insights and trends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Total Shipments</div>
            <div className="text-3xl mb-1">466</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+12% from last month</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Delayed %</div>
            <div className="text-3xl mb-1 text-red-600">15%</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="w-3 h-3" />
              <span>+3% from last week</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">On-Time %</div>
            <div className="text-3xl mb-1 text-green-600">62%</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingDown className="w-3 h-3" />
              <span>-2% from last week</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Avg Delay</div>
            <div className="text-3xl mb-1">4.2h</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="w-3 h-3" />
              <span>+0.8h from last month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg mb-4">Delay Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={delayTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="delays" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg mb-4">Shipments by Region</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={shipmentsByRegionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="region" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="shipments" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="flex gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                <div className="w-1 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Delays increased by 10% this week</p>
                  <p className="text-xs text-gray-500">Port congestion in Rotterdam and Dubai are the main contributors</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                <div className="w-1 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Most delays occurring in Asia region</p>
                  <p className="text-xs text-gray-500">Singapore and Hong Kong routes experiencing 35% higher delay rates</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                <div className="w-1 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Route optimization opportunities identified</p>
                  <p className="text-xs text-gray-500">4 shipments can save an average of 4.1 hours with alternate routing</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                <div className="w-1 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Americas region showing strong performance</p>
                  <p className="text-xs text-gray-500">On-time delivery rate of 78% - highest across all regions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
