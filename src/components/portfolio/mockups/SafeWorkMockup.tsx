import { CSSProperties } from "react";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

// Chain-of-custody events for one case file; each entry is hash-linked to the previous one.
const CUSTODY = [
  { event: "Denuncia recibida", time: "09:14", hash: "a3f9…c21e" },
  { event: "Acuse de recibo", time: "09:15", hash: "7b0d…94af" },
  { event: "Asignada a instructor", time: "10:02", hash: "e51c…0b7d" },
  { event: "Evidencia añadida", time: "11:40", hash: "29aa…f3c8" },
  { event: "Informe generado", time: "12:05", hash: "c8e4…6d12" },
];

const ANSWER = ["En un máximo de 7 días naturales desde", "la recepción, salvo que ponga en riesgo", "la confidencialidad de la comunicación."];

const CITATIONS = ["art. 9", "Ley 2/2023"];

const PROVIDERS = [
  { name: "claude", role: "activo", active: true },
  { name: "groq · qwen", role: "respaldo", active: false },
  { name: "ollama · qwen-4b", role: "local", active: false },
];

/** SafeWork AI: an end-to-end encrypted case file with its custody log, and the assistant answering with citations. */
const SafeWorkMockup = () => (
  <g>
    {/* Case file */}
    <rect x={24} y={20} width={252} height={360} rx={2} className="fill-background stroke-border" />
    <text x={40} y={44} fontSize={10} className="fill-muted-foreground">
      expediente SW-0142
    </text>
    <text x={260} y={44} fontSize={10} textAnchor="end" className="fill-primary">
      cifrado
    </text>
    <rect x={40} y={56} width={220} height={38} rx={3} className="fill-primary/10 stroke-primary/40" />
    <text x={52} y={72} fontSize={9} className="fill-muted-foreground">
      CIFRADO EN EL NAVEGADOR
    </text>
    <text x={52} y={86} fontSize={10} className="fill-foreground">
      RSA-OAEP-3072 + AES-256-GCM
    </text>

    <text x={40} y={118} fontSize={9} className="fill-muted-foreground">
      CADENA DE CUSTODIA
    </text>
    <line x1={47} x2={47} y1={134} y2={134 + (CUSTODY.length - 1) * 46} className="stroke-border" />
    {CUSTODY.map((c, i) => {
      const y = 134 + i * 46;
      const last = i === CUSTODY.length - 1;
      return (
        <g key={c.event} className="mk-row" style={d(i * 0.35)}>
          <circle cx={47} cy={y} r={4} className={last ? "fill-primary" : "fill-card stroke-foreground/50"} />
          <text x={60} y={y + 4} fontSize={10.5} className="mk-sans fill-foreground">
            {c.event}
          </text>
          <text x={260} y={y + 4} fontSize={9.5} textAnchor="end" className="fill-muted-foreground">
            {c.time}
          </text>
          <text x={60} y={y + 19} fontSize={9} className="fill-muted-foreground/80">
            sha256 {c.hash}
          </text>
        </g>
      );
    })}

    {/* Assistant */}
    <rect x={372} y={24} width={244} height={50} rx={6} className="fill-secondary" />
    <text x={386} y={45} fontSize={12} className="mk-sans fill-foreground">
      ¿En qué plazo hay que
    </text>
    <text x={386} y={63} fontSize={12} className="mk-sans fill-foreground">
      acusar recibo de una denuncia?
    </text>

    <circle cx={305} cy={101} r={4} className="fill-primary" />
    <text x={316} y={105} fontSize={10} className="fill-primary">
      safework-ai
    </text>
    <text x={616} y={105} fontSize={10} textAnchor="end" className="fill-muted-foreground">
      guardrails ✓
    </text>

    {ANSWER.map((line, i) => (
      <g key={line}>
        <text x={300} y={130 + i * 20} fontSize={12.5} className="mk-sans fill-foreground">
          {line}
        </text>
        <rect x={298} y={116 + i * 20} width={320} height={19} className="mk-wipe fill-card" style={d(i * 0.3)} />
      </g>
    ))}

    {CITATIONS.map((c, i) => {
      const x = 300 + CITATIONS.slice(0, i).reduce((acc, prev) => acc + prev.length * 6.2 + 22, 0);
      const w = c.length * 6.2 + 16;
      return (
        <g key={c} className="mk-pop" style={d(i * 0.15)}>
          <rect x={x} y={188} width={w} height={18} rx={3} className="fill-primary/10 stroke-primary/60" />
          <text x={x + w / 2} y={201} fontSize={10} textAnchor="middle" className="fill-primary">
            {c}
          </text>
        </g>
      );
    })}

    <text x={300} y={240} fontSize={10} className="fill-muted-foreground">
      proveedor de LLM
    </text>
    {PROVIDERS.map((p, i) => {
      const y = 262 + i * 26;
      return (
        <g key={p.name}>
          <rect
            x={300}
            y={y - 14}
            width={316}
            height={22}
            rx={3}
            className={p.active ? "fill-primary/10 stroke-primary/50" : "fill-secondary/60"}
          />
          <circle cx={312} cy={y - 3} r={3} className={p.active ? "mk-pulse fill-primary" : "fill-muted-foreground/40"} />
          <text x={324} y={y + 1} fontSize={10.5} className={p.active ? "fill-foreground" : "fill-muted-foreground"}>
            {p.name}
          </text>
          <text x={608} y={y + 1} fontSize={9.5} textAnchor="end" className={p.active ? "fill-primary" : "fill-muted-foreground"}>
            {p.role}
          </text>
        </g>
      );
    })}

    <line x1={300} x2={616} y1={352} y2={352} className="stroke-border" />
    <text x={300} y={374} fontSize={10} className="fill-muted-foreground">
      rag híbrido · bm25 + denso
    </text>
    <text x={616} y={374} fontSize={10} textAnchor="end" className="fill-primary">
      golden set · 22 escenarios
    </text>
  </g>
);

export default SafeWorkMockup;
