"use client";

import { useState } from "react";

interface PatientsViewProps {
  onToast: (msg: string) => void;
}

const allPatients = [
  { id: "#047", name: "Kwame O.",   phone: "024●●●●7821", bp: "178/106", cat: "crisis",   catLabel: "Crisis",   event: "Kpando 18 May",    prog: "adherence" },
  { id: "#046", name: "Abena T.",   phone: "055●●●●3310", bp: "158/94",  cat: "stage2",   catLabel: "Stage 2",  event: "Kpando 18 May",    prog: "adherence" },
  { id: "#045", name: "Kofi M.",    phone: "020●●●●9944", bp: "134/82",  cat: "stage1",   catLabel: "Stage 1",  event: "Kpando 18 May",    prog: "outreach" },
  { id: "#031", name: "Ama Darkwah",phone: "024●●●●5567", bp: "125/78",  cat: "elevated", catLabel: "Elevated", event: "Ho Central 2 May", prog: "tips" },
  { id: "#043", name: "Yaa Fiagbor",phone: "059●●●●8812", bp: "116/72",  cat: "normal",   catLabel: "Normal",   event: "Kpando 18 May",    prog: "tips" },
];

const chipStyles: Record<string, { bg: string; color: string }> = {
  crisis:   { bg: "var(--red)",      color: "white" },
  stage2:   { bg: "var(--red-pale)", color: "var(--red)" },
  stage1:   { bg: "var(--red-pale)", color: "var(--red)" },
  elevated: { bg: "var(--amber-bg)", color: "var(--amber)" },
  normal:   { bg: "var(--green-bg)", color: "var(--green)" },
};

export default function PatientsView({ onToast }: PatientsViewProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All Categories");

  const filtered = allPatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    const matchCat = catFilter === "All Categories" || p.catLabel === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="flex justify-between items-start" style={{ marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>All Patients</div>
          <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>247 total participants across all events</div>
        </div>
        <button
          onClick={() => onToast("Patient list exported")}
          style={{ fontSize: ".78rem", fontWeight: 400, padding: "6px 14px", borderRadius: 3, border: "1px solid var(--gray-lt)", color: "var(--ink-mid)", cursor: "pointer", background: "none", fontFamily: "inherit" }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--red)"; (e.target as HTMLButtonElement).style.color = "var(--red)"; }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--gray-lt)"; (e.target as HTMLButtonElement).style.color = "var(--ink-mid)"; }}
        >Export CSV ↓</button>
      </div>
      <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
        <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
          <div className="flex gap-2 items-center">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or number..."
              style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: ".82rem", padding: "6px 12px", border: "1px solid var(--gray-lt)", borderRadius: 3, color: "var(--ink)", outline: "none", width: 220 }}
            />
            <select
              value={catFilter}
              onChange={e => { setCatFilter(e.target.value); onToast("Filter applied"); }}
              style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: ".78rem", padding: "6px 10px", border: "1px solid var(--gray-lt)", borderRadius: 3, color: "var(--gray)" }}
            >
              {["All Categories","Normal","Elevated","Stage 1","Stage 2","Crisis"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ fontSize: ".72rem", color: "var(--gray)" }}>Showing {filtered.length} of 247</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ID","Name","WhatsApp","BP","Category","Event","Programme","Action"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".57rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gray)", borderBottom: "1px solid var(--gray-lt)", background: "var(--gray-xlt)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr
                  key={p.id}
                  onMouseEnter={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)"))}
                  onMouseLeave={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = ""))}
                >
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".7rem", color: "var(--gray)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.id}</td>
                  <td style={{ padding: "11px 13px", fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.name}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".73rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.phone}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontWeight: 500, fontSize: ".8rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.bp}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".68rem", fontWeight: 500, padding: "2px 7px", borderRadius: 2, background: chipStyles[p.cat].bg, color: chipStyles[p.cat].color }}>{p.catLabel}</span>
                  </td>
                  <td style={{ padding: "11px 13px", fontSize: ".75rem", color: "var(--gray)", borderBottom: "1px solid var(--gray-xlt)" }}>{p.event}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    {p.prog === "adherence" && <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-border)" }}>Adherence</span>}
                    {p.prog === "outreach"  && <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--red-pale)", color: "var(--red)", border: "1px solid var(--red-mist)" }}>Outreach</span>}
                    {p.prog === "tips"      && <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", padding: "2px 6px", borderRadius: 2, background: "var(--gray-xlt)", color: "var(--gray)" }}>Tips only</span>}
                  </td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <button
                      onClick={() => onToast("Patient profile opened")}
                      style={{ fontSize: ".7rem", padding: "4px 10px", borderRadius: 2, color: "var(--gray)", border: "1px solid transparent", cursor: "pointer", background: "none", fontFamily: "inherit" }}
                      onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red-pale)"; b.style.color = "var(--red)"; b.style.borderColor = "var(--red-mist)"; }}
                      onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--gray)"; b.style.borderColor = "transparent"; }}
                    >View</button>
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
