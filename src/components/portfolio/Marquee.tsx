interface MarqueeProps {
  items: string[];
  label?: string;
}

/** Full-bleed, CSS-only marquee. The list is rendered twice for a seamless loop. */
const Marquee = ({ items, label }: MarqueeProps) => {
  const row = [...items, ...items];
  return (
    <div className="marquee hairline-t hairline-b relative overflow-hidden py-4" aria-label={label}>
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {item}
            <span className="mx-6 text-primary" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
