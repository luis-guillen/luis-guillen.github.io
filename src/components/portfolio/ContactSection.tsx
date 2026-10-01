import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import Section from "./Section";
import SplitReveal from "./SplitReveal";

const EMAIL = "guillenserveraluis@gmail.com";

const ELSEWHERE = [
  { label: "GitHub", handle: "github.com/luis-guillen", href: "https://github.com/luis-guillen" },
  { label: "LinkedIn", handle: "in/luis-guillen-servera", href: "https://www.linkedin.com/in/luis-guillen-servera/" },
];

const ContactSection = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  /** No backend: build a mailto: URL so the visitor's own client sends the message. */
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio — ${form.name || "Hello"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ""}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <Section id="contact" index="07" title={t("contact.label")}>
      <SplitReveal as="h3" lines={t("contact.title")} step={80} className="display text-5xl md:text-7xl" />
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground" data-reveal>
        {t("contact.desc")}
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6" data-reveal>
          <span className="label-mono">{t("contact.direct")}</span>
          <a href={`mailto:${EMAIL}`} className="link-grow mt-3 block w-fit text-xl [overflow-wrap:anywhere] md:text-2xl xl:text-3xl">
            {EMAIL}
          </a>

          <span className="label-mono mt-12 block">{t("contact.elsewhere")}</span>
          <ul className="mt-3">
            {ELSEWHERE.map((s) => (
              <li key={s.label} className="hairline-t flex items-baseline justify-between py-4">
                <a href={s.href} target="_blank" rel="noreferrer" className="link-grow text-lg">
                  {s.label} <span aria-hidden>↗</span>
                </a>
                <span className="font-mono text-xs text-muted-foreground">{s.handle}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-5 lg:col-start-8" data-reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="label-mono">{t("contact.form.name")}</span>
              <input
                className="field mt-1"
                type="text"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="label-mono">{t("contact.form.email")}</span>
              <input
                className="field mt-1"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
          </div>
          <label className="mt-6 block">
            <span className="label-mono">{t("contact.form.message")}</span>
            <textarea
              className="field mt-1 resize-none"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </label>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button type="submit" className="btn-solid">
              {t("contact.form.submit")} <span aria-hidden>→</span>
            </button>
            <span className="font-mono text-[11px] text-muted-foreground">{t("contact.hint")}</span>
          </div>
        </form>
      </div>
    </Section>
  );
};

export default ContactSection;
