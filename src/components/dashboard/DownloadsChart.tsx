import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PackageMetrics } from '../../lib/api';
import { Card } from '../ui/Card';

interface DownloadsChartProps {
  metrics: PackageMetrics[];
}

export const DownloadsChart = ({ metrics }: DownloadsChartProps) => {
  const data = metrics.map((m) => ({
    name: m.name,
    downloads: m.downloads.lastMonth,
  }));

  return (
    <Card className="flex flex-col h-[400px]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Downloads by Project (Last Month)
      </h3>
      <div className="flex-1 w-full mt-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-gray-200 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="name"
              className="text-gray-600 dark:text-slate-400"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-gray-600 dark:text-slate-400"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'currentColor' }}
              tickFormatter={(value) =>
                Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(value)
              }
            />
            <Tooltip
              cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '12px',
                backgroundColor: 'var(--tooltip-bg, white)',
                color: 'var(--tooltip-text, #1e293b)',
              }}
              formatter={(value) => [
                value?.toLocaleString() ?? 0,
                'Downloads',
              ]}
            />
            <Area
              type="monotone"
              dataKey="downloads"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorDownloads)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
