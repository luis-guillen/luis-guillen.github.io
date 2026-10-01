import { useTranslation } from "react-i18next";
import Section from "./Section";

const CERTS = [
  { key: "c1", issuer: "Databricks", year: "2025" },
  { key: "c2", issuer: "Amazon Web Services", year: "2025" },
  { key: "c3", issuer: "Cambridge English", year: "2024" },
];

const CredentialsSection = () => {
  const { t } = useTranslation();

  const education = [
    {
      degree: t("education.items.e1_degree"),
      school: t("education.items.e1_school"),
      period: t("education.items.e1_period"),
      coursework: t("education.items.e1_coursework"),
      thesis: t("education.items.e1_thesis"),
    },
    {
      degree: t("education.items.e2_degree"),
      school: t("education.items.e2_school"),
      period: t("education.items.e2_period"),
      coursework: t("education.items.e2_coursework"),
      thesis: t("education.items.e2_thesis"),
    },
    {
      degree: t("education.items.e3_degree"),
      school: t("education.items.e3_school"),
      period: t("education.items.e3_period"),
      coursework: "",
      thesis: "",
    },
  ];

  return (
    <Section id="credentials" index="05" title={t("education.credentials")}>
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="label-mono" data-reveal>{t("education.label")}</span>
          <ol className="mt-5">
            {education.map((e, i) => (
              <li
                key={e.degree}
                className="hairline-draw py-7"
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">{e.period}</p>
                <h3 className="mt-3 text-2xl md:text-3xl">{e.degree}</h3>
                <p className="mt-1 text-muted-foreground">{e.school}</p>
                {e.thesis && (
                  <div className="mt-5">
                    <span className="label-mono">{t("education.thesis")}</span>
                    <p className="font-serif mt-1.5 text-xl italic leading-snug">{e.thesis}</p>
                  </div>
                )}
                {e.coursework && (
                  <div className="mt-4">
                    <span className="label-mono">{t("education.coursework")}</span>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{e.coursework}</p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5">
          <span className="label-mono" data-reveal>{t("certifications.label")}</span>
          <ol className="mt-5">
            {CERTS.map((c, i) => (
              <li
                key={c.key}
                className="hairline-draw flex items-baseline justify-between gap-6 py-5"
                data-reveal
                style={{ "--reveal-delay": `${i * 50}ms` } as React.CSSProperties}
              >
                <p className="leading-snug">{t(`certifications.${c.key}`)}</p>
                <p className="shrink-0 text-right font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  {c.issuer}
                  <br />
                  <span className="text-primary">{c.year}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
};

export default CredentialsSection;
