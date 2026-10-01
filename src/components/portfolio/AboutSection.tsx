import { useTranslation } from "react-i18next";
import Section from "./Section";
import SplitReveal from "./SplitReveal";
import PipelineDiagram from "./PipelineDiagram";

const AboutSection = () => {
  const { t } = useTranslation();

  const capabilities = [1, 2, 3, 4].map((n) => ({
    title: t(`about.cards.c${n}_title`),
    desc: t(`about.cards.c${n}_desc`),
  }));

  return (
    <Section id="about" index="01" title={t("about.label")}>
      <SplitReveal
        as="p"
        lines={t("about.title")}
        step={45}
        className="font-serif max-w-3xl text-4xl leading-[1.02] md:text-6xl"
      />

      <div className="mt-10 grid gap-8 text-lg leading-relaxed text-muted-foreground md:grid-cols-2" data-reveal>
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
      </div>

      <PipelineDiagram />

      <div className="mt-16">
        <span className="label-mono" data-reveal>{t("about.capabilities")}</span>
        <ol className="mt-5">
          {capabilities.map((c, i) => (
            <li
              key={c.title}
              className="hairline-draw grid gap-3 py-7 md:grid-cols-12 md:gap-6"
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            >
              <span className="font-mono text-xs text-primary md:col-span-1">0{i + 1}</span>
              <h3 className="text-xl md:col-span-4 md:text-2xl">{c.title}</h3>
              <p className="leading-relaxed text-muted-foreground md:col-span-7">{c.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
};

export default AboutSection;
