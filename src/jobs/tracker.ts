export type ApplicationStatus =
  | "discovered"
  | "interested"
  | "applied"
  | "recruiter-screen"
  | "technical-screen"
  | "onsite"
  | "offer"
  | "rejected"
  | "passed"
  | "archived";

export type ApplicationRecord = {
  id: string;
  jobPostingId: string;
  status: ApplicationStatus;
  nextAction: string;
  fitScore?: number;
};
