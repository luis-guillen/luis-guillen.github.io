import { useTranslation } from "react-i18next";
import Section from "./Section";

const LABELS = {
  en: { award: "Award", publication: "Publication", languages: "Languages", debate: "Debate" },
  es: { award: "Premio", publication: "Publicación", languages: "Idiomas", debate: "Debate" },
} as const;

const KEYS = ["award", "publication", "languages", "debate"] as const;

const AchievementsSection = () => {
  const { t, i18n } = useTranslation();
  const labels = i18n.language === "es" ? LABELS.es : LABELS.en;

  return (
    <Section id="highlights" index="06" title={t("achievements.label")}>
      <dl>
        {KEYS.map((k, i) => (
          <div
            key={k}
            className="hairline-draw grid gap-2 py-6 md:grid-cols-12 md:gap-6"
            data-reveal
            style={{ "--reveal-delay": `${i * 50}ms` } as React.CSSProperties}
          >
            <dt className="label-mono md:col-span-3 md:pt-1.5">{labels[k]}</dt>
            <dd className="text-lg leading-relaxed md:col-span-9 md:text-xl">{t(`achievements.items.${k}`)}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
};

export default AchievementsSection;
