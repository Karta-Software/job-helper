export type ApplicationStatus =
  | "applied"
  | "recruiter-screen"
  | "technical-screen"
  | "onsite-final"
  | "offer"
  | "rejected"
  | "passed"
  | "archived";

export type OpportunityStatus =
  | "target"
  | "researching"
  | "referral-identified"
  | "referral-requested"
  | "resume-draft"
  | "ready-to-apply"
  | "applied"
  | "recruiter-screen"
  | "technical-screen"
  | "onsite-final"
  | "offer"
  | "rejected"
  | "passed"
  | "archived";

export type ReferralStatus =
  | "none"
  | "identified"
  | "requested"
  | "submitted"
  | "needs-follow-up"
  | "not-available";

export type OpportunityRecord = {
  id: string;
  company: string;
  role?: string;
  location?: string;
  remote?: boolean;
  locationFit?: "match" | "workable" | "unknown" | "mismatch";
  locationNotes?: string;
  locationExceptionReason?: string;
  source?: "referral" | "job-board" | "company-careers" | "recruiter" | "network" | "manual" | "other";
  status: OpportunityStatus;
  priority?: "high" | "medium" | "low";
  fitScore?: number;
  postingUrl?: string;
  jobPostingId?: string;
  applicationDeadline?: string;
  applicationDeadlineText?: string;
  applicationDeadlineTimezone?: string;
  resumeVersionId?: string;
  referral?: {
    status: ReferralStatus;
    contactName?: string;
    relationship?: string;
    notes?: string;
  };
  evidenceGaps?: string[];
  dealbreakers?: string[];
  nextAction: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
};

export type ApplicationRecord = {
  id: string;
  jobPostingId: string;
  opportunityId?: string;
  status: ApplicationStatus;
  nextAction: string;
  fitScore?: number;
};
