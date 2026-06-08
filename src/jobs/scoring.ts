export type ExperienceOverlap = {
  bucket: string;
  evidence: string[];
  strength: "direct" | "adjacent" | "unknown" | "do-not-claim";
};

export type FitScore = {
  overall: number;
  drivers: string[];
  dealbreakers: string[];
  experienceOverlap?: ExperienceOverlap[];
  missingCriticalRequirements?: string[];
  recommendationBucket?: "strong" | "possible" | "stretch" | "blocked" | "unrelated";
};

export function hasDealbreaker(score: FitScore): boolean {
  return score.dealbreakers.length > 0;
}
