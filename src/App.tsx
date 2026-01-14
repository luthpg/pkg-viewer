import { DownloadsChart } from './components/dashboard/DownloadsChart';
import { HealthCheck } from './components/dashboard/HealthCheck';
import { OverviewCards } from './components/dashboard/OverviewCards';
import { Card } from './components/ui/Card';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { type OssProject, useOssMetrics } from './hooks/useOssMetrics';

// Define your projects here
const PROJECTS: OssProject[] = [
  { name: '@ciderjs/gasnuki', repo: { owner: 'luthpg', name: 'gasnuki' } },
  { name: '@ciderjs/city-gas', repo: { owner: 'luthpg', name: 'city-gas' } },
  {
    name: 'vite-plugin-google-apps-script',
    repo: { owner: 'luthpg', name: 'vite-plugin-google-apps-script' },
  },
  {
    name: 'rolldown-plugin-remove-export',
    repo: { owner: 'luthpg', name: 'rolldown-plugin-remove-export' },
  },
];

function App() {
  const results = useOssMetrics(PROJECTS);
  const isLoading = results.some((r) => r.isLoading);

  // Filter out failed queries or map to a safe structure
  const metrics = results
    .filter((r) => r.status === 'success' && r.data)
    .map((r) => r.data!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 sm:p-10 transition-colors">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            OSS Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Overview of self-published open source projects
          </p>
        </div>
        <ThemeToggle />
      </header>

      <main className="space-y-6">
        <OverviewCards metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DownloadsChart metrics={metrics} />
          {/* Placeholder for future comparison or other charts */}
          <Card className="flex flex-col items-center justify-center text-center h-[400px] bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-labelledby="comparison-icon"
              >
                <title id="comparison-icon">Comparison Chart</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Comparison View
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">
              Compare your packages with competitors - coming soon!
            </p>
          </Card>
        </div>

        <HealthCheck metrics={metrics} />
      </main>
    </div>
  );
}

export default App;
