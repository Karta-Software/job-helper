export type ResumeVersion = {
  id: string;
  title: string;
  createdAt: string;
  target: {
    role?: string;
    company?: string;
    postingId?: string;
  };
  sections: Record<string, unknown>;
};

export function makeResumeVersionId(date: string, slug: string): string {
  return `${date}-${slug}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
