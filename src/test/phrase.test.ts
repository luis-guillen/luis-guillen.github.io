import { describe, expect, it } from "vitest";
import { parsePhrase, plainPhrase } from "@/components/portfolio/phrase";

describe("parsePhrase", () => {
  it("splits emphasised words marked with asterisks", () => {
    expect(parsePhrase("Building AI that *actually* ships.")).toEqual([
      { text: "Building AI that ", em: false },
      { text: "actually", em: true },
      { text: " ships.", em: false },
    ]);
  });

  it("handles a phrase that ends on the emphasis", () => {
    expect(parsePhrase("From notebook to *production*.")).toEqual([
      { text: "From notebook to ", em: false },
      { text: "production", em: true },
      { text: ".", em: false },
    ]);
  });

  it("strips the markers for the accessible text", () => {
    expect(plainPhrase("Construyo IA que *de verdad* llega a producción.")).toBe(
      "Construyo IA que de verdad llega a producción.",
    );
  });
});
