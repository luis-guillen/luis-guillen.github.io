import { CSSProperties, ReactNode } from "react";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const Mini = ({ label, children }: { label: string; children: ReactNode }) => (
  <figure className="mock is-playing overflow-hidden rounded-sm border border-border bg-card">
    <svg viewBox="0 0 320 200" role="img" aria-label={label} className="block h-auto w-full">
      {children}
    </svg>
  </figure>
);

export const SearchThumb = ({ label }: { label: string }) => (
  <Mini label={label}>
    <rect x={16} y={16} width={288} height={30} rx={4} className="fill-background stroke-border" />
    <text x={28} y={36} fontSize={11} className="fill-foreground">
      ⌕ white whale voyage
    </text>
    {[0.94, 0.81, 0.66, 0.52].map((score, i) => {
      const y = 58 + i * 34;
      const top = i === 0;
      return (
        <g key={score} className={top ? "mk-pulse" : undefined}>
          <rect x={16} y={y} width={288} height={28} rx={3} className={top ? "fill-primary/10" : "fill-secondary/60"} />
          <rect x={26} y={y + 8} width={[150, 128, 160, 108][i]} height={4} rx={2} className={top ? "fill-primary" : "fill-foreground/50"} />
          <rect x={26} y={y + 17} width={92} height={3} rx={1.5} className="fill-muted-foreground/30" />
          <text x={296} y={y + 18} fontSize={9} textAnchor="end" className={top ? "fill-primary" : "fill-muted-foreground"}>
            {score.toFixed(2)}
          </text>
        </g>
      );
    })}
  </Mini>
);

export const ScheduleThumb = ({ label }: { label: string }) => {
  // One column per weekday; each block is a surgery, filled once its material is delivered.
  const days = [
    [{ y: 44, h: 30, done: true }, { y: 84, h: 22, done: true }, { y: 116, h: 34, done: false }],
    [{ y: 52, h: 40, done: true }, { y: 102, h: 26, done: false }],
    [{ y: 44, h: 24, done: true }, { y: 78, h: 30, done: false }, { y: 118, h: 22, done: false }],
    [{ y: 60, h: 34, done: false }, { y: 104, h: 30, done: false }],
    [{ y: 48, h: 26, done: false }, { y: 86, h: 40, done: false }],
  ];
  return (
    <Mini label={label}>
      {days.map((blocks, i) => {
        const x = 20 + i * 58;
        return (
          <g key={i}>
            <text x={x + 25} y={30} fontSize={9} textAnchor="middle" className="fill-muted-foreground">
              {12 + i}
            </text>
            <rect x={x} y={38} width={50} height={124} rx={3} className="fill-secondary/40" />
            {blocks.map((b, j) => (
              <rect
                key={j}
                x={x + 4}
                y={b.y}
                width={42}
                height={b.h}
                rx={2}
                className={b.done ? "fill-primary/70" : "fill-card stroke-foreground/40"}
              />
            ))}
          </g>
        );
      })}
      <circle cx={190} cy={84} r={3.5} className="mk-pulse fill-primary" />
      <text x={16} y={186} fontSize={9} className="fill-muted-foreground">
        react · prisma · postgres
      </text>
      <text x={304} y={186} fontSize={9} textAnchor="end" className="fill-primary">
        ● prod
      </text>
    </Mini>
  );
};

export const SensorsThumb = ({ label }: { label: string }) => {
  const nodes = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return { x: 160 + Math.cos(a) * 110, y: 100 + Math.sin(a) * 66 };
  });
  return (
    <Mini label={label}>
      {nodes.map((n, i) => (
        <g key={i}>
          <line x1={160} y1={100} x2={n.x} y2={n.y} className="stroke-border" />
          <circle cx={(160 + n.x) / 2} cy={(100 + n.y) / 2} r={2.5} className="mk-pulse fill-primary" style={d(i * 0.4)} />
          <circle cx={n.x} cy={n.y} r={9} className="fill-card stroke-foreground/50" />
          <text x={n.x} y={n.y + 3} fontSize={8} textAnchor="middle" className="fill-muted-foreground">
            s{i + 1}
          </text>
        </g>
      ))}
      <circle cx={160} cy={100} r={18} className="fill-primary/15 stroke-primary" />
      <text x={160} y={103} fontSize={9} textAnchor="middle" className="fill-primary">
        ctrl
      </text>
      <text x={16} y={190} fontSize={9} className="fill-muted-foreground">
        nmap · nvd · kev · epss
      </text>
      <text x={304} y={190} fontSize={9} textAnchor="end" className="fill-primary">
        nis2
      </text>
    </Mini>
  );
};
