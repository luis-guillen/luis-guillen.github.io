import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

const STEPS = ["data", "features", "train", "serve", "monitor"] as const;
const LOOP_SECONDS = 5;

/**
 * Data → Features → Train → Serve → Monitor, with a dot travelling along the
 * line and a dashed loop back from Monitor to Train. HTML + one SVG so the
 * labels stay readable at phone width.
 */
const PipelineDiagram = () => {
  const { t } = useTranslation();
  const label = STEPS.map((s) => t(`about.pipeline.${s}`)).join(" → ");

  return (
    <figure className="mt-16" data-reveal>
      <figcaption className="label-mono">{t("about.pipeline.title")}</figcaption>
      <div className="relative mt-8 pb-14" role="img" aria-label={`${label} · ${t("about.pipeline.loop")}`}>
        {/* main line */}
        <div className="absolute left-[10%] right-[10%] top-[2.1rem] h-px bg-border" aria-hidden>
          <span className="pipe-dot absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
        </div>

        <ol className="relative grid grid-cols-5" aria-hidden>
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-col items-center text-center">
              <span className="font-mono text-[10px] text-muted-foreground">0{i + 1}</span>
              <span
                className="pipe-node mt-2 block h-2.5 w-2.5 rounded-full border border-primary bg-background"
                style={{ "--node-delay": `${(i / (STEPS.length - 1)) * LOOP_SECONDS * 0.999 - 0.05}s` } as CSSProperties}
              />
              <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] sm:text-xs">
                {t(`about.pipeline.${s}`)}
              </span>
            </li>
          ))}
        </ol>

        {/* feedback loop: Monitor (90%) back to Train (50%) */}
        <svg
          className="absolute left-[50%] right-[10%] top-[3.4rem] h-12 w-[40%]"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M100 0 C100 34, 0 34, 0 0"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeDasharray="4 8"
            vectorEffect="non-scaling-stroke"
            className="dash-flow"
          />
        </svg>
        <span className="absolute left-[70%] top-[6.6rem] -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
          ↺ {t("about.pipeline.loop")}
        </span>
      </div>
    </figure>
  );
};

export default PipelineDiagram;
