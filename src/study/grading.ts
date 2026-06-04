export type GradingExport = {
  exportedAt: string;
  cards: Array<{
    id: string;
    prompt: string;
    answer?: string;
    selectedOption?: number;
    status?: string;
  }>;
};
