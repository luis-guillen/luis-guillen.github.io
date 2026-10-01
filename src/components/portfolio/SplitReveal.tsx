import { createElement, CSSProperties, Fragment } from "react";

export type Segment = string | { text: string; className?: string };

interface SplitRevealProps {
  /** A plain string, or lines made of segments (a segment can carry its own class). */
  lines: string | Segment[][];
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  /** "load" plays on mount; "view" plays when scrolled into view (via useReveal). */
  mode?: "load" | "view";
  className?: string;
  /** Delay before the first word, in ms. */
  delay?: number;
  /** Delay between words, in ms. */
  step?: number;
}

const segText = (s: Segment) => (typeof s === "string" ? s : s.text);

/**
 * Word-by-word mask reveal. Screen readers get the full sentence through
 * aria-label; the animated word spans are hidden from them.
 */
const SplitReveal = ({ lines, as = "span", mode = "view", className = "", delay = 0, step = 60 }: SplitRevealProps) => {
  const normalized: Segment[][] = typeof lines === "string" ? [[lines]] : lines;
  const label = normalized.map((l) => l.map(segText).join(" ")).join(" ");

  let i = 0;
  const content = normalized.map((line, li) => (
    <Fragment key={li}>
      {line.map((seg, si) => {
        const cls = typeof seg === "string" ? "" : seg.className ?? "";
        const words = segText(seg).split(/\s+/).filter(Boolean);
        return words.map((w, wi) => {
          const style = { "--sr-delay": `${delay + i++ * step}ms` } as CSSProperties;
          const isLastInLine = si === line.length - 1 && wi === words.length - 1;
          return (
            <Fragment key={`${li}-${si}-${wi}-${w}`}>
              <span className="sr-word">
                <span className={cls} style={style}>
                  {w}
                </span>
              </span>
              {!isLastInLine && " "}
            </Fragment>
          );
        });
      })}
      {li < normalized.length - 1 && <br />}
    </Fragment>
  ));

  const props =
    mode === "view"
      ? { className: `sr-view ${className}`, "data-reveal": true }
      : { className: `sr-load ${className}` };

  return createElement(
    as,
    { ...props, "aria-label": label },
    <span aria-hidden>{content}</span>
  );
};

export default SplitReveal;
