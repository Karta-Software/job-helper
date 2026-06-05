export type ResumeOutputFormat = "markdown" | "docx" | "pdf" | "html" | "google-doc";
export type ClaimEvidenceRequirement = "verified-only" | "verified-or-partial" | "allow-unsupported-draft";

export type ResumeConstraints = {
  id: string;
  createdAt: string;
  targetRole?: string;
  targetPostingId?: string;
  constraints: {
    maxPages?: number;
    atsSafe?: boolean;
    outputFormats?: ResumeOutputFormat[];
    mustIncludeSections?: string[];
    forbiddenApplicantFacingText?: string[];
    noFourthWallSections?: boolean;
    maxBulletsPerRole?: number;
    claimEvidenceRequirement?: ClaimEvidenceRequirement;
    fitNotesOutsideResume?: boolean;
    renderVerification?: {
      requirePdfPageCount?: boolean;
      requireDocxRenderQa?: boolean;
      allowRendererFallback?: boolean;
    };
  };
  notes?: string;
};

export const DEFAULT_FORBIDDEN_APPLICANT_TEXT = [
  "best target fit",
  "use this version",
  "targeting this role",
  "first-pass opportunities",
  "fourth-wall"
];

export function containsForbiddenApplicantText(text: string, forbidden = DEFAULT_FORBIDDEN_APPLICANT_TEXT): boolean {
  const normalized = text.toLowerCase();
  return forbidden.some((phrase) => normalized.includes(phrase.toLowerCase()));
}

export function requiresOnePagePdf(constraints: ResumeConstraints): boolean {
  return (constraints.constraints.maxPages ?? 1) === 1 && (constraints.constraints.renderVerification?.requirePdfPageCount ?? false);
}
