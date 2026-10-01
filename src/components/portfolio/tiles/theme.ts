import { useEffect, useState } from "react";
import * as THREE from "three";

/** Reads a shadcn-style "H S% L%" CSS variable from :root as a THREE.Color. */
export function cssColor(variable: string, lightnessShift = 0, fallback = "#ff6a2a"): THREE.Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  const [h, s, l] = raw.split(/\s+/).map((v) => parseFloat(v));
  if ([h, s, l].some(Number.isNaN)) return new THREE.Color(fallback);
  const light = Math.max(0, Math.min(100, l + lightnessShift));
  return new THREE.Color(`hsl(${h}, ${s}%, ${light}%)`);
}

export interface TileTheme {
  dark: boolean;
  background: THREE.Color;
  accent: THREE.Color;
  hot: THREE.Color;
  tile: THREE.Color;
  label: THREE.Color;
}

function readTheme(): TileTheme {
  const dark = document.documentElement.classList.contains("dark");
  return {
    dark,
    background: cssColor("--background", 0, dark ? "#0e0c0a" : "#f4f1ec"),
    accent: cssColor("--primary"),
    hot: cssColor("--primary", 12),
    // Near-black warm slate in dark mode, warm ceramic in light mode.
    tile: new THREE.Color(dark ? "#1a1612" : "#e6ded2"),
    label: new THREE.Color(dark ? "#f3ebe0" : "#3b2f25"),
  };
}

/** Theme colours for the scene, refreshed when the `dark` class on <html> toggles. */
export function useTileTheme(): TileTheme {
  const [theme, setTheme] = useState(readTheme);
  useEffect(() => {
    const mo = new MutationObserver(() => setTheme(readTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return theme;
}
