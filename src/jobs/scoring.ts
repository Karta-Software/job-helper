export type FitScore = {
  overall: number;
  drivers: string[];
  dealbreakers: string[];
};

export function hasDealbreaker(score: FitScore): boolean {
  return score.dealbreakers.length > 0;
}
