"use client";

type DotType = "g" | "r" | "a" | "x";

interface Patient {
  name: string;
  category: string;
  categoryType: "crisis" | "stage2" | "stage1" | "elevated" | "normal";
  days: number;
  week: DotType[];
  rate: number;
  lastReply: string;
  status: "on-track" | "outreach";
  actionLabel: string;
}

const dotColors: Record<DotType, string> = {
  g: "var(--green)",
  r: "var(--red)",
  a: "var(--amber)",
  x: "var(--gray-lt)",
};

const chipStyles: Record<string, { bg: string; color: string }> = {
  crisis:   { bg: "var(--red)",      color: "white" },
  stage2:   { bg: "var(--red-pale)", color: "var(--red)" },
  stage1:   { bg: "var(--red-pale)", color: "var(--red)" },
  elevated: { bg: "var(--amber-bg)", color: "var(--amber)" },
  normal:   { bg: "var(--green-bg)", color: "var(--green)" },
};

const chipLabels: Record<string, string> = {
  crisis: "Crisis", stage2: "Stage 2", stage1: "Stage 1", elevated: "Elevated", normal: "Normal",
};

const patients: Patient[] = [
  { name: "Kwame O.", category: "crisis",  categoryType: "crisis", days: 14, week: ["g","g","r","g","g","g","g"], rate: 86,  lastReply: "Today 7:04am", status: "on-track", actionLabel: "View" },
  { name: "Abena T.", category: "stage2",  categoryType: "stage2", days: 21, week: ["g","g","g","g","g","g","g"], rate: 100, lastReply: "Today 8:02am", status: "on-track", actionLabel: "View" },
  { name: "Kofi M.",  category: "stage1",  categoryType: "stage1", days: 9,  week: ["g","r","r","r","x","x","x"], rate: 28,  lastReply: "3 days ago",   status: "outreach", actionLabel: "Flag" },
  { name: "Esi B.",   category: "stage2",  categoryType: "stage2", days: 31, week: ["g","g","a","g","g","r","g"], rate: 71,  lastReply: "Yesterday",    status: "on-track", actionLabel: "View" },
  { name: "Yaw P.",   category: "stage1",  categoryType: "stage1", days: 7,  week: ["r","r","r","r","r","r","r"], rate: 0,   lastReply: "7 days ago",   status: "outreach", actionLabel: "Flag" },
];

interface AdherenceTableProps {
  onToast: (msg: string) => void;
}

export default function AdherenceTable({ onToast }: AdherenceTableProps) {
  const getRateColor = (rate: number) => rate >= 70 ? "var(--green)" : rate >= 40 ? "var(--amber)" : "var(--red)";
  const getRateBg = (rate: number) => rate >= 70 ? "var(--green-bg)" : rate >= 40 ? "var(--amber-bg)" : "var(--red-pale)";

  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
      <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
        <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>Medication Adherence — Active Patients</span>
        <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>6 of 23 active · sorted by risk</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Patient","Category","Days on Meds","This Week","7-day Rate","Last Reply","Status","Action"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".57rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gray)", borderBottom: "1px solid var(--gray-lt)", background: "var(--gray-xlt)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr
                key={p.name}
                onMouseEnter={e => { Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)")); }}
                onMouseLeave={e => { Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "")); }}
              >
                <td style={{ padding: "11px 13px", fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.name}</td>
                <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".68rem", fontWeight: 500, padding: "2px 7px", borderRadius: 2, background: chipStyles[p.categoryType].bg, color: chipStyles[p.categoryType].color }}>
                    {chipLabels[p.categoryType]}
                  </span>
                </td>
                <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.days}</td>
                <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                  <div className="flex gap-1 items-center">
                    {p.week.map((d, i) => (
                      <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: dotColors[d] }} />
                    ))}
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
                  {p.status === "on-track" ? (
                    <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-border)" }}>On track</span>
                  ) : (
                    <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--red-pale)", color: "var(--red)", border: "1px solid var(--red-mist)" }}>⚑ Outreach needed</span>
                  )}
                </td>
                <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                  <button
                    onClick={() => onToast(p.actionLabel === "View" ? "Patient profile opened" : "Outreach flagged")}
                    style={{ fontSize: ".7rem", padding: "4px 10px", borderRadius: 2, color: "var(--gray)", border: "1px solid transparent", cursor: "pointer", background: "none", fontFamily: "inherit" }}
                    onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red-pale)"; b.style.color = "var(--red)"; b.style.borderColor = "var(--red-mist)"; }}
                    onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--gray)"; b.style.borderColor = "transparent"; }}
                  >{p.actionLabel}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
