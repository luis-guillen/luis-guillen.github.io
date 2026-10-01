import { describe, expect, it } from "vitest";
import { createBoard, SLIDE_PAUSE, SLIDE_SECONDS, stepBoard } from "@/components/portfolio/tiles/field";

const cellsAreAPermutation = (n: number, gx: Int16Array, gz: Int16Array) => {
  const seen = new Set<number>();
  for (let id = 0; id < n * n; id++) seen.add(gx[id] * n + gz[id]);
  return seen.size === n * n;
};

describe("sliding tile board", () => {
  it("alternates a row slide right with a column slide down", () => {
    const n = 5;
    const b = createBoard(n);
    const rand = () => 0.5; // always the centre line

    let t = b.nextAt;
    stepBoard(b, t, rand);
    expect(b.slide?.axis).toBe("row");
    const row = b.slide!.line;
    const tileInRow = Array.from({ length: n * n }, (_, id) => id).find((id) => b.gz[id] === row)!;
    const before = b.gx[tileInRow];

    t += SLIDE_SECONDS;
    stepBoard(b, t, rand);
    expect(b.gx[tileInRow]).toBe((before + 1) % n);
    expect(b.slide).toBeNull();

    t += SLIDE_PAUSE;
    stepBoard(b, t, rand);
    expect(b.slide?.axis).toBe("col");
  });

  it("keeps every cell occupied by exactly one tile after many slides", () => {
    const n = 7;
    const b = createBoard(n);
    let seed = 1;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let t = 0; t < 200; t += 0.1) stepBoard(b, t, rand);
    expect(cellsAreAPermutation(n, b.gx, b.gz)).toBe(true);
  });
});

describe("intro", () => {
  it("never drops a tile below the glow plane, so no bare orange sheet flashes", async () => {
    const { tilePosition, TILE_HEIGHT, INTRO_SECONDS } = await import("@/components/portfolio/tiles/field");
    const n = 7;
    const board = createBoard(n);
    const out = [0, 0, 0];
    const GLOW_PLANE_Y = -0.24; // Underglow mesh position
    for (let intro = 0; intro <= INTRO_SECONDS + 1; intro += 0.05) {
      const s = { t: intro, intro, pan: 0, board, cursor: { x: 0, z: 0, strength: 0 } };
      for (let id = 0; id < n * n; id++) {
        tilePosition(id, s, out);
        expect(out[1] - TILE_HEIGHT / 2).toBeGreaterThan(GLOW_PLANE_Y);
      }
    }
  });
});
