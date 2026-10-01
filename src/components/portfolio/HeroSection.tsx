import { CSSProperties, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocalTime } from "@/hooks/use-local-time";
import { useScramble } from "@/hooks/use-scramble";
import { useCountUp } from "@/hooks/use-count-up";
import { useInView } from "@/hooks/use-in-view";
import Marquee from "./Marquee";
import RotatingHeadline from "./RotatingHeadline";
import { STACK_GROUPS } from "./stack";
import { cvFor } from "@/lib/cv";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/luis-guillen" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/luis-guillen-servera/" },
  { label: "Email", href: "mailto:luisgservsp@gmail.com" },
];

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

const Scrambled = ({ text, at }: { text: string; at: number }) => {
  const out = useScramble(text, { delay: at, duration: 750 });
  return (
    <span aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
};

const Metric = ({ value, label, start }: { value: string; label: string; start: boolean }) => {
  const shown = useCountUp(value, start);
  return (
    <div>
      <dd className="display text-3xl tabular-nums md:text-5xl" aria-label={value}>
        <span aria-hidden>{shown}</span>
      </dd>
      <dt className="label-mono mt-2">{label}</dt>
    </div>
  );
};

/** Headline drifts up and fades a little while the hero scrolls away. */
function useHeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const y = Math.min(window.scrollY, window.innerHeight);
      el.style.transform = `translate3d(0, ${y * -0.15}px, 0)`;
      el.style.opacity = String(1 - (y / window.innerHeight) * 0.6);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const cv = cvFor(i18n.language);
  const time = useLocalTime();
  const headlineRef = useHeroParallax();
  const [metricsRef, metricsInView] = useInView<HTMLDListElement>({ once: true });

  const metrics = t("hero.metrics", { returnObjects: true }) as { value: string; label: string }[];

  const stack = STACK_GROUPS.flatMap((g) => g.skills).slice(0, 18);

  return (
    <section id="top" className="hero-glow relative overflow-hidden">
      <div className="mx-auto max-w-page px-6 pb-14 pt-28 md:px-10 md:pb-20 md:pt-36">
        {/* Status line: decodes like a terminal */}
        <div
          className="veil rise flex w-fit flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground"
          style={delay(0)}
        >
          <span className="flex items-center gap-2">
            <span className="blink inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            <Scrambled text={t("hero.open")} at={150} />
          </span>
          <span className="hidden text-border sm:inline">/</span>
          <Scrambled text={t("hero.location")} at={300} />
          <span className="hidden text-border sm:inline">/</span>
          <span>
            {time} <span className="text-muted-foreground/60">{t("hero.localTime")}</span>
          </span>
        </div>

        {/* Headline: phrases swap with a colour sweep, then gentle scroll parallax */}
        <div ref={headlineRef} className="will-change-transform">
          <RotatingHeadline
            phrases={t("hero.phrases", { returnObjects: true }) as string[]}
            className="font-display mt-10 max-w-[15em] text-[clamp(2.9rem,7.4vw,7rem)] font-normal leading-[1.02] tracking-[-0.025em] md:mt-14"
          />
        </div>

        {/* Intro row */}
        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
          <div className="veil rise md:col-span-7" style={delay(900)}>
            <p className="label-mono">{t("hero.subtitle")}</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("hero.description")}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#contact" className="btn-accent">
                {t("hero.talk")} <span aria-hidden>→</span>
              </a>
              <a href="#projects" className="btn-outline">
                {t("hero.viewProjects")} <span aria-hidden>↓</span>
              </a>
              <a href={cv.href} download={cv.file} className="btn-outline">
                {t("nav.download")} <span aria-hidden>↓</span>
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="label-mono link-grow hover:text-foreground"
                  >
                    {s.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Photo card: clip reveal after the headline */}
          <div className="rise md:col-span-4 md:col-start-9" style={delay(1050)}>
            <figure className="group ml-auto w-full max-w-[280px] -rotate-2 border border-border bg-card p-2 transition-transform duration-700 hover:rotate-0 md:max-w-[300px]">
              <div className="clip-reveal aspect-square overflow-hidden" style={delay(1150)}>
                <img
                  src="/mi_foto.jpeg"
                  alt="Luis Guillén Servera"
                  width={640}
                  height={640}
                  className="photo-tone h-full w-full object-cover"
                />
              </div>
              <figcaption className="hairline-t mt-2 flex items-center justify-between px-1 pt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <span>Luis Guillén Servera</span>
                <span className="text-primary">2026</span>
              </figcaption>
              <figcaption className="px-1 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                {t("hero.photoCaption")}
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Metrics count up when visible */}
        <dl
          ref={metricsRef}
          className="veil rise hairline-t mt-16 grid grid-cols-3 gap-6 pt-6 md:mt-24 md:grid-cols-4"
          style={delay(1200)}
        >
          {metrics.map((m) => (
            <Metric key={m.label} value={m.value} label={m.label} start={metricsInView} />
          ))}
          <a
            href="#about"
            className="hidden items-end justify-end gap-3 self-stretch md:flex"
            aria-label={t("hero.scroll")}
          >
            <span className="label-mono">{t("hero.scroll")}</span>
            <span className="relative block h-12 w-px overflow-hidden bg-border">
              <span className="scroll-cue absolute inset-0 bg-foreground" />
            </span>
          </a>
        </dl>
      </div>

      <div className="band rise relative z-10" style={delay(1400)}>
        <Marquee items={stack} label={t("hero.stackLabel")} />
      </div>
    </section>
  );
};

export default HeroSection;
