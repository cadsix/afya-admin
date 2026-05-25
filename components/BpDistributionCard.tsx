"use client";

interface BpDistributionCardProps {
  bpDistribution?: Record<string, number>;
}

const defaultBars = [
  { label: "Normal",   key: "Normal",  color: "var(--green)",    pct: 0 },
  { label: "Elevated", key: "Elevated",color: "var(--amber)",    pct: 0 },
  { label: "Stage 1",  key: "Stage 1", color: "var(--red-soft)", pct: 0 },
  { label: "Stage 2",  key: "Stage 2", color: "var(--red-soft)", pct: 0 },
  { label: "Crisis",   key: "Crisis",  color: "var(--red)",      pct: 0 },
];

export default function BpDistributionCard({ bpDistribution }: BpDistributionCardProps) {
  const total = bpDistribution
    ? Object.values(bpDistribution).reduce((a, b) => a + b, 0)
    : 0;

  const bars = defaultBars.map(b => {
    const count = bpDistribution?.[b.key] ?? 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return { ...b, count, pct };
  });

  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
      <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
        <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>BP Classification Distribution</span>
        <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>
          {total > 0 ? `${total} participants` : "Loading…"}
        </span>
      </div>
      <div style={{ padding: 18 }}>
        <div className="flex flex-col gap-3">
          {bars.map(bar => (
            <div key={bar.label} className="flex items-center gap-2.5">
              <div style={{ fontSize: ".74rem", color: "var(--ink-mid)", width: 72, flexShrink: 0, textAlign: "right" }}>{bar.label}</div>
              <div style={{ flex: 1, background: "var(--gray-xlt)", borderRadius: 2, height: 10, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ height: "100%", borderRadius: 2, width: `${bar.pct}%`, background: bar.color, transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)" }} />
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".7rem", color: "var(--gray)", width: 24, flexShrink: 0 }}>{bar.count}</div>
              <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".65rem", color: "var(--gray)", width: 36 }}>{bar.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
