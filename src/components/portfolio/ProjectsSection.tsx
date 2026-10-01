import { ComponentType, CSSProperties, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Section from "./Section";
import SplitReveal from "./SplitReveal";
import Frame from "./mockups/Frame";
import RagMockup from "./mockups/RagMockup";
import DispatchMockup from "./mockups/DispatchMockup";
import SafeWorkMockup from "./mockups/SafeWorkMockup";
import { ScheduleThumb, SearchThumb, SensorsThumb } from "./mockups/MiniThumbs";

interface Featured {
  key: string;
  tags: string[];
  github?: string;
  demo?: string;
  caseStudy?: string;
  window: string;
  Mockup: ComponentType;
  /** Drop a real screenshot in public/projects/ and set it here to replace the mockup. */
  screenshot?: string;
}

const FEATURED: Featured[] = [
  {
    key: "p1",
    tags: ["Python", "FastAPI", "Qdrant", "E5 embeddings", "Ollama"],
    github: "https://github.com/luis-guillen/rag_can_python",
    window: "rag-canarias — query.py",
    Mockup: RagMockup,
  },
  {
    key: "p2",
    tags: ["PPO", "Stable-Baselines3", "MLflow", "FastAPI", "PostGIS", "Terraform"],
    github: "https://github.com/luis-guillen/city2cruise",
    window: "city2cruise — dispatch",
    Mockup: DispatchMockup,
  },
  {
    key: "p3",
    tags: ["Claude", "Groq", "Ollama", "Hybrid RAG", "QLoRA + DPO", "Next.js"],
    window: "safework-ai — expediente",
    Mockup: SafeWorkMockup,
  },
];

const MORE = [
  { key: "p4", tags: ["FastAPI", "PostgreSQL RLS", "nmap", "React"], Thumb: SensorsThumb },
  { key: "p5", tags: ["TypeScript", "Prisma", "PostgreSQL", "React"], Thumb: ScheduleThumb },
  { key: "p6", tags: ["Python", "Java", "Inverted index"], Thumb: SearchThumb },
];

const isReal = (href?: string) => !!href && href !== "#";
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Moves the element up to ±amount px depending on where it sits in the viewport. */
function useParallax<T extends HTMLElement>(amount = 24) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      el.style.transform = `translate3d(0, ${Math.max(-1, Math.min(1, p)) * amount}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [amount]);
  return ref;
}

const FeaturedProject = ({ p, i }: { p: Featured; i: number }) => {
  const { t } = useTranslation();
  const parallax = useParallax<HTMLDivElement>(22);
  const flip = i % 2 === 1;
  const links = [
    { label: t("projects.code"), href: p.github },
    { label: t("projects.demo"), href: p.demo },
    { label: t("projects.caseStudy"), href: p.caseStudy },
  ].filter((l) => isReal(l.href));

  return (
    <article
      className="group hairline-draw grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-10"
      data-reveal
      style={{ "--reveal-delay": `${i * 60}ms` } as CSSProperties}
    >
      <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
        <span className="font-mono text-xs text-primary">0{i + 1}</span>
        <SplitReveal
          as="h3"
          lines={t(`projects.${p.key}.title`)}
          step={50}
          className="display mt-4 text-3xl transition-colors duration-300 group-hover:text-primary md:text-4xl xl:text-5xl"
        />
        <p className="font-serif mt-5 text-xl italic leading-snug text-muted-foreground md:text-2xl">
          {t(`projects.${p.key}.problem`)}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{t(`projects.${p.key}.description`)}</p>
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          {p.tags.map((tag) => (
            <li key={tag} className="label-mono">
              {tag}
            </li>
          ))}
        </ul>
        <div className="hairline-t mt-8 flex flex-wrap items-end justify-between gap-6 pt-5">
          <div>
            <span className="label-mono">{t("projects.impact")}</span>
            <p className="display mt-2 text-2xl [text-wrap:balance] md:text-3xl">{t(`projects.${p.key}.impact`)}</p>
          </div>
          {links.length > 0 && (
            <ul className="flex gap-6">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="label-mono link-grow text-foreground">
                    {l.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
        <div ref={parallax} className="will-change-transform">
          <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
            <Frame
              title={p.window}
              status={t(`projects.${p.key}.status`)}
              label={t(`projects.mockups.${p.key}`)}
              src={p.screenshot}
            >
              <p.Mockup />
            </Frame>
          </div>
        </div>
      </div>
    </article>
  );
};

/** Hover preview that follows the cursor over the "More work" rows (fine pointers only). */
function useCursorPreview() {
  const [canHover, setCanHover] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [shown, setShown] = useState<string>(MORE[0].key);
  const el = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, placed: false });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!active) return;
    const smooth = !reducedMotion();
    let raf = 0;
    const loop = () => {
      const p = pos.current;
      const k = smooth ? 0.16 : 1;
      p.x += (p.tx - p.x) * k;
      p.y += (p.ty - p.y) * k;
      const node = el.current;
      if (node) {
        const flipLeft = p.x > window.innerWidth - node.offsetWidth - 48;
        const dx = flipLeft ? "calc(-100% - 28px)" : "28px";
        node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(${dx}, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const bind = (key: string) =>
    canHover
      ? {
          onPointerEnter: (e: ReactPointerEvent) => {
            const p = pos.current;
            p.tx = e.clientX;
            p.ty = e.clientY;
            if (!p.placed) {
              p.x = p.tx;
              p.y = p.ty;
              p.placed = true;
            }
            setActive(key);
            setShown(key);
          },
          onPointerMove: (e: ReactPointerEvent) => {
            pos.current.tx = e.clientX;
            pos.current.ty = e.clientY;
          },
          onPointerLeave: () => setActive(null),
        }
      : {};

  return { canHover, active, shown, el, bind };
}

const ProjectsSection = () => {
  const { t } = useTranslation();
  const { canHover, active, shown, el, bind } = useCursorPreview();
  const ShownThumb = MORE.find((m) => m.key === shown)!.Thumb;

  return (
    <Section id="projects" index="03" title={t("projects.label")}>
      <div>
        {FEATURED.map((p, i) => (
          <FeaturedProject key={p.key} p={p} i={i} />
        ))}
      </div>

      <div className="mt-16">
        <span className="label-mono" data-reveal>
          {t("projects.more")}
        </span>
        <ol className="mt-5">
          {MORE.map((p, i) => (
            <li
              key={p.key}
              {...bind(p.key)}
              className={`group hairline-draw grid gap-3 py-6 transition-colors md:grid-cols-12 md:items-baseline md:gap-6 ${
                canHover ? "cursor-default" : ""
              }`}
              data-reveal
              style={{ "--reveal-delay": `${i * 60}ms` } as CSSProperties}
            >
              <span className="font-mono text-xs text-primary md:col-span-1">0{FEATURED.length + i + 1}</span>
              <h3 className="text-xl transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary md:col-span-5">
                {t(`projects.${p.key}.title`)}
              </h3>
              <p className="label-mono md:col-span-3">{p.tags.join(" · ")}</p>
              <p className="font-mono text-sm md:col-span-3 md:text-right">{t(`projects.${p.key}.impact`)}</p>
              {!canHover && (
                <div className="mt-2 max-w-[240px] md:col-span-12">
                  <p.Thumb label={t(`projects.mockups.${p.key}`)} />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      {canHover && (
        <div ref={el} aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 w-[300px]">
          <div
            className={`shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-300 ease-out ${
              active ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <ShownThumb label={t("projects.preview")} />
          </div>
        </div>
      )}
    </Section>
  );
};

export default ProjectsSection;
