import { CircleDot, Download, Star, TrendingUp } from 'lucide-react';
import type { PackageMetrics } from '../../lib/api';
import { Card } from '../ui/Card';

interface OverviewCardsProps {
  metrics: PackageMetrics[];
}

export const OverviewCards = ({ metrics }: OverviewCardsProps) => {
  const totalDownloads = metrics.reduce(
    (acc, curr) => acc + (curr.downloads.lastMonth || 0),
    0,
  );
  const totalStars = metrics.reduce(
    (acc, curr) => acc + (curr.github.stars || 0),
    0,
  );
  const totalIssues = metrics.reduce(
    (acc, curr) => acc + (curr.github.issues || 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Downloads Card */}
      <Card className="relative overflow-hidden border-t-4 border-t-blue-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full -mr-10 -mt-10" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Downloads (Last Month)
            </p>
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/25">
              <Download size={18} />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
            {totalDownloads.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <TrendingUp size={14} />
            <span>+12.5% from last month</span>
          </div>
        </div>
      </Card>

      {/* Stars Card */}
      <Card className="relative overflow-hidden border-t-4 border-t-amber-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/20 rounded-full -mr-10 -mt-10" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Stars
            </p>
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white shadow-lg shadow-amber-500/25">
              <Star size={18} />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
            {totalStars.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <TrendingUp size={14} />
            <span>+8.2% from last month</span>
          </div>
        </div>
      </Card>

      {/* Issues Card */}
      <Card className="relative overflow-hidden border-t-4 border-t-rose-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 dark:bg-rose-500/20 rounded-full -mr-10 -mt-10" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Open Issues
            </p>
            <div className="p-2.5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl text-white shadow-lg shadow-rose-500/25">
              <CircleDot size={18} />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
            {totalIssues.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
            <span>Across {metrics.length} projects</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
