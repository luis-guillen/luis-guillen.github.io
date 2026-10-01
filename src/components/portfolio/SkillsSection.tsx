import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import Section from "./Section";
import { STACK_GROUPS } from "./stack";

const SkillsSection = () => {
  const { t } = useTranslation();

  return (
    <Section id="skills" index="04" title={t("skills.label")}>
      <dl>
        {STACK_GROUPS.map((g, i) => (
          <div
            key={g.key}
            className="hairline-draw grid gap-2 py-6 md:grid-cols-12 md:gap-6"
            data-reveal
            style={{ "--reveal-delay": `${i * 50}ms` } as React.CSSProperties}
          >
            <dt className="label-mono md:col-span-3 md:pt-1.5">{t(g.key)}</dt>
            <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-lg leading-relaxed md:col-span-9 md:text-xl">
              {g.skills.map((s, j) => (
                <Fragment key={s}>
                  {j > 0 && (
                    <span className="text-primary" aria-hidden>
                      ·
                    </span>
                  )}
                  <span className="whitespace-nowrap">{s}</span>
                </Fragment>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
};

export default SkillsSection;
