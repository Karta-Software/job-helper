export type ClaimEvidence = {
  claim: string;
  evidenceIds: string[];
  status: "verified" | "partial" | "needs-source" | "unsupported";
};

export function findUnsupportedClaims(claims: ClaimEvidence[]): ClaimEvidence[] {
  return claims.filter((claim) => claim.status === "needs-source" || claim.status === "unsupported");
}
