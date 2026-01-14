import { Octokit } from '@octokit/rest';

export interface PackageMetrics {
  name: string;
  downloads: {
    lastMonth: number;
    trend: number; // delta
  };
  github: {
    stars: number;
    issues: number;
    lastCommit: string;
    openPrs: number;
  };
  bundleSize: {
    gzip: number;
    size: number;
  };
  version: string;
}

// Ensure you have VITE_GITHUB_TOKEN in your .env or just rate limited requests
const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export const api = {
  getGithubMetrics: async (owner: string, repo: string) => {
    const [repoData] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      // octokit.issues.listForRepo({ owner, repo, state: 'open', per_page: 1 })
    ]);

    // open_issues_count includes PRs, so we might want to fetch PRs separately to subtract or just show "Issues + PRs"
    // For simplicity, using repoData.data.open_issues_count
    return {
      stars: repoData.data.stargazers_count,
      issues: repoData.data.open_issues_count,
      lastCommit: repoData.data.pushed_at,
    };
  },

  getNpmMetrics: async (packageName: string) => {
    // Fetch both download stats and package info from npm
    const [downloadsRes, packageRes] = await Promise.all([
      fetch(`https://api.npmjs.org/downloads/point/last-month/${packageName}`),
      fetch(`https://registry.npmjs.org/${packageName}/latest`),
    ]);

    const downloadsData = await downloadsRes.json();
    const packageData = await packageRes.json();

    return {
      downloads: downloadsData.downloads || 0,
      version: packageData.version || 'unknown',
    };
  },

  getBundleSize: async (packageName: string) => {
    try {
      // Using a public CORS proxy for demo purposes to avoid blocked requests
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const targetUrl = encodeURIComponent(
        `https://bundlephobia.com/api/size?package=${packageName}`,
      );

      const res = await fetch(`${proxyUrl}${targetUrl}`);
      const json = await res.json();
      const data = JSON.parse(json.contents);

      return {
        gzip: data.gzip,
        size: data.size,
        version: data.version,
      };
    } catch (e) {
      console.warn('Bundlephobia failed', e);
      return { gzip: 0, size: 0, version: 'unknown' };
    }
  },
};
