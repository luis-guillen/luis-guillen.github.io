export interface PhrasePart {
  text: string;
  em: boolean;
}

/** "Building AI that *actually* ships." → plain and emphasised parts. */
export function parsePhrase(phrase: string): PhrasePart[] {
  return phrase
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((p) => (p.startsWith("*") && p.endsWith("*") ? { text: p.slice(1, -1), em: true } : { text: p, em: false }));
}

export const plainPhrase = (phrase: string) => phrase.replace(/\*/g, "");
