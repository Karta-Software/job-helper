export function buildPrompt(systemInstructions: string, userInput: string): string {
  return `${systemInstructions.trim()}\n\n---\n\n${userInput.trim()}`;
}
