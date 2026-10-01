import { useEffect, useState } from "react";

export interface ParsedMetric {
  prefix: string;
  value: number;
  suffix: string;
  decimals: number;
  /** Decimal separator as written in the input: "." in English, "," in Spanish. */
  decimalSep: "." | ",";
}

/** Splits a display metric like "10M+", "99.2%" or "16,7 %" into its numeric part and affixes. */
export function parseMetric(input: string): ParsedMetric {
  const m = input.match(/^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return { prefix: "", value: NaN, suffix: input, decimals: 0, decimalSep: "." };
  const [, prefix, num, suffix] = m;
  const decimalSep = num.includes(",") ? "," : ".";
  const [, frac = ""] = num.split(decimalSep);
  return { prefix, value: parseFloat(num.replace(",", ".")), suffix, decimals: frac.length, decimalSep };
}

export function formatMetric(p: ParsedMetric, v: number): string {
  if (Number.isNaN(p.value)) return p.suffix;
  return `${p.prefix}${v.toFixed(p.decimals).replace(".", p.decimalSep)}${p.suffix}`;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts from 0 to the metric's value once `start` is true. Returns the formatted string. */
export function useCountUp(target: string, start: boolean, duration = 1200): string {
  const parsed = parseMetric(target);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [display, setDisplay] = useState(() => (reduce ? target : formatMetric(parsed, 0)));

  useEffect(() => {
    if (!start) return;
    const p = parseMetric(target);
    if (reduce || Number.isNaN(p.value)) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      setDisplay(formatMetric(p, p.value * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Guarantee the final value even if rAF is throttled (background tabs).
    const safety = window.setTimeout(() => setDisplay(target), duration + 150);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [target, start, duration, reduce]);

  return display;
}
