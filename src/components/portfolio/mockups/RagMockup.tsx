import { CSSProperties } from "react";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

// Archaeological sites of Gran Canaria, as a crawled heritage page would list them.
const ROWS = [
  { item: "Cueva Pintada", place: "Gáldar", hit: false },
  { item: "Cenobio de Valerón", place: "Guía", hit: true },
  { item: "Roque Bentayga", place: "Tejeda", hit: false },
  { item: "Risco Caído", place: "Artenara", hit: false },
  { item: "Cuatro Puertas", place: "Telde", hit: false },
];

const ANSWER = ["Un granero colectivo aborigen excavado", "en toba volcánica, en Santa María de", "Guía, al norte de Gran Canaria."];

const CHUNKS = [
  { id: "chunk_0412", score: 0.91 },
  { id: "chunk_0415", score: 0.84 },
  { id: "chunk_1107", score: 0.77 },
  { id: "chunk_0098", score: 0.62 },
];

/** RAG Canarias: a heritage page is scanned, the matching row is retrieved, the answer types in with citations. */
const RagMockup = () => (
  <g>
    {/* PDF page */}
    <rect x={24} y={20} width={252} height={360} rx={2} className="fill-background stroke-border" />
    <text x={40} y={44} fontSize={10} className="fill-muted-foreground">
      patrimonio_gc.html
    </text>
    <text x={260} y={44} fontSize={10} textAnchor="end" className="fill-primary">
      §3
    </text>
    {[184, 214, 150, 204, 120].map((w, i) => (
      <rect key={i} x={40} y={60 + i * 12} width={w} height={4} rx={2} className="fill-muted-foreground/25" />
    ))}

    <rect x={40} y={134} width={220} height={22} className="fill-secondary" />
    <text x={46} y={149} fontSize={9} className="fill-muted-foreground">YACIMIENTO</text>
    <text x={254} y={149} fontSize={9} textAnchor="end" className="fill-muted-foreground">MUNICIPIO</text>
    {ROWS.map((r, i) => {
      const y = 156 + i * 24;
      return (
        <g key={r.item}>
          {r.hit && (
            <g className="mk-hit" style={d(0)}>
              <rect x={40} y={y} width={220} height={24} className="fill-primary/15" />
              <rect x={40} y={y} width={2} height={24} className="fill-primary" />
            </g>
          )}
          <line x1={40} x2={260} y1={y + 24} y2={y + 24} className="stroke-border" />
          <text x={48} y={y + 16} fontSize={10} className="mk-sans fill-foreground">
            {r.item}
          </text>
          <text x={254} y={y + 16} fontSize={9.5} textAnchor="end" className="fill-muted-foreground">
            {r.place}
          </text>
        </g>
      );
    })}
    {[200, 170, 212, 140].map((w, i) => (
      <rect key={i} x={40} y={292 + i * 12} width={w} height={4} rx={2} className="fill-muted-foreground/25" />
    ))}
    <text x={150} y={366} fontSize={9} textAnchor="middle" className="fill-muted-foreground">
      — 3 —
    </text>

    {/* scan line */}
    <g className="mk-scan">
      <rect x={24} y={2} width={252} height={18} className="fill-primary/10" />
      <rect x={24} y={20} width={252} height={1.5} className="fill-primary" />
    </g>

    {/* chat */}
    <rect x={372} y={24} width={244} height={50} rx={6} className="fill-secondary" />
    <text x={386} y={45} fontSize={12} className="mk-sans fill-foreground">
      ¿Qué es el Cenobio de Valerón
    </text>
    <text x={386} y={63} fontSize={12} className="mk-sans fill-foreground">
      y dónde está?
    </text>

    <circle cx={305} cy={101} r={4} className="fill-primary" />
    <text x={316} y={105} fontSize={10} className="fill-primary">
      rag-canarias
    </text>
    <text x={616} y={105} fontSize={10} textAnchor="end" className="fill-muted-foreground">
      2.7 s
    </text>

    {ANSWER.map((line, i) => (
      <g key={line}>
        <text x={300} y={130 + i * 20} fontSize={12.5} className="mk-sans fill-foreground">
          {line}
        </text>
        <rect x={298} y={116 + i * 20} width={320} height={19} className="mk-wipe fill-card" style={d(i * 0.3)} />
      </g>
    ))}

    {["[1]", "[2]", "[3]"].map((c, i) => (
      <g key={c} className="mk-pop" style={d(i * 0.15)}>
        <rect x={300 + i * 52} y={188} width={46} height={18} rx={3} className="fill-primary/10 stroke-primary/60" />
        <text x={323 + i * 52} y={201} fontSize={10} textAnchor="middle" className="fill-primary">
          {c}
        </text>
      </g>
    ))}

    <text x={300} y={240} fontSize={10} className="fill-muted-foreground">
      top-5 · qdrant
    </text>
    {CHUNKS.map((c, i) => {
      const y = 262 + i * 22;
      return (
        <g key={c.id}>
          <text x={300} y={y} fontSize={10} className="fill-muted-foreground">
            {c.id}
          </text>
          <rect x={392} y={y - 7} width={180} height={5} rx={2.5} className="fill-muted-foreground/15" />
          <rect x={392} y={y - 7} width={180 * c.score} height={5} rx={2.5} className="mk-grow fill-primary" style={d(3.2 + i * 0.12)} />
          <text x={616} y={y} fontSize={10} textAnchor="end" className="fill-foreground">
            {c.score.toFixed(2)}
          </text>
        </g>
      );
    })}

    <line x1={300} x2={616} y1={352} y2={352} className="stroke-border" />
    <text x={300} y={374} fontSize={10} className="fill-muted-foreground">
      multilingual-e5 · qdrant
    </text>
    <text x={616} y={374} fontSize={10} textAnchor="end" className="fill-primary">
      recall@5 100%
    </text>
  </g>
);

export default RagMockup;
