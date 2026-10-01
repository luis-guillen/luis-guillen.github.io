/**
 * Adaptive quality for the tile background.
 *
 * Recruiters will open the site on anything from a mid-range laptop to a phone,
 * so the scene starts at a tier picked from device hints and then steps down on
 * its own if the device cannot keep up with the frame budget. It never steps
 * back up in the same visit, which avoids oscillating between tiers.
 */

export type TierName = "high" | "mid" | "low";

export interface Tier {
  name: TierName;
  /** Device pixel ratio cap. */
  dpr: number;
  /** MSAA samples in the post-processing chain (0 = off). */
  msaa: number;
  bloom: boolean;
  /** Travelling point lights under the tiles (the shader glow is always on). */
  glowLights: number;
  /** Frames per second while the hero is on screen, and below it. */
  fpsHero: number;
  fpsBelow: number;
  envResolution: number;
}

export const TIERS: Record<TierName, Tier> = {
  high: { name: "high", dpr: 1.5, msaa: 2, bloom: true, glowLights: 2, fpsHero: 50, fpsBelow: 24, envResolution: 256 },
  mid: { name: "mid", dpr: 1.25, msaa: 0, bloom: true, glowLights: 1, fpsHero: 40, fpsBelow: 20, envResolution: 256 },
  low: { name: "low", dpr: 1, msaa: 0, bloom: false, glowLights: 0, fpsHero: 30, fpsBelow: 15, envResolution: 128 },
};

export const LOWER: Record<TierName, TierName | null> = { high: "mid", mid: "low", low: null };

export interface DeviceHints {
  /** Viewport width in CSS px. */
  width: number;
  /** True when the only pointer is a finger (phones, most tablets). */
  coarseOnly: boolean;
  /** WebGL renderer string, e.g. "ANGLE (Apple, Apple M2, ...)" or "Apple GPU". */
  renderer: string;
  cores: number;
  /** Data Saver / Lite mode requested by the user. */
  saveData: boolean;
}

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|microsoft basic/i;
const STRONG_GPU = /apple m\d|rtx|geforce gtx 1[6-9]|radeon rx|radeon pro|arc a\d/i;

/** Starting tier from what the browser tells us about the device. */
export function initialTier(h: DeviceHints): TierName {
  if (h.saveData || SOFTWARE.test(h.renderer)) return "low";
  if (h.width < 768) return "low"; // phones: keep them cool and the battery safe
  if (h.coarseOnly) return "mid"; // tablets
  if (STRONG_GPU.test(h.renderer) && h.cores >= 8) return "high";
  return "mid";
}

/** A measurement window "misses" when the device renders clearly below the frame budget. */
export function missedBudget(achievedFps: number, budgetFps: number): boolean {
  return achievedFps < budgetFps * 0.8;
}

/** Reads the hints in the browser. The probe context is released straight away. */
export function readDeviceHints(): DeviceHints & { webgl: boolean } {
  let renderer = "";
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (gl) {
      webgl = true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      renderer = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webgl = false;
  }
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return {
    webgl,
    renderer,
    width: window.innerWidth,
    coarseOnly: window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(pointer: fine)").matches,
    cores: navigator.hardwareConcurrency || 4,
    saveData: !!nav.connection?.saveData,
  };
}
