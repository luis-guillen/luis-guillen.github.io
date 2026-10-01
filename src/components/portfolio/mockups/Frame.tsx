import { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

interface FrameProps {
  /** Filename-style label in the title bar, e.g. "neuraldoc — query.tsx". */
  title: string;
  /** Short status in the title bar, e.g. "live" or "prod". */
  status: string;
  /** Accessible description of what the preview shows. */
  label: string;
  /** Optional real screenshot (e.g. "/projects/p1.png"). When set, it replaces the SVG mockup. */
  src?: string;
  children: ReactNode;
  className?: string;
}

/**
 * App-window frame for a project preview. The SVG inside only animates while
 * the frame is on screen (`.is-playing`), so off-screen mockups cost nothing.
 */
const Frame = ({ title, status, label, src, children, className = "" }: FrameProps) => {
  const [ref, inView] = useInView<HTMLElement>();

  return (
    <figure
      ref={ref}
      className={`mock ${inView ? "is-playing" : ""} overflow-hidden rounded-sm border border-border bg-card shadow-[0_40px_90px_-50px_rgba(0,0,0,0.65)] ${className}`}
    >
      <div className="hairline-b flex h-8 items-center justify-between px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        <span className="truncate">{title}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="blink h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
          {status}
        </span>
      </div>
      {src ? (
        <img src={src} alt={label} loading="lazy" className="block aspect-[16/10] w-full object-cover" />
      ) : (
        <svg viewBox="0 0 640 400" role="img" aria-label={label} className="block h-auto w-full">
          {children}
        </svg>
      )}
    </figure>
  );
};

export default Frame;
