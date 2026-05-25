"use client";

import { useState, useEffect } from "react";
import { analytics, screening, PatientResponse } from "@/lib/api";

interface OutreachViewProps {
  onToast: (msg: string) => void;
}

export default function OutreachView({ onToast }: OutreachViewProps) {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analytics.needsOutreach()
      .then(async (queue) => {
        // queue items have patient_id — fetch full patient objects
        const ids = queue.map(q => q.patient_id as number).filter(Boolean);
        const pts = await Promise.all(ids.map(id => screening.getPatient(id).catch(() => null)));
        setPatients(pts.filter(Boolean) as PatientResponse[]);
      })
      .catch(() => {
        // fallback: list patients with Needs Outreach status
        screening.listPatients({ status: "Needs Outreach", limit: 20 })
          .then(setPatients)
          .catch(() => onToast("Could not load outreach queue"));
      })
      .finally(() => setLoading(false));
  }, [onToast]);

  const resolve = async (p: PatientResponse) => {
    try {
      await screening.updatePatientStatus(p.id, "Under Review");
      setPatients(prev => prev.filter(x => x.id !== p.id));
      onToast("✓ Patient marked as contacted");
    } catch { onToast("Could not update patient"); }
  };

  const getUrgency = (p: PatientResponse): "high" | "medium" => {
    const cat = p.bp_readings?.[0]?.category ?? "";
    return cat === "Hypertensive Crisis" ? "high" : "medium";
  };

  const getBp = (p: PatientResponse) => {
    const r = p.bp_readings?.[0];
    return r ? `${r.systolic}/${r.diastolic} mmHg` : "—";
  };

  const getCatLabel = (p: PatientResponse) => {
    const cat = p.bp_readings?.[0]?.category ?? "Unknown";
    if (cat === "Hypertensive Crisis") return "Crisis";
    if (cat === "Stage 2 Hypertension") return "Stage 2";
    if (cat === "Stage 1 Hypertension") return "Stage 1";
    return cat;
  };

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>Needs Outreach</div>
        <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>
          Patients with no response to medication reminders — requires CHW contact
        </div>
      </div>

      <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
        <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
          <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>Priority Outreach Queue</span>
          <span style={{ fontSize: ".72rem", color: loading ? "var(--gray)" : "var(--red)" }}>
            {loading ? "Loading…" : `${patients.length} patients flagged`}
          </span>
        </div>

        <div style={{ padding: 18 }}>
          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--gray)", fontSize: ".88rem" }}>Loading…</div>
          ) : patients.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--gray)" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>✅</div>
              <p style={{ fontSize: ".88rem" }}>All outreach cases resolved. Great work!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {patients.map(p => {
                const urgency = getUrgency(p);
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3.5"
                    style={{
                      background: "var(--white)",
                      border: "1px solid var(--red-mist)",
                      borderLeft: `3px solid ${urgency === "high" ? "var(--red)" : "var(--amber)"}`,
                      borderRadius: 3,
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: urgency === "high" ? "var(--red-pale)" : "var(--amber-bg)",
                        color: urgency === "high" ? "var(--red)" : "var(--amber)",
                        fontWeight: 600, fontSize: ".9rem",
                      }}
                    >
                      {p.first_name_or_alias.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: ".88rem", fontWeight: 500, color: "var(--ink)", marginBottom: 3 }}>
                        {p.first_name_or_alias} — {getBp(p)} · {getCatLabel(p)}
                      </div>
                      <div style={{ fontSize: ".73rem", color: "var(--gray)" }}>
                        Status: {p.status}
                        {p.referral_facility ? ` · Referred to ${p.referral_facility}` : ""}
                        {p.medication_name ? ` · Meds: ${p.medication_name}` : ""}
                      </div>
                    </div>
                    <span
                      className="flex-shrink-0"
                      style={{
                        fontFamily: "var(--font-jetbrains), monospace", fontSize: ".7rem", fontWeight: 500,
                        padding: "3px 8px", borderRadius: 2,
                        background: urgency === "high" ? "var(--red)" : "var(--amber-bg)",
                        color: urgency === "high" ? "white" : "var(--amber)",
                        border: urgency === "high" ? "none" : "1px solid var(--amber-border)",
                      }}
                    >
                      {getCatLabel(p)}
                    </span>
                    <button
                      onClick={() => resolve(p)}
                      className="flex-shrink-0"
                      style={{ fontSize: ".78rem", fontWeight: 500, color: "var(--red)", padding: "6px 14px", border: "1px solid var(--red-mist)", borderRadius: 3, cursor: "pointer", background: "none", fontFamily: "inherit" }}
                      onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red)"; b.style.color = "white"; }}
                      onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--red)"; }}
                    >
                      Mark Contacted
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
