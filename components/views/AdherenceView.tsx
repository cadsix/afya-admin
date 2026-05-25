"use client";

import { useState, useEffect } from "react";
import KpiCard from "../KpiCard";
import { analytics, screening, PatientResponse } from "@/lib/api";

type DotType = "g" | "r" | "a" | "x";

const dotColors: Record<DotType, string> = {
  g: "var(--green)", r: "var(--red)", a: "var(--amber)", x: "var(--gray-lt)",
};

function dotFromStatus(s: string): DotType {
  if (s === "TAKEN") return "g";
  if (s === "MISSED") return "r";
  if (s === "LATE") return "a";
  return "x";
}

const chipStyles: Record<string, { bg: string; color: string }> = {
  "Hypertensive Crisis":  { bg: "var(--red)",      color: "white" },
  "Stage 2 Hypertension": { bg: "var(--red-pale)", color: "var(--red)" },
  "Stage 1 Hypertension": { bg: "var(--red-pale)", color: "var(--red)" },
  "Elevated":             { bg: "var(--amber-bg)", color: "var(--amber)" },
  "Normal":               { bg: "var(--green-bg)", color: "var(--green)" },
};

function shortCat(cat: string) {
  if (cat === "Hypertensive Crisis") return "Crisis";
  if (cat === "Stage 2 Hypertension") return "Stage 2";
  if (cat === "Stage 1 Hypertension") return "Stage 1";
  return cat;
}

export default function AdherenceView() {
  const [stats, setStats] = useState<Record<string, unknown>>({});
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [adherenceMap, setAdherenceMap] = useState<Record<number, { rate: number; dots: DotType[] }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analytics.adherence(),
      screening.listPatients({ enrolled: true, limit: 50 }),
    ]).then(async ([s, pts]) => {
      setStats(s);
      // sort lowest rate first — fetch adherence for each
      const map: Record<number, { rate: number; dots: DotType[] }> = {};
      await Promise.all(pts.map(async p => {
        try {
          const adh = await screening.getPatientAdherence(p.id);
          map[p.id] = {
            rate: Math.round(adh.adherence_rate * 100),
            dots: adh.last_7_days.map(dotFromStatus),
          };
        } catch { map[p.id] = { rate: 0, dots: Array(7).fill("x") as DotType[] }; }
      }));
      setAdherenceMap(map);
      // sort by rate ascending
      pts.sort((a, b) => (map[a.id]?.rate ?? 0) - (map[b.id]?.rate ?? 0));
      setPatients(pts);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getRateColor = (r: number) => r >= 70 ? "var(--green)" : r >= 40 ? "var(--amber)" : "var(--red)";
  const getRateBg    = (r: number) => r >= 70 ? "var(--green-bg)" : r >= 40 ? "var(--amber-bg)" : "var(--red-pale)";

  const avgRate   = (stats.overall_adherence_rate as number) ?? 0;
  const active    = (stats.total_enrolled as number) ?? patients.length;
  const outreach  = patients.filter(p => (adherenceMap[p.id]?.rate ?? 0) < 30).length;

  const thStyle = { textAlign: "left" as const, padding: "9px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".57rem", letterSpacing: ".12em", textTransform: "uppercase" as const, color: "var(--gray)", borderBottom: "1px solid var(--gray-lt)", background: "var(--gray-xlt)" };
  const tdBase  = { padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" };

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>Adherence Programme</div>
        <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>
          {loading ? "Loading…" : `${active} patients on daily medication reminders`}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: 16 }}>
        <KpiCard icon="" label="Active Patients"    value={loading ? "…" : active}                          delta="enrolled in programme"  deltaType="up" />
        <KpiCard icon="" label="Avg Adherence Rate" value={loading ? "…" : `${Math.round(avgRate * 100)}%`} delta="↑ 4% vs last week"       deltaType="up" />
        <KpiCard icon="" label="Needs Outreach"     value={loading ? "…" : outreach}                        delta="7+ days no reply"        deltaType="dn" valueRed />
      </div>

      <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
        <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
          <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>All Active Patients</span>
          <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>Sorted by adherence (lowest first)</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Patient","Category","Days on Meds","This Week","Rate","Last Reply","Status"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ ...tdBase, textAlign: "center", fontSize: ".8rem", color: "var(--gray)" }}>Loading…</td></tr>
              ) : patients.map(p => {
                const cat   = p.bp_readings?.[0]?.category ?? "Normal";
                const chip  = chipStyles[cat] ?? chipStyles["Normal"];
                const adh   = adherenceMap[p.id] ?? { rate: 0, dots: Array(7).fill("x") as DotType[] };
                const days  = p.bp_readings?.length ?? 0;
                const isOut = adh.rate < 30;

                return (
                  <tr
                    key={p.id}
                    onMouseEnter={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)"))}
                    onMouseLeave={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = ""))}
                  >
                    <td style={{ ...tdBase, fontSize: ".8rem", color: "var(--ink-mid)" }}>{p.first_name_or_alias}</td>
                    <td style={tdBase}>
                      <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".68rem", fontWeight: 500, padding: "2px 7px", borderRadius: 2, background: chip.bg, color: chip.color }}>{shortCat(cat)}</span>
                    </td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".8rem", color: "var(--ink-mid)" }}>{days}</td>
                    <td style={tdBase}>
                      <div className="flex gap-1">
                        {adh.dots.map((d, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: dotColors[d] }} />)}
                      </div>
                    </td>
                    <td style={tdBase}>
                      <div style={{ background: getRateBg(adh.rate), borderRadius: 3, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${adh.rate}%`, background: getRateColor(adh.rate), height: "100%" }} />
                      </div>
                      <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".62rem", color: getRateColor(adh.rate), marginTop: 2 }}>{adh.rate}%</div>
                    </td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".7rem", color: isOut ? "var(--red)" : "var(--gray)" }}>
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td style={tdBase}>
                      {isOut
                        ? <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--red-pale)", color: "var(--red)", border: "1px solid var(--red-mist)" }}>⚑ Outreach</span>
                        : <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-border)" }}>On track</span>
                      }
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
