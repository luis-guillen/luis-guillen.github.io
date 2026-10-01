import { CSSProperties, useId, useMemo } from "react";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const X0 = 24;
const W = 592;
const STEP = 16;
const PERIOD = W / STEP; // 37 points per screen, repeated for a seamless loop
const TOP = 92;
const BOTTOM = 222;

// Illustrative curves: the PPO agent sits above the nearest-ETA baseline (lower y = higher reward).
const ppoAt = (i: number) => {
  const k = i % PERIOD;
  return 132 + 9 * Math.sin(k * 0.8) + 6 * Math.sin(k * 2.1 + 1);
};
const baselineAt = (i: number) => {
  const k = i % PERIOD;
  return 176 + 8 * Math.sin(k * 0.7 + 2) + 5 * Math.sin(k * 1.9);
};

const pathFor = (f: (i: number) => number) =>
  Array.from({ length: PERIOD * 2 + 1 }, (_, i) => `${i ? "L" : "M"}${X0 + i * STEP} ${f(i).toFixed(1)}`).join(" ");

// Pickups around the port of Las Palmas de Gran Canaria.
const ASSIGNMENTS = [
  { id: "ord_7f2a", route: "Triana → Muelle", driver: "d07", eta: "4 min", urgency: 0.91 },
  { id: "ord_31c9", route: "Vegueta → Muelle", driver: "d02", eta: "9 min", urgency: 0.38 },
  { id: "ord_c04e", route: "Mesa y López → Muelle", driver: "d11", eta: "3 min", urgency: 0.86 },
  { id: "ord_5b17", route: "Las Canteras → Muelle", driver: "d05", eta: "12 min", urgency: 0.22 },
];

/** City2Cruise: reward per episode for the PPO agent vs the nearest-ETA baseline, and a feed of dispatch decisions. */
const DispatchMockup = () => {
  const clip = useId();
  const { ppo, area, baseline } = useMemo(() => {
    const ppo = pathFor(ppoAt);
    const area = `${ppo} L${X0 + PERIOD * 2 * STEP} ${BOTTOM} L${X0} ${BOTTOM} Z`;
    return { ppo, area, baseline: pathFor(baselineAt) };
  }, []);

  return (
    <g>
      <text x={24} y={40} fontSize={10} className="fill-muted-foreground">
        PPO VS NEAREST-ETA
      </text>
      <text x={24} y={74} fontSize={30} className="mk-sans fill-foreground">
        +16.7%
      </text>

      <text x={250} y={40} fontSize={10} className="fill-muted-foreground">
        MISSED DEADLINES
      </text>
      <text x={250} y={70} fontSize={20} className="mk-sans fill-foreground">
        −31.7%
      </text>

      <rect x={476} y={26} width={140} height={50} rx={3} className="fill-primary/10 stroke-primary/40" />
      <text x={490} y={44} fontSize={9} className="fill-muted-foreground">
        HELD-OUT EPISODES
      </text>
      <text x={490} y={67} fontSize={20} className="mk-sans fill-primary">
        1,000
      </text>

      {[112, 142, 172, 202].map((y) => (
        <line key={y} x1={X0} x2={X0 + W} y1={y} y2={y} strokeDasharray="2 4" className="stroke-border" />
      ))}

      <clipPath id={clip}>
        <rect x={X0} y={TOP} width={W} height={BOTTOM - TOP} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <g className="mk-scroll-x" style={{ "--mk-shift": `-${W}px`, "--mk-dur": "16s" } as CSSProperties}>
          <path d={area} className="fill-primary/10" />
          <path d={baseline} fill="none" strokeWidth={1.25} strokeDasharray="5 4" className="stroke-muted-foreground/70" />
          <path d={ppo} fill="none" strokeWidth={1.5} strokeLinejoin="round" className="stroke-primary" />
        </g>
      </g>

      <text x={X0 + W - 4} y={TOP + 12} fontSize={9} textAnchor="end" className="fill-primary">
        ppo
      </text>
      <text x={X0 + W - 4} y={TOP + 24} fontSize={9} textAnchor="end" className="fill-muted-foreground">
        nearest-eta
      </text>
      <text x={X0} y={238} fontSize={9} className="fill-muted-foreground">
        reward / episode
      </text>
      <text x={X0 + W} y={238} fontSize={9} textAnchor="end" className="fill-muted-foreground">
        now
      </text>

      <text x={24} y={264} fontSize={9} className="fill-muted-foreground">ORDER</text>
      <text x={110} y={264} fontSize={9} className="fill-muted-foreground">PICKUP</text>
      <text x={290} y={264} fontSize={9} className="fill-muted-foreground">DRIVER</text>
      <text x={360} y={264} fontSize={9} className="fill-muted-foreground">URGENCY</text>
      <text x={610} y={264} fontSize={9} textAnchor="end" className="fill-muted-foreground">ETA</text>
      <line x1={24} x2={616} y1={272} y2={272} className="stroke-border" />

      {ASSIGNMENTS.map((a, i) => {
        const y = 294 + i * 26;
        const urgent = a.urgency > 0.8;
        return (
          <g key={a.id} className="mk-row" style={d(i * 0.45)}>
            {urgent && (
              <>
                <rect x={24} y={y - 15} width={592} height={23} className="fill-primary/5" />
                <rect x={24} y={y - 15} width={2} height={23} className="fill-primary" />
              </>
            )}
            <text x={32} y={y} fontSize={11} className="fill-foreground">
              {a.id}
            </text>
            <text x={110} y={y} fontSize={11} className="fill-foreground">
              {a.route}
            </text>
            <text x={290} y={y} fontSize={11} className="fill-muted-foreground">
              {a.driver}
            </text>
            <rect x={360} y={y - 7} width={170} height={5} rx={2.5} className="fill-muted-foreground/15" />
            <rect
              x={360}
              y={y - 7}
              width={170 * a.urgency}
              height={5}
              rx={2.5}
              className={urgent ? "fill-primary" : "fill-muted-foreground/50"}
            />
            <text x={610} y={y} fontSize={11} textAnchor="end" className={urgent ? "fill-primary" : "fill-foreground"}>
              {a.eta}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default DispatchMockup;
