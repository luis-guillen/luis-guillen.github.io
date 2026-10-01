import { describe, expect, it } from "vitest";
import { formatMetric, parseMetric } from "@/hooks/use-count-up";

describe("parseMetric", () => {
  it.each([
    ["1+", { prefix: "", value: 1, suffix: "+", decimals: 0, decimalSep: "." }],
    ["20+", { prefix: "", value: 20, suffix: "+", decimals: 0, decimalSep: "." }],
    ["10M+", { prefix: "", value: 10, suffix: "M+", decimals: 0, decimalSep: "." }],
    ["99.2%", { prefix: "", value: 99.2, suffix: "%", decimals: 1, decimalSep: "." }],
    ["$2M", { prefix: "$", value: 2, suffix: "M", decimals: 0, decimalSep: "." }],
    ["16,7 %", { prefix: "", value: 16.7, suffix: " %", decimals: 1, decimalSep: "," }],
  ])("parses %s", (input, expected) => {
    expect(parseMetric(input)).toEqual(expected);
  });

  it("round-trips through formatMetric at the final value", () => {
    for (const s of ["1+", "20+", "10M+", "99.2%", "16,7 %", "100 %"]) {
      const p = parseMetric(s);
      expect(formatMetric(p, p.value)).toBe(s);
    }
  });

  it("keeps the Spanish decimal comma while counting", () => {
    const p = parseMetric("16,7 %");
    expect(formatMetric(p, 8.25)).toBe("8,3 %");
  });

  it("returns the raw text when there is no number", () => {
    const p = parseMetric("n/a");
    expect(Number.isNaN(p.value)).toBe(true);
    expect(formatMetric(p, 0)).toBe("n/a");
  });
});
