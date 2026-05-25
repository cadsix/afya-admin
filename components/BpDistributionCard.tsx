"use client";

interface BarItem {
  label: string;
  count: number;
  pct: string;
  width: string;
  colorClass: string;
}

const bars: BarItem[] = [
  { label: "Normal",  count: 28, pct: "59.6%", width: "60%",  colorClass: "var(--green)" },
  { label: "Elevated",count: 11, pct: "23.4%", width: "23%",  colorClass: "var(--amber)" },
  { label: "Stage 1", count: 5,  pct: "10.6%", width: "11%",  colorClass: "var(--red-soft)" },
  { label: "Stage 2", count: 2,  pct: "4.3%",  width: "4.5%", colorClass: "var(--red-soft)" },
  { label: "Crisis",  count: 1,  pct: "2.1%",  width: "2%",   colorClass: "var(--red)" },
];

export default function BpDistributionCard() {
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
      <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
        <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>BP Classification Distribution</span>
        <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>Today · 47 participants</span>
      </div>
      <div style={{ padding: 18 }}>
        <div className="flex flex-col gap-3">
          {bars.map(bar => (
            <div key={bar.label} className="flex items-center gap-2.5">
              <div style={{ fontSize: ".74rem", color: "var(--ink-mid)", width: 72, flexShrink: 0, textAlign: "right" }}>{bar.label}</div>
              <div
                title={`${bar.count} participants`}
                style={{ flex: 1, background: "var(--gray-xlt)", borderRadius: 2, height: 10, overflow: "hidden", cursor: "pointer" }}
              >
                <div
                  style={{ height: "100%", borderRadius: 2, width: bar.width, background: bar.colorClass, transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)" }}
                />
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".7rem", color: "var(--gray)", width: 24, flexShrink: 0 }}>{bar.count}</div>
              <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".65rem", color: "var(--gray)", width: 36 }}>{bar.pct}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
