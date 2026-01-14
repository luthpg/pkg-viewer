import { useQueries } from '@tanstack/react-query';
import { api, type PackageMetrics } from '../lib/api';

export interface OssProject {
  name: string; // npm package name
  repo: {
    owner: string;
    name: string;
  };
}

export const useOssMetrics = (projects: OssProject[]) => {
  return useQueries({
    queries: projects.map((project) => ({
      queryKey: ['metrics', project.name],
      queryFn: async (): Promise<PackageMetrics> => {
        const [npmData, githubData, bundleData] = await Promise.all([
          api.getNpmMetrics(project.name),
          api.getGithubMetrics(project.repo.owner, project.repo.name),
          api.getBundleSize(project.name),
        ]);

        return {
          name: project.name,
          downloads: {
            lastMonth: npmData.downloads,
            trend: 0, // Need historical data for trend, simplified for now
          },
          github: {
            stars: githubData.stars,
            issues: githubData.issues,
            lastCommit: githubData.lastCommit || new Date().toISOString(),
            openPrs: 0, // Simplified
          },
          bundleSize: bundleData,
          version: npmData.version || bundleData.version,
        };
      },
      staleTime: 1000 * 60 * 60, // 1 hour
    })),
  });
};
