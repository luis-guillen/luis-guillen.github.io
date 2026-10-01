import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cvFor } from "@/lib/cv";

const NAV = [
  { key: "about", id: "about" },
  { key: "experience", id: "experience" },
  { key: "projects", id: "projects" },
  { key: "skills", id: "skills" },
  { key: "education", id: "credentials" },
  { key: "contact", id: "contact" },
] as const;

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const cv = cvFor(i18n.language);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : true
  );

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  const toggleLanguage = () => {
    const next = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("app_lang", next);
    document.documentElement.lang = next;
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      for (const item of [...NAV].reverse()) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActive(item.id);
          return;
        }
      }
      setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? "band hairline-b" : "bg-background/40 backdrop-blur-[6px]"
        }`}
      >
      <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-baseline gap-3 whitespace-nowrap">
          <span className="text-base font-medium tracking-tight">Luis Guillén</span>
          <span className="label-mono hidden xl:inline">ML Engineer</span>
        </a>

        <ul className="hidden items-center gap-6 xl:flex">
          {NAV.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`label-mono link-grow whitespace-nowrap transition-colors ${
                  active === item.id ? "text-foreground" : "hover:text-foreground"
                }`}
              >
                <span className="mr-1.5 text-primary">0{i + 1}</span>
                {t(`nav.${item.key}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLanguage}
            className="label-mono h-9 px-2 transition-colors hover:text-foreground"
            aria-label="Toggle language"
          >
            {i18n.language === "en" ? "ES" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href={cv.href}
            download={cv.file}
            className="btn-outline hidden !py-2 !px-4 !text-xs font-mono uppercase tracking-[0.12em] sm:inline-flex"
          >
            {t("nav.cv")} <span aria-hidden>↓</span>
          </a>
          <button
            className="label-mono h-9 px-2 text-foreground xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t("nav.close") : t("nav.menu")}
          >
            {open ? t("nav.close") : t("nav.menu")}
          </button>
        </div>
      </nav>
      </header>

      {/* Mobile menu lives outside <header>: backdrop-filter would otherwise trap position:fixed. */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-background xl:hidden">
          <ul className="mx-auto w-full max-w-page flex-1 px-6 pt-8">
            {NAV.map((item, i) => (
              <li key={item.id} className="hairline-b">
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-5"
                >
                  <span className="font-mono text-xs text-primary">0{i + 1}</span>
                  <span className="display text-4xl">{t(`nav.${item.key}`)}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mx-auto w-full max-w-page px-6 pb-10">
            <a href={cv.href} download={cv.file} className="btn-solid w-full justify-center">
              {t("nav.download")} <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
