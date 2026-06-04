export type CsvPostingRow = Record<string, string>;

export function normalizeCsvHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, "_");
}
