export function nextVariantIndex(current: number, count: number): number {
  if (count <= 1) return 0;
  return (current + 1) % count;
}
