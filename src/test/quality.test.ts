import { describe, expect, it } from "vitest";
import { initialTier, missedBudget, LOWER, TIERS, type DeviceHints } from "@/components/portfolio/tiles/quality";

const laptop = (renderer: string, extra: Partial<DeviceHints> = {}): DeviceHints => ({
  width: 1440,
  coarseOnly: false,
  renderer,
  cores: 8,
  saveData: false,
  ...extra,
});

describe("initialTier", () => {
  it("gives Apple Silicon and discrete GPUs the high tier", () => {
    expect(initialTier(laptop("ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)"))).toBe("high");
    expect(initialTier(laptop("ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)"))).toBe("high");
  });

  it("keeps integrated graphics and unknown GPUs on the balanced tier", () => {
    expect(initialTier(laptop("ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11)"))).toBe("mid");
    expect(initialTier(laptop(""))).toBe("mid");
    expect(initialTier(laptop("Apple M1", { cores: 4 }))).toBe("mid");
  });

  it("uses the light tier for phones, software rendering and Data Saver", () => {
    expect(initialTier(laptop("Apple GPU", { width: 390, coarseOnly: true }))).toBe("low");
    expect(initialTier(laptop("Google SwiftShader"))).toBe("low");
    expect(initialTier(laptop("Apple M3", { saveData: true }))).toBe("low");
  });

  it("caps touch-only tablets at the balanced tier", () => {
    expect(initialTier(laptop("Apple GPU", { width: 1024, coarseOnly: true }))).toBe("mid");
  });
});

describe("adaptive downgrade", () => {
  it("flags a window only when clearly under budget", () => {
    expect(missedBudget(40, 40)).toBe(false);
    expect(missedBudget(33, 40)).toBe(false);
    expect(missedBudget(30, 40)).toBe(true);
  });

  it("steps high -> mid -> low and stops", () => {
    expect(LOWER.high).toBe("mid");
    expect(LOWER.mid).toBe("low");
    expect(LOWER.low).toBeNull();
    expect(TIERS.low.bloom).toBe(false);
  });
});
