"use client";

import { useState, useEffect } from "react";
import { screening, analytics, PatientResponse } from "@/lib/api";

interface PatientsViewProps {
  onToast: (msg: string) => void;
}

const chipStyles: Record<string, { bg: string; color: string }> = {
  "Hypertensive Crisis": { bg: "var(--red)",      color: "white" },
  "Stage 2 Hypertension":{ bg: "var(--red-pale)", color: "var(--red)" },
  "Stage 1 Hypertension":{ bg: "var(--red-pale)", color: "var(--red)" },
  "Elevated":            { bg: "var(--amber-bg)", color: "var(--amber)" },
  "Normal":              { bg: "var(--green-bg)", color: "var(--green)" },
};

function shortCat(cat: string) {
  if (cat === "Hypertensive Crisis") return "Crisis";
  if (cat === "Stage 2 Hypertension") return "Stage 2";
  if (cat === "Stage 1 Hypertension") return "Stage 1";
  return cat;
}

const catFilterMap: Record<string, string> = {
  "Normal":   "Normal",
  "Elevated": "Elevated",
  "Stage 1":  "Stage 1 Hypertension",
  "Stage 2":  "Stage 2 Hypertension",
  "Crisis":   "Hypertensive Crisis",
};

export default function PatientsView({ onToast }: PatientsViewProps) {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All Categories");
  const [loading, setLoading] = useState(true);

  const fetchPatients = (q: string, cat: string) => {
    setLoading(true);
    const status = cat !== "All Categories" ? catFilterMap[cat] : undefined;
    screening.listPatients({ search: q || undefined, status, limit: 50 })
      .then(data => setPatients(data))
      .catch(() => onToast("Could not load patients"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    analytics.summary()
      .then(d => setTotal((d.total_screened as number) ?? 0))
      .catch(() => {});
    fetchPatients("", "All Categories");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    fetchPatients(val, catFilter);
  };

  const handleCat = (val: string) => {
    setCatFilter(val);
    fetchPatients(search, val);
    onToast("Filter applied");
  };

  const handleExport = async () => {
    try {
      const csv = await analytics.exportCsv();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "afya-patients.csv"; a.click();
      URL.revokeObjectURL(url);
      onToast("CSV downloaded");
    } catch { onToast("Export failed"); }
  };

  const thStyle = { textAlign: "left" as const, padding: "9px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".57rem", letterSpacing: ".12em", textTransform: "uppercase" as const, color: "var(--gray)", borderBottom: "1px solid var(--gray-lt)", background: "var(--gray-xlt)" };
  const tdBase = { padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-start gap-3" style={{ marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>All Patients</div>
          <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>{total} total participants across all events</div>
        </div>
        <button
          onClick={handleExport}
          style={{ fontSize: ".78rem", fontWeight: 400, padding: "6px 14px", borderRadius: 3, border: "1px solid var(--gray-lt)", color: "var(--ink-mid)", cursor: "pointer", background: "none", fontFamily: "inherit" }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--red)"; (e.target as HTMLButtonElement).style.color = "var(--red)"; }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--gray-lt)"; (e.target as HTMLButtonElement).style.color = "var(--ink-mid)"; }}
        >Export CSV ↓</button>
      </div>

      <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
        <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by name or number..."
              style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: ".82rem", padding: "6px 12px", border: "1px solid var(--gray-lt)", borderRadius: 3, color: "var(--ink)", outline: "none", width: 220 }}
            />
            <select
              value={catFilter}
              onChange={e => handleCat(e.target.value)}
              style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: ".78rem", padding: "6px 10px", border: "1px solid var(--gray-lt)", borderRadius: 3, color: "var(--gray)" }}
            >
              {["All Categories","Normal","Elevated","Stage 1","Stage 2","Crisis"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ fontSize: ".72rem", color: "var(--gray)" }}>
            {loading ? "Loading…" : `Showing ${patients.length} of ${total}`}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["ID","Name","WhatsApp","BP","Category","Event","Programme","Action"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ ...tdBase, textAlign: "center", fontSize: ".8rem", color: "var(--gray)" }}>Loading…</td></tr>
              ) : patients.map(p => {
                const latest = p.bp_readings?.[0];
                const cat = latest?.category ?? "Normal";
                const chip = chipStyles[cat] ?? chipStyles["Normal"];
                const bp = latest ? `${latest.systolic}/${latest.diastolic}` : "—";
                const prog = p.is_enrolled_in_adherence ? "adherence" : p.status === "Needs Outreach" ? "outreach" : "tips";

                return (
                  <tr
                    key={p.id}
                    onMouseEnter={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)"))}
                    onMouseLeave={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = ""))}
                  >
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".7rem", color: "var(--gray)" }}>#{p.id}</td>
                    <td style={{ ...tdBase, fontSize: ".8rem", color: "var(--ink-mid)" }}>{p.first_name_or_alias}</td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".73rem", color: "var(--ink-mid)" }}>
                      {p.whatsapp_number.slice(0, 3)}●●●●{p.whatsapp_number.slice(-4)}
                    </td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontWeight: 500, fontSize: ".8rem", color: "var(--ink-mid)" }}>{bp}</td>
                    <td style={tdBase}>
                      <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".68rem", fontWeight: 500, padding: "2px 7px", borderRadius: 2, background: chip.bg, color: chip.color }}>{shortCat(cat)}</span>
                    </td>
                    <td style={{ ...tdBase, fontSize: ".75rem", color: "var(--gray)" }}>
                      {p.screening_event_id ? `Event #${p.screening_event_id}` : "—"}
                    </td>
                    <td style={tdBase}>
                      {prog === "adherence" && <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-border)" }}>Adherence</span>}
                      {prog === "outreach"  && <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--red-pale)", color: "var(--red)", border: "1px solid var(--red-mist)" }}>Outreach</span>}
                      {prog === "tips"      && <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--gray-xlt)", color: "var(--gray)" }}>Tips only</span>}
                    </td>
                    <td style={tdBase}>
                      <button
                        onClick={() => onToast("Patient profile opened")}
                        style={{ fontSize: ".7rem", padding: "4px 10px", borderRadius: 2, color: "var(--gray)", border: "1px solid transparent", cursor: "pointer", background: "none", fontFamily: "inherit" }}
                        onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red-pale)"; b.style.color = "var(--red)"; b.style.borderColor = "var(--red-mist)"; }}
                        onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--gray)"; b.style.borderColor = "transparent"; }}
                      >View</button>
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
