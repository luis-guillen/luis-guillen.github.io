import { CSSProperties, Fragment, useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { parsePhrase, plainPhrase } from "./phrase";

const Phrase = ({ text }: { text: string }) => (
  <>
    {parsePhrase(text).map((p, i) => (p.em ? <em key={i}>{p.text}</em> : <Fragment key={i}>{p.text}</Fragment>))}
  </>
);

interface RotatingHeadlineProps {
  /** Phrases to cycle through; wrap the emphasised words in *asterisks*. */
  phrases: string[];
  className?: string;
  /** Delay before the first phrase sweeps in, in ms. */
  delay?: number;
  /** How long the first phrase stays before rotating, in ms. */
  firstHold?: number;
  /** Time between later swaps, in ms (includes the 3 s sweep). */
  hold?: number;
}

/**
 * Headline that swaps phrases with a colour sweep: a band in the site palette
 * wipes the old phrase out and paints the new one in. The first phrase is the
 * real h1 text for screen readers and search engines; the rotation is visual.
 */
const RotatingHeadline = ({ phrases, className = "", delay = 250, firstHold = 7000, hold = 5500 }: RotatingHeadlineProps) => {
  const [ref, inView] = useInView<HTMLHeadingElement>();
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [state, setState] = useState({ cur: 0, prev: null as number | null, swaps: 0 });
  const key = phrases.join("|");

  // A language change restarts from the first phrase.
  useEffect(() => setState({ cur: 0, prev: null, swaps: 0 }), [key]);

  useEffect(() => {
    if (reduced || !inView || phrases.length < 2) return;
    let id = 0;
    const schedule = () => {
      const wait = state.swaps === 0 ? firstHold : hold;
      id = window.setTimeout(() => {
        if (document.hidden) return schedule();
        setState((s) => ({ cur: (s.cur + 1) % phrases.length, prev: s.cur, swaps: s.swaps + 1 }));
      }, wait);
    };
    schedule();
    return () => window.clearTimeout(id);
  }, [reduced, inView, phrases.length, state.swaps, firstHold, hold]);

  const { cur, prev, swaps } = state;
  const intro = !reduced && swaps === 0;
  const inClass = reduced ? "rh-static" : intro ? "rh-intro" : "rh-in";

  return (
    <h1 ref={ref} className={className}>
      <span className="sr-only">{plainPhrase(phrases[0])}</span>
      <span aria-hidden className="rh" style={{ "--rh-delay": `${delay}ms` } as CSSProperties}>
        {/* Invisible copies reserve the tallest phrase, so the layout never jumps. */}
        {phrases.map((p) => (
          <span key={`m-${p}`} className="rh-phrase rh-measure">
            <Phrase text={p} />
          </span>
        ))}
        {prev !== null && (
          <span key={`out-${key}-${swaps}`} className="rh-phrase">
            <span className="rh-text rh-out">
              <Phrase text={phrases[prev]} />
            </span>
          </span>
        )}
        <span key={`in-${key}-${swaps}`} className="rh-phrase">
          <span className={`rh-text ${inClass}`}>
            <Phrase text={phrases[reduced ? 0 : cur]} />
          </span>
        </span>
      </span>
    </h1>
  );
};

export default RotatingHeadline;
