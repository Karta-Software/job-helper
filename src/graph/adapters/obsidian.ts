export type GraphDocument = {
  path: string;
  title: string;
  body: string;
  frontmatter?: Record<string, unknown>;
  links: string[];
};

export function parseWikiLinks(markdown: string): string[] {
  const matches = markdown.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g);
  return [...matches].map((match) => match[1].trim());
}
