import * as THREE from "three";

export interface TileLabel {
  lines: string[];
  /** Grid offset from the field centre, in tiles. */
  di: number;
  dj: number;
  /** Rotation of the text on the tile face, in radians. */
  rotation: number;
}

export const LABELS: TileLabel[] = [
  { lines: ["LLMS", "AGENTS", "RAG"], di: 0, dj: -1, rotation: 0 },
  { lines: ["DATA", "PIPELINES", "INFRASTRUCTURE"], di: 2, dj: 0, rotation: Math.PI / 2 },
  { lines: ["SCALABLE", "SOLUTIONS", "REAL IMPACT"], di: 0, dj: 1, rotation: 0 },
  { lines: ["MLOPS", "EVALS", "PRODUCTION"], di: -2, dj: 0, rotation: Math.PI / 2 },
];

const SIZE = 512;
const FONT_PX = 34;
const TRACKING = 11; // extra px between letters, like the reference engraving
const LINE_HEIGHT = 58;

function drawTracked(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, w) => a + w, 0) + TRACKING * (text.length - 1);
  let x = cx - total / 2;
  [...text].forEach((ch, i) => {
    ctx.fillText(ch, x, y);
    x += widths[i] + TRACKING;
  });
}

/** Renders a label into a transparent canvas texture (white glyphs; tinted by the material). */
export async function makeLabelTexture(lines: string[]): Promise<THREE.CanvasTexture> {
  const font = `500 ${FONT_PX}px 'Instrument Sans', system-ui, sans-serif`;
  try {
    await document.fonts.load(font);
  } catch {
    /* fall back to the system font */
  }
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  const top = SIZE / 2 - ((lines.length - 1) * LINE_HEIGHT) / 2;
  lines.forEach((line, i) => drawTracked(ctx, line, SIZE / 2, top + i * LINE_HEIGHT));

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
