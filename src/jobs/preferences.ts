export type WorkMode = "onsite" | "hybrid" | "remote" | "field" | "travel";

export type PreferenceSlider =
  | "onsite"
  | "hybrid"
  | "remote"
  | "localMarket"
  | "salaryPriority"
  | "experienceStretch"
  | "domainFlexibility"
  | "titleFlexibility"
  | "technicalDepth"
  | "managementLoad"
  | "travelTolerance";

export type JobSearchProfile = {
  id: string;
  createdAt: string;
  targetRoles?: string[];
  locationPreferences?: {
    acceptableWorkModes?: WorkMode[];
    preferredMarkets?: string[];
    excludedMarkets?: string[];
    maxCommuteMinutes?: number;
    relocation?: "yes" | "no" | "consider";
  };
  compensation?: {
    minBaseSalary?: number;
    minTotalComp?: number;
    desiredTotalComp?: number;
    requiresPostedRange?: boolean;
    commissionTolerance?: "none" | "low" | "medium" | "high";
  };
  experience?: {
    candidateYears?: number;
    maxRequiredYears?: number;
    acceptableGapYears?: number;
    seniorityTargets?: string[];
    excludeIfRequiresUnownedDomainYears?: boolean;
  };
  sliders: Partial<Record<PreferenceSlider, number>>;
  dealbreakers?: string[];
  positiveSignals?: string[];
  negativeSignals?: string[];
};

export function clampSlider(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function normalizeSliders(sliders: Partial<Record<PreferenceSlider, number>>): Partial<Record<PreferenceSlider, number>> {
  return Object.fromEntries(Object.entries(sliders).map(([key, value]) => [key, clampSlider(value ?? 0)])) as Partial<
    Record<PreferenceSlider, number>
  >;
}

export function isPreferredWorkMode(profile: JobSearchProfile, mode: WorkMode): boolean {
  return profile.locationPreferences?.acceptableWorkModes?.includes(mode) ?? false;
}

export function isExperienceStretch(profile: JobSearchProfile, requiredYears?: number): boolean {
  const candidateYears = profile.experience?.candidateYears;
  const acceptableGapYears = profile.experience?.acceptableGapYears ?? 0;
  if (candidateYears === undefined || requiredYears === undefined) {
    return false;
  }

  return requiredYears > candidateYears + acceptableGapYears;
}
