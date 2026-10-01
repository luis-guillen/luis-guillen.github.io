import { useTranslation } from "react-i18next";
import Section from "./Section";

interface ExpItem {
  role: string;
  company: string;
  period: string;
  type: string;
  bullets: string[];
}

const ExperienceSection = () => {
  const { t } = useTranslation();
  const items = t("experience.items", { returnObjects: true }) as ExpItem[];

  return (
    <Section id="experience" index="02" title={t("experience.label")}>
      <ol>
        {Array.isArray(items) &&
          items.map((exp, i) => (
            <li
              key={`${exp.company}-${exp.period}`}
              className="group hairline-draw grid gap-4 py-9 md:grid-cols-12 md:gap-6"
              data-reveal
              style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
            >
              <div className="md:col-span-3">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-foreground">{exp.period}</p>
                <p className="label-mono mt-1.5">{exp.type}</p>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-xl transition-colors duration-300 group-hover:text-primary md:text-2xl">
                  {exp.role}
                </h3>
                <p className="mt-1 text-muted-foreground">{exp.company}</p>
              </div>
              <ul className="space-y-3 md:col-span-5">
                {exp.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                    <span className="mt-[0.7em] h-px w-3 shrink-0 bg-primary" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ol>
    </Section>
  );
};

export default ExperienceSection;
