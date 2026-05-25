"use client";

import { useState, useEffect } from "react";
import KpiCard from "../KpiCard";
import { analytics, screening, PatientResponse } from "@/lib/api";

interface ReferralsViewProps {
  onToast: (msg: string) => void;
}

export default function ReferralsView({ onToast }: ReferralsViewProps) {
  const [stats, setStats] = useState<Record<string, unknown>>({});
  const [pending, setPending] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analytics.referrals(),
      screening.listPatients({ status: "Referred", limit: 50 }),
    ])
      .then(([s, pts]) => { setStats(s); setPending(pts); })
      .catch(() => onToast("Could not load referral data"))
      .finally(() => setLoading(false));
  }, [onToast]);

  const total    = (stats.total_referrals as number) ?? 0;
  const attended = (stats.attended as number) ?? 0;
  const pendingN = (stats.pending as number) ?? pending.length;

  const thStyle = { textAlign: "left" as const, padding: "9px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".57rem", letterSpacing: ".12em", textTransform: "uppercase" as const, color: "var(--gray)", borderBottom: "1px solid var(--gray-lt)", background: "var(--gray-xlt)" };
  const tdBase  = { padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" };

  const markAttended = async (id: number) => {
    try {
      await screening.markReferralSeen(id);
      setPending(prev => prev.filter(p => p.id !== id));
      onToast("Marked as attended");
    } catch { onToast("Could not update patient"); }
  };

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>Referral Tracking</div>
        <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>All high-BP participants referred to clinical care</div>
      </div>

      <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 16 }}>
        <KpiCard icon="" label="Total Referrals"   value={loading ? "…" : total}    delta="Last 30 days"     deltaType="neutral" />
        <KpiCard icon="" label="Attended Clinic"   value={loading ? "…" : attended} delta={`${total > 0 ? Math.round((attended/total)*100) : 0}% conversion`} deltaType="up" />
        <KpiCard icon="" label="Pending / Overdue" value={loading ? "…" : pendingN} delta="awaiting follow-up" deltaType="dn" valueRed />
      </div>

      <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
        <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
          <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>Pending Referrals</span>
          <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>Sorted by urgency</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Patient","BP","Category","Facility","Referred","Status","Action"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ ...tdBase, textAlign: "center", fontSize: ".8rem", color: "var(--gray)" }}>Loading…</td></tr>
              ) : pending.length === 0 ? (
                <tr><td colSpan={7} style={{ ...tdBase, textAlign: "center", fontSize: ".8rem", color: "var(--gray)" }}>No pending referrals</td></tr>
              ) : pending.map(p => {
                const latest = p.bp_readings?.[0];
                const cat = latest?.category ?? "Normal";
                const bp  = latest ? `${latest.systolic}/${latest.diastolic}` : "—";
                const isCrisis = cat === "Hypertensive Crisis";
                const chipBg = isCrisis ? "var(--red)" : "var(--red-pale)";
                const chipColor = isCrisis ? "white" : "var(--red)";
                const shortCat = isCrisis ? "Crisis" : cat.replace(" Hypertension","");
                const referredDate = new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

                return (
                  <tr
                    key={p.id}
                    onMouseEnter={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)"))}
                    onMouseLeave={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = ""))}
                  >
                    <td style={{ ...tdBase, fontSize: ".8rem", color: "var(--ink-mid)" }}>{p.first_name_or_alias}</td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontWeight: 500, color: isCrisis ? "var(--red)" : "var(--ink-mid)" }}>{bp}</td>
                    <td style={tdBase}>
                      <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".68rem", fontWeight: 500, padding: "2px 7px", borderRadius: 2, background: chipBg, color: chipColor }}>{shortCat}</span>
                    </td>
                    <td style={{ ...tdBase, fontSize: ".75rem", color: "var(--ink-mid)" }}>{p.referral_facility ?? "—"}</td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".75rem", color: "var(--gray)" }}>{referredDate}</td>
                    <td style={tdBase}>
                      <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--amber-bg)", color: "var(--amber)", border: "1px solid var(--amber-border)" }}>Pending</span>
                    </td>
                    <td style={tdBase}>
                      <button
                        onClick={() => markAttended(p.id)}
                        style={{ fontSize: ".7rem", padding: "4px 10px", borderRadius: 2, color: "var(--gray)", border: "1px solid transparent", cursor: "pointer", background: "none", fontFamily: "inherit" }}
                        onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red-pale)"; b.style.color = "var(--red)"; b.style.borderColor = "var(--red-mist)"; }}
                        onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--gray)"; b.style.borderColor = "transparent"; }}
                      >Mark Attended</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
