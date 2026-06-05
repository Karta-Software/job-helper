export type JobLinkStatus =
  | "live"
  | "broken"
  | "unavailable"
  | "expired"
  | "confusing"
  | "generic-search"
  | "redirected"
  | "login-required"
  | "paywalled"
  | "duplicate"
  | "unknown";

export type LinkReviewAction =
  | "keep"
  | "replace-link"
  | "find-employer-source"
  | "move-down"
  | "archive"
  | "manual-review";

export type JobLinkReview = {
  postingId: string;
  checkedAt: string;
  checkedBy?: string;
  originalUrl: string;
  finalUrl?: string;
  status: JobLinkStatus;
  evidence?: string[];
  recommendedAction?: LinkReviewAction;
  notes?: string;
};

const LOW_CONFIDENCE_STATUSES: JobLinkStatus[] = [
  "broken",
  "unavailable",
  "expired",
  "confusing",
  "generic-search",
  "login-required",
  "paywalled",
  "unknown"
];

export function needsReplacementLink(review: JobLinkReview): boolean {
  return ["broken", "unavailable", "expired", "confusing", "generic-search"].includes(review.status);
}

export function shouldMoveDown(review: JobLinkReview): boolean {
  return LOW_CONFIDENCE_STATUSES.includes(review.status);
}

export function defaultLinkReviewAction(status: JobLinkStatus): LinkReviewAction {
  switch (status) {
    case "live":
    case "redirected":
      return "keep";
    case "duplicate":
      return "archive";
    case "broken":
    case "unavailable":
    case "expired":
      return "replace-link";
    case "confusing":
    case "generic-search":
      return "find-employer-source";
    default:
      return "manual-review";
  }
}
