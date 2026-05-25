"use client";

import { useState } from "react";

interface OutreachViewProps {
  onToast: (msg: string) => void;
}

interface OutreachPatient {
  id: string;
  initial: string;
  name: string;
  bp: string;
  stage: string;
  detail: string;
  dayLabel: string;
  urgency: "high" | "medium";
}

const initialPatients: OutreachPatient[] = [
  {
    id: "yaw",
    initial: "Y",
    name: "Yaw P.",
    bp: "138/88 mmHg · Stage 1",
    stage: "stage1",
    detail: "Day 7 · 0% this week · Ho Municipal Hosp. referral pending · 3 WA attempts",
    dayLabel: "Day 7",
    urgency: "high",
  },
  {
    id: "kofi",
    initial: "K",
    name: "Kofi M.",
    bp: "134/82 mmHg · Stage 1",
    stage: "stage1",
    detail: "Day 3 no reply · 28% this week · 2 WA attempts",
    dayLabel: "Day 3",
    urgency: "medium",
  },
  {
    id: "adjoa",
    initial: "A",
    name: "Adjoa K.",
    bp: "144/91 mmHg · Stage 2",
    stage: "stage2",
    detail: "Day 5 no reply · 0% this week · 2 WA attempts · Kpando Gov Hosp referral pending",
    dayLabel: "Day 5",
    urgency: "medium",
  },
];

export default function OutreachView({ onToast }: OutreachViewProps) {
  const [patients, setPatients] = useState(initialPatients);

  const resolve = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    onToast("✓ Patient marked as contacted");
  };

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>Needs Outreach</div>
        <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>Patients with 7+ days of no response — requires CHW contact</div>
      </div>
      <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
        <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
          <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>Priority Outreach Queue</span>
          <span style={{ fontSize: ".72rem", color: "var(--red)" }}>{patients.length} patients flagged</span>
        </div>
        <div style={{ padding: 18 }}>
          {patients.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--gray)" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>✅</div>
              <p style={{ fontSize: ".88rem" }}>All outreach cases resolved. Great work!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {patients.map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-3.5"
                  style={{
                    background: "var(--white)",
                    border: "1px solid var(--red-mist)",
                    borderLeft: `3px solid ${p.urgency === "high" ? "var(--red)" : "var(--amber)"}`,
                    borderRadius: 3,
                    padding: "16px 18px",
                  }}
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: p.urgency === "high" ? "var(--red-pale)" : "var(--amber-bg)",
                      color: p.urgency === "high" ? "var(--red)" : "var(--amber)",
                      fontWeight: 600, fontSize: ".9rem",
                    }}
                  >
                    {p.initial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: ".88rem", fontWeight: 500, color: "var(--ink)", marginBottom: 3 }}>{p.name} — {p.bp}</div>
                    <div style={{ fontSize: ".73rem", color: "var(--gray)" }}>{p.detail}</div>
                  </div>
                  <span
                    className="flex-shrink-0"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace", fontSize: ".7rem", fontWeight: 500,
                      padding: "3px 8px", borderRadius: 2,
                      background: p.urgency === "high" ? "var(--red)" : "var(--amber-bg)",
                      color: p.urgency === "high" ? "white" : "var(--amber)",
                      border: p.urgency === "high" ? "none" : "1px solid var(--amber-border)",
                    }}
                  >
                    {p.dayLabel}
                  </span>
                  <button
                    onClick={() => resolve(p.id)}
                    className="flex-shrink-0 transition-all"
                    style={{ fontSize: ".78rem", fontWeight: 500, color: "var(--red)", padding: "6px 14px", border: "1px solid var(--red-mist)", borderRadius: 3, cursor: "pointer", background: "none", fontFamily: "inherit" }}
                    onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red)"; b.style.color = "white"; }}
                    onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--red)"; }}
                  >
                    Mark Contacted
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
