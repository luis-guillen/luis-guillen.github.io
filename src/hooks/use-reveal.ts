import { useEffect } from "react";

const SELECTOR = "[data-reveal]";

/**
 * Adds the `in-view` class to every `[data-reveal]` element once it enters the
 * viewport. CSS in index.css handles the transition. Uses IntersectionObserver,
 * with a cheap scroll/resize fallback for environments that throttle it, and
 * re-observes elements added later (language switch re-renders).
 */
export function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = () => Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

    if (reduce || !("IntersectionObserver" in window)) {
      targets().forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    const observeAll = () =>
      targets().forEach((el) => !el.classList.contains("in-view") && io.observe(el));

    // Fallback: manual bounds check, only for elements still hidden.
    const revealVisible = () => {
      const limit = window.innerHeight * 0.92;
      for (const el of targets()) {
        if (el.classList.contains("in-view")) continue;
        const r = el.getBoundingClientRect();
        if (r.top < limit && r.bottom > 0) {
          el.classList.add("in-view");
          io.unobserve(el);
        }
      }
    };

    observeAll();
    revealVisible();

    const mo = new MutationObserver(() => {
      observeAll();
      revealVisible();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", revealVisible, { passive: true });
    window.addEventListener("resize", revealVisible);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", revealVisible);
      window.removeEventListener("resize", revealVisible);
    };
  }, []);
}
