import { useEffect, useState } from "react";

const GLYPHS = "▮/\\_01#*<>[]";

/**
 * One frame of the decode effect: characters before `progress` are final,
 * the rest are random glyphs. Whitespace is always kept so line length is stable.
 */
export function scrambleFrame(target: string, progress: number, rand: () => number = Math.random): string {
  const revealed = Math.floor(Math.min(Math.max(progress, 0), 1) * target.length);
  let out = "";
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    out += i < revealed || /\s/.test(ch) ? ch : GLYPHS[Math.floor(rand() * GLYPHS.length)];
  }
  return out;
}

/** Terminal-style decode from random glyphs to `text`. Re-runs when `text` changes. */
export function useScramble(text: string, { delay = 0, duration = 700 } = {}): string {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [out, setOut] = useState(() => (reduce ? text : scrambleFrame(text, 0)));

  useEffect(() => {
    if (reduce) {
      setOut(text);
      return;
    }
    let interval = 0;
    const start = window.setTimeout(() => {
      const t0 = performance.now();
      interval = window.setInterval(() => {
        const p = (performance.now() - t0) / duration;
        if (p >= 1) {
          setOut(text);
          window.clearInterval(interval);
        } else {
          setOut(scrambleFrame(text, p));
        }
      }, 32);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [text, delay, duration, reduce]);

  return out;
}
