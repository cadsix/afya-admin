"use client";

import KpiCard from "../KpiCard";

interface ReferralsViewProps {
  onToast: (msg: string) => void;
}

const pending = [
  { name: "Kwame O.", bp: "178/106", cat: "crisis",  catLabel: "Crisis",  facility: "Ho Municipal Hosp.", day: "Day 4", dayColor: "var(--red)",   reminders: 3, status: "overdue" as const },
  { name: "Kofi M.",  bp: "134/82",  cat: "stage1",  catLabel: "Stage 1", facility: "Ho Municipal Hosp.", day: "Day 3", dayColor: "var(--amber)", reminders: 2, status: "pending" as const },
];

export default function ReferralsView({ onToast }: ReferralsViewProps) {
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>Referral Tracking</div>
        <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>All high-BP participants referred to clinical care</div>
      </div>
      <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 16 }}>
        <KpiCard icon="" label="Total Referrals"    value={19} delta="Last 30 days"    deltaType="neutral" />
        <KpiCard icon="" label="Attended Clinic"    value={11} delta="58% conversion"  deltaType="up" />
        <KpiCard icon="" label="Pending / Overdue"  value={8}  delta="3 overdue Day 7+" deltaType="dn" valueRed />
      </div>
      <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
        <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
          <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>Pending Referrals</span>
          <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>Sorted by urgency</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Patient","BP","Category","Facility","Days Since Referral","Reminders Sent","Status","Action"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".57rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gray)", borderBottom: "1px solid var(--gray-lt)", background: "var(--gray-xlt)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pending.map(r => (
                <tr
                  key={r.name}
                  onMouseEnter={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)"))}
                  onMouseLeave={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = ""))}
                >
                  <td style={{ padding: "11px 13px", fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{r.name}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontWeight: 500, color: r.cat === "crisis" ? "var(--red)" : "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{r.bp}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".68rem", fontWeight: 500, padding: "2px 7px", borderRadius: 2, background: r.cat === "crisis" ? "var(--red)" : "var(--red-pale)", color: r.cat === "crisis" ? "white" : "var(--red)" }}>{r.catLabel}</span>
                  </td>
                  <td style={{ padding: "11px 13px", fontSize: ".75rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{r.facility}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontWeight: 500, color: r.dayColor, borderBottom: "1px solid var(--gray-xlt)" }}>{r.day}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{r.reminders}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    {r.status === "overdue"
                      ? <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--red-pale)", color: "var(--red)", border: "1px solid var(--red-mist)" }}>Overdue</span>
                      : <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--amber-bg)", color: "var(--amber)", border: "1px solid var(--amber-border)" }}>Pending</span>
                    }
                  </td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <button
                      onClick={() => onToast("Marked as attended")}
                      style={{ fontSize: ".7rem", padding: "4px 10px", borderRadius: 2, color: "var(--gray)", border: "1px solid transparent", cursor: "pointer", background: "none", fontFamily: "inherit" }}
                      onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red-pale)"; b.style.color = "var(--red)"; b.style.borderColor = "var(--red-mist)"; }}
                      onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--gray)"; b.style.borderColor = "transparent"; }}
                    >Mark Attended</button>
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
