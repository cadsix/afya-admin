"use client";

import { useEffect, useState } from "react";
import { screening, PatientResponse } from "@/lib/api";

type DotType = "g" | "r" | "a" | "x";

const dotColors: Record<DotType, string> = {
  g: "var(--green)", r: "var(--red)", a: "var(--amber)", x: "var(--gray-lt)",
};

const chipStyles: Record<string, { bg: string; color: string }> = {
  "Hypertensive Crisis": { bg: "var(--red)",      color: "white" },
  "Stage 2":             { bg: "var(--red-pale)", color: "var(--red)" },
  "Stage 1":             { bg: "var(--red-pale)", color: "var(--red)" },
  "Elevated":            { bg: "var(--amber-bg)", color: "var(--amber)" },
  "Normal":              { bg: "var(--green-bg)", color: "var(--green)" },
};

function categoryLabel(cat: string) {
  if (cat === "Hypertensive Crisis") return "Crisis";
  return cat;
}

function dotFromStatus(s: string): DotType {
  if (s === "TAKEN") return "g";
  if (s === "MISSED") return "r";
  if (s === "LATE") return "a";
  return "x";
}

interface AdherenceTableProps {
  onToast: (msg: string) => void;
}

export default function AdherenceTable({ onToast }: AdherenceTableProps) {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [adherenceMap, setAdherenceMap] = useState<Record<number, { rate: number; dots: DotType[] }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    screening.listPatients({ enrolled: true, limit: 6 })
      .then(async (pts) => {
        setPatients(pts);
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
      })
      .catch(() => onToast("Could not load adherence data"))
      .finally(() => setLoading(false));
  }, [onToast]);

  const getRateColor = (r: number) => r >= 70 ? "var(--green)" : r >= 40 ? "var(--amber)" : "var(--red)";
  const getRateBg    = (r: number) => r >= 70 ? "var(--green-bg)" : r >= 40 ? "var(--amber-bg)" : "var(--red-pale)";

  const getCategory = (p: PatientResponse) => {
    const latest = p.bp_readings?.[0];
    return latest?.category ?? "Normal";
  };

  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
      <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
        <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>Medication Adherence — Active Patients</span>
        <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>
          {loading ? "Loading…" : `${patients.length} active · sorted by risk`}
        </span>
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
            {loading ? (
              <tr><td colSpan={8} style={{ padding: "20px 13px", textAlign: "center", fontSize: ".8rem", color: "var(--gray)" }}>Loading…</td></tr>
            ) : patients.map(p => {
              const cat = getCategory(p);
              const adh = adherenceMap[p.id] ?? { rate: 0, dots: Array(7).fill("x") as DotType[] };
              const isOutreach = p.status === "Needs Outreach" || adh.rate < 30;
              const daysOnMeds = p.bp_readings?.length ?? 0;
              const chipStyle = chipStyles[cat] ?? chipStyles["Normal"];

              return (
                <tr
                  key={p.id}
                  onMouseEnter={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)"))}
                  onMouseLeave={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = ""))}
                >
                  <td style={{ padding: "11px 13px", fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.first_name_or_alias}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".68rem", fontWeight: 500, padding: "2px 7px", borderRadius: 2, background: chipStyle.bg, color: chipStyle.color }}>
                      {categoryLabel(cat)}
                    </span>
                  </td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{daysOnMeds}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <div className="flex gap-1 items-center">
                      {adh.dots.map((d, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: dotColors[d] }} />)}
                    </div>
                  </td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <div style={{ background: getRateBg(adh.rate), borderRadius: 3, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${adh.rate}%`, background: getRateColor(adh.rate), height: "100%" }} />
                    </div>
                    <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".62rem", color: getRateColor(adh.rate), marginTop: 2 }}>{adh.rate}%</div>
                  </td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".7rem", color: isOutreach ? "var(--red)" : "var(--gray)", borderBottom: "1px solid var(--gray-xlt)" }}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    {isOutreach
                      ? <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--red-pale)", color: "var(--red)", border: "1px solid var(--red-mist)" }}>⚑ Outreach needed</span>
                      : <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-border)" }}>On track</span>
                    }
                  </td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <button
                      onClick={() => onToast(isOutreach ? "Outreach flagged" : "Patient profile opened")}
                      style={{ fontSize: ".7rem", padding: "4px 10px", borderRadius: 2, color: "var(--gray)", border: "1px solid transparent", cursor: "pointer", background: "none", fontFamily: "inherit" }}
                      onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red-pale)"; b.style.color = "var(--red)"; b.style.borderColor = "var(--red-mist)"; }}
                      onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--gray)"; b.style.borderColor = "transparent"; }}
                    >{isOutreach ? "Flag" : "View"}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
