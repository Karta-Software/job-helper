export type JobFinderResult = {
  added: number;
  duplicatesSkipped: number;
  needsReview: number;
  recommendedNextActions: string[];
};

export function summarizeFinderRun(result: JobFinderResult): string {
  return `${result.added} added, ${result.duplicatesSkipped} duplicates skipped, ${result.needsReview} need review`;
}
