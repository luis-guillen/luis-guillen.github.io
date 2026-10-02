/**
 * Shared, allocation-free maths for the tile field so the grid and the
 * lights all agree on where each tile is at a given time.
 *
 * The field behaves like a sliding-tile board: every few seconds one whole row
 * slides one cell to the right, then one whole column slides one cell down,
 * alternating. Tiles that leave one edge re-enter on the opposite edge.
 */

export const TILE = 1;
export const GAP = 0.12;
export const PITCH = TILE + GAP;
export const TILE_HEIGHT = 0.28;
export const INTRO_SECONDS = 2.2;

/** Seconds a slide takes, and the pause before the next one. */
export const SLIDE_SECONDS = 1.15;
export const SLIDE_PAUSE = 0.55;
/** How high a tile rises while it slides, so light leaks under it. */
const SLIDE_LIFT = 0.1;

export const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const wrap = (v: number, span: number) => ((((v + span / 2) % span) + span) % span) - span / 2;
const mod = (v: number, n: number) => ((v % n) + n) % n;

export type SlideAxis = "row" | "col";

export interface Slide {
  axis: SlideAxis;
  /** Row index (for "row") or column index (for "col") being moved. */
  line: number;
  /** Field time the slide started. */
  start: number;
}

export interface Board {
  n: number;
  /** Current logical cell of each tile, indexed by tile id = i * n + j. */
  gx: Int16Array;
  gz: Int16Array;
  slide: Slide | null;
  nextAt: number;
  nextAxis: SlideAxis;
}

export function createBoard(n: number): Board {
  const gx = new Int16Array(n * n);
  const gz = new Int16Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      gx[i * n + j] = i;
      gz[i * n + j] = j;
    }
  }
  return { n, gx, gz, slide: null, nextAt: INTRO_SECONDS + 0.4, nextAxis: "row" };
}

/** Picks a line near the centre of the board so the motion is seen, not lost at the edges. */
function pickLine(n: number, rand: () => number): number {
  const c = Math.floor(n / 2);
  return mod(c + Math.round((rand() - 0.5) * 6), n);
}

/** Advances the slide scheduler. Commits finished slides and starts the next one. */
export function stepBoard(b: Board, t: number, rand: () => number = Math.random): void {
  const { n, gx, gz } = b;
  if (b.slide && t - b.slide.start >= SLIDE_SECONDS) {
    const { axis, line } = b.slide;
    for (let id = 0; id < n * n; id++) {
      if (axis === "row" && gz[id] === line) gx[id] = mod(gx[id] + 1, n);
      if (axis === "col" && gx[id] === line) gz[id] = mod(gz[id] + 1, n);
    }
    b.slide = null;
    b.nextAt = t + SLIDE_PAUSE;
  }
  if (!b.slide && t >= b.nextAt) {
    b.slide = { axis: b.nextAxis, line: pickLine(n, rand), start: t };
    b.nextAxis = b.nextAxis === "row" ? "col" : "row";
  }
}

export interface FieldState {
  /** Seconds of idle animation (frozen at 0 under reduced motion). */
  t: number;
  /** Seconds since the intro started. */
  intro: number;
  /** Pan along the board's X axis, in world units (driven by scroll). */
  pan: number;
  board: Board;
  /** Cursor hit point on the board in local XZ, and how strongly it is lighting (0..1). */
  cursor: { x: number; z: number; strength: number };
}

/** Local-space position of tile `id`. Writes into `out` = [x, y, z]. */
export function tilePosition(id: number, s: FieldState, out: number[]): void {
  const b = s.board;
  const n = b.n;
  const span = n * PITCH;
  const i0 = Math.floor(id / n);
  const j0 = id % n;

  let ox = 0;
  let oz = 0;
  let lift = 0;
  const sl = b.slide;
  if (sl) {
    const p = Math.min(Math.max((s.t - sl.start) / SLIDE_SECONDS, 0), 1);
    const moving = (sl.axis === "row" && b.gz[id] === sl.line) || (sl.axis === "col" && b.gx[id] === sl.line);
    if (moving) {
      const e = easeInOutCubic(p);
      if (sl.axis === "row") ox = e;
      else oz = e;
      lift = Math.sin(Math.PI * p) * SLIDE_LIFT;
    }
  }

  const x = wrap((b.gx[id] + ox - n / 2 + 0.5) * PITCH + s.pan, span);
  const z = wrap((b.gz[id] + oz - n / 2 + 0.5) * PITCH, span);

  // Intro: tiles settle down into place in a diagonal wave (by original cell).
  // They come from above, never from below, so they never pass under the glow
  // plane (which would flash a bare orange sheet before the tiles appear).
  const delay = ((i0 + j0) / (2 * n)) * 1.0;
  const k = Math.min(Math.max((s.intro - delay) / 1.2, 0), 1);
  const introY = (1 - easeOutExpo(k)) * 1.3;

  // A very gentle breathing wave keeps the surface alive between slides.
  const wave = 0.025 * Math.sin(s.t * 0.5 + x * 0.55 + z * 0.4);

  out[0] = x;
  out[1] = introY + wave + lift;
  out[2] = z;
}
