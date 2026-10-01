import { RefObject, useEffect, useRef, useState } from "react";

interface Options {
  /** Stop observing after the first time the element becomes visible. */
  once?: boolean;
  rootMargin?: string;
}

/**
 * Tracks whether an element is on screen. Uses IntersectionObserver with a
 * scroll/resize bounds-check fallback for environments that throttle it.
 */
export function useInView<T extends Element>({ once = false, rootMargin = "0px" }: Options = {}): [
  RefObject<T>,
  boolean,
] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    let done = false;
    const update = (visible: boolean) => {
      if (done) return;
      setInView(visible);
      if (visible && once) {
        done = true;
        cleanup();
      }
    };

    const io = new IntersectionObserver(([entry]) => update(entry.isIntersecting), { rootMargin });
    io.observe(el);

    const check = () => {
      const r = el.getBoundingClientRect();
      update(r.top < window.innerHeight && r.bottom > 0);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    function cleanup() {
      io.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    }
    return cleanup;
  }, [once, rootMargin]);

  return [ref, inView];
}
