export type EvidenceStatus = "verified" | "partial" | "needs-source" | "unsupported";

export function isPublicSafeClaim(status: EvidenceStatus): boolean {
  return status === "verified" || status === "partial";
}
