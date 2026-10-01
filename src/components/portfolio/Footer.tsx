import { useTranslation } from "react-i18next";
import { useLocalTime } from "@/hooks/use-local-time";

const Footer = () => {
  const { t } = useTranslation();
  const time = useLocalTime();

  return (
    <footer className="band hairline-t relative z-10">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-6 py-10 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
        <p>
          © 2026 Luis Guillén Servera <span className="mx-2 text-border">/</span> {t("footer.built")}
        </p>
        <p>
          {t("footer.localTime")} <span className="text-foreground">{time}</span>{" "}
          <span className="text-muted-foreground/60">WET</span>
        </p>
        <a href="#top" className="link-grow w-fit hover:text-foreground">
          {t("footer.backToTop")} <span aria-hidden>↑</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
