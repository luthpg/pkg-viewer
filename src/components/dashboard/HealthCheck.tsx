import { formatDistanceToNow } from 'date-fns';
import { Clock, GitCommit, HardDrive, Package } from 'lucide-react';
import type { PackageMetrics } from '../../lib/api';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface HealthCheckProps {
  metrics: PackageMetrics[];
}

export const HealthCheck = ({ metrics }: HealthCheckProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-slate-400 dark:text-slate-500" />
            Project Health & Status
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4">Downloads</th>
                <th className="px-6 py-4">Bundle Size</th>
                <th className="px-6 py-4">Stars</th>
                <th className="px-6 py-4">Last Commit</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {metrics.map((item) => {
                const lastCommitDate = new Date(item.github.lastCommit);
                const daysSinceCommit =
                  (Date.now() - lastCommitDate.getTime()) / (1000 * 3600 * 24);
                let status: 'success' | 'warning' | 'error' = 'success';
                if (daysSinceCommit > 90) status = 'warning';
                if (daysSinceCommit > 180) status = 'error';

                const isHeavy = item.bundleSize.gzip > 100000;

                return (
                  <tr
                    key={item.name}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Package
                          size={16}
                          className="text-slate-400 dark:text-slate-500"
                        />
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                        v{item.version}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {item.downloads.lastMonth.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`flex items-center gap-1.5 ${isHeavy ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        <HardDrive size={14} />
                        {(item.bundleSize.gzip / 1024).toFixed(1)} kB
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {item.github.stars.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <GitCommit size={14} />
                        {formatDistanceToNow(lastCommitDate, {
                          addSuffix: true,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={status}>
                        {status === 'success'
                          ? 'Active'
                          : status === 'warning'
                            ? 'Stale'
                            : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
