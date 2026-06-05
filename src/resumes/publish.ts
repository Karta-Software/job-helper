import type { CareerToolkitConfig, PortfolioOutputConfig } from "../config/types";

export type ResumePublishPlan = {
  enabled: boolean;
  sourcePath?: string;
  destinationPath?: string;
  indexPath?: string;
  publicUrl?: string;
  updateIndex: boolean;
  requireCleanWorkingTree: boolean;
};

export function buildResumePublishPlan(
  config: CareerToolkitConfig,
  completedResumeFilename: string
): ResumePublishPlan {
  const portfolio = config.outputs?.portfolio;

  if (!portfolio?.enabled) {
    return {
      enabled: false,
      updateIndex: false,
      requireCleanWorkingTree: false
    };
  }

  const completedRoot = config.outputs?.completedResumes || "resumes/completed";
  const sourcePath = joinPath(config.workspace.root, completedRoot, completedResumeFilename);

  return {
    enabled: true,
    sourcePath,
    destinationPath: joinPath(portfolio.repoRoot, portfolio.currentResumeFilename),
    indexPath: joinPath(portfolio.repoRoot, portfolio.indexFile),
    publicUrl: buildPublicResumeUrl(portfolio),
    updateIndex: portfolio.publishMode === "copy-current-and-update-link",
    requireCleanWorkingTree: portfolio.requireCleanWorkingTree
  };
}

function buildPublicResumeUrl(portfolio: PortfolioOutputConfig): string | undefined {
  if (!portfolio.publicBaseUrl) return undefined;
  return `${portfolio.publicBaseUrl.replace(/\/$/, "")}/${portfolio.currentResumeFilename}`;
}

function joinPath(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .map((part, index) => {
      if (index === 0) return part.replace(/[\\/]$/, "");
      return part.replace(/^[\\/]/, "").replace(/[\\/]$/, "");
    })
    .join("/");
}
