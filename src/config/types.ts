export type GraphAdapter = "obsidian" | "json";

export type PortfolioPublishMode = "copy-current" | "copy-current-and-update-link" | "manual";

export type PortfolioOutputConfig = {
  enabled: boolean;
  repoRoot: string;
  indexFile: string;
  currentResumeFilename: string;
  publicBaseUrl?: string;
  publishMode: PortfolioPublishMode;
  requireCleanWorkingTree: boolean;
};

export type CareerToolkitConfig = {
  graph: {
    adapter: GraphAdapter;
    root: string;
    entrypoint: string;
  };
  workspace: {
    root: string;
  };
  outputs?: {
    resumeVersions?: string;
    renderedResumes?: string;
    completedResumes?: string;
    resumeStandards?: string;
    resumeQualityGates?: string;
    opportunities?: string;
    portfolio?: PortfolioOutputConfig;
  };
  privacy: {
    redactPersonalContactInfo?: boolean;
    neverCommitGraph?: boolean;
  };
  profile: {
    targetRoles?: string[];
    locationPreference?: string;
    dealbreakers?: string[];
  };
  jobs: {
    sources?: string[];
    autoApply?: boolean;
  };
};

export function getConfigPath(env: Record<string, string | undefined>): string {
  return env.CAREER_TOOLKIT_CONFIG || "career-toolkit.config.json";
}
