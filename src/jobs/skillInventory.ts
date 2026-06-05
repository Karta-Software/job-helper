export type CandidateSkillStatus = "direct" | "adjacent" | "do-not-claim" | "unknown";
export type ClaimPolicy = "claim-directly" | "frame-carefully" | "do-not-claim" | "needs-clarification";
export type SkillPriority = "must-have" | "nice-to-have" | "differentiator" | "avoid";

export type SkillInventoryItem = {
  name: string;
  category?: string;
  listedInPosting?: boolean;
  source?: "posting" | "candidate" | "inferred" | "research" | "user";
  candidateStatus?: CandidateSkillStatus;
  claimPolicy: ClaimPolicy;
  priority?: SkillPriority;
  evidenceIds?: string[];
  examples?: string[];
  notes?: string;
};

export type SkillInventory = {
  id: string;
  createdAt: string;
  jobPostingId?: string;
  candidateGraphId?: string;
  skills: SkillInventoryItem[];
  questionsForCandidate?: string[];
};

export function applicantSafeSkills(inventory: SkillInventory): SkillInventoryItem[] {
  return inventory.skills.filter((skill) => skill.claimPolicy === "claim-directly" || skill.claimPolicy === "frame-carefully");
}

export function unlistedCandidateStrengths(inventory: SkillInventory): SkillInventoryItem[] {
  return applicantSafeSkills(inventory).filter((skill) => skill.listedInPosting === false);
}

export function skillsNeedingClarification(inventory: SkillInventory): SkillInventoryItem[] {
  return inventory.skills.filter((skill) => skill.claimPolicy === "needs-clarification" || skill.candidateStatus === "unknown");
}
