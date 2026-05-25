"use client";

import KpiCard from "../KpiCard";

type DotType = "g" | "r" | "a" | "x";

const dotColors: Record<DotType, string> = {
  g: "var(--green)", r: "var(--red)", a: "var(--amber)", x: "var(--gray-lt)",
};

const patients = [
  { name: "Yaw P.",   cat: "stage1", catLabel: "Stage 1", days: 7,  week: ["r","r","r","r","r","r","r"] as DotType[], rate: 0,   lastReply: "7 days ago", status: "outreach" as const },
  { name: "Kofi M.",  cat: "stage1", catLabel: "Stage 1", days: 9,  week: ["g","r","r","r","x","x","x"] as DotType[], rate: 28,  lastReply: "3 days ago", status: "outreach" as const },
  { name: "Esi B.",   cat: "stage2", catLabel: "Stage 2", days: 31, week: ["g","g","a","g","g","r","g"] as DotType[], rate: 71,  lastReply: "Yesterday",  status: "on-track" as const },
  { name: "Abena T.", cat: "stage2", catLabel: "Stage 2", days: 21, week: ["g","g","g","g","g","g","g"] as DotType[], rate: 100, lastReply: "Today 8am",  status: "on-track" as const },
  { name: "Kwame O.", cat: "crisis", catLabel: "Crisis",  days: 14, week: ["g","g","r","g","g","g","g"] as DotType[], rate: 86,  lastReply: "Today 7am",  status: "on-track" as const },
];

const chipStyles: Record<string, { bg: string; color: string }> = {
  crisis: { bg: "var(--red)", color: "white" },
  stage2: { bg: "var(--red-pale)", color: "var(--red)" },
  stage1: { bg: "var(--red-pale)", color: "var(--red)" },
};

export default function AdherenceView() {
  const getRateColor = (r: number) => r >= 70 ? "var(--green)" : r >= 40 ? "var(--amber)" : "var(--red)";
  const getRateBg = (r: number) => r >= 70 ? "var(--green-bg)" : r >= 40 ? "var(--amber-bg)" : "var(--red-pale)";

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>Adherence Programme</div>
        <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>23 patients currently on daily medication reminders</div>
      </div>
      <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 16 }}>
        <KpiCard icon="" label="Active Patients"    value={23}    delta="↑ 4 this week"      deltaType="up" />
        <KpiCard icon="" label="Avg Adherence Rate" value="78%"   delta="↑ 4% vs last week"  deltaType="up" />
        <KpiCard icon="" label="Needs Outreach"     value={3}     delta="7+ days no reply"   deltaType="dn" valueRed />
      </div>
      <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
        <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
          <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>All Active Patients</span>
          <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>Sorted by adherence (lowest first)</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Patient","Category","Days on Meds","This Week","Rate","Last Reply","Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".57rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gray)", borderBottom: "1px solid var(--gray-lt)", background: "var(--gray-xlt)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr
                  key={p.name}
                  onMouseEnter={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)"))}
                  onMouseLeave={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = ""))}
                >
                  <td style={{ padding: "11px 13px", fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.name}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".68rem", fontWeight: 500, padding: "2px 7px", borderRadius: 2, background: chipStyles[p.cat].bg, color: chipStyles[p.cat].color }}>{p.catLabel}</span>
                  </td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.days}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <div className="flex gap-1">
                      {p.week.map((d, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: dotColors[d] }} />)}
                    </div>
                  </td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <div style={{ background: getRateBg(p.rate), borderRadius: 3, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${p.rate}%`, background: getRateColor(p.rate), height: "100%" }} />
                    </div>
                    <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".62rem", color: getRateColor(p.rate), marginTop: 2 }}>{p.rate}%</div>
                  </td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".7rem", color: p.status === "outreach" ? "var(--red)" : "var(--gray)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.lastReply}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    {p.status === "on-track"
                      ? <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-border)" }}>On track</span>
                      : <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--red-pale)", color: "var(--red)", border: "1px solid var(--red-mist)" }}>⚑ Outreach</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
