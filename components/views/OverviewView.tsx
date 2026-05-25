"use client";

import { useState } from "react";
import KpiCard from "../KpiCard";
import BpDistributionCard from "../BpDistributionCard";
import FollowUpDonutCard from "../FollowUpDonutCard";
import AdherenceTable from "../AdherenceTable";

interface OverviewViewProps {
  onToast: (msg: string) => void;
}

type FilterPeriod = "today" | "week" | "month";

const filterData: Record<FilterPeriod, { screened: number; msgs: number; refs: number; adh: number }> = {
  today: { screened: 47, msgs: 47, refs: 19, adh: 78 },
  week:  { screened: 247, msgs: 247, refs: 62, adh: 74 },
  month: { screened: 712, msgs: 712, refs: 148, adh: 71 },
};

export default function OverviewView({ onToast }: OverviewViewProps) {
  const [filter, setFilter] = useState<FilterPeriod>("today");
  const d = filterData[filter];

  return (
    <div>
      <div className="flex justify-between items-start" style={{ marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>Programme Overview</div>
          <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>Kpando Market Screening · 18 May 2026 · Ho Municipal</div>
        </div>
        <div className="flex gap-1.5">
          {(["today","week","month"] as FilterPeriod[]).map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              style={{
                fontSize: ".7rem", padding: "4px 10px", borderRadius: 2, cursor: "pointer", fontFamily: "inherit",
                background: filter === p ? "var(--red-pale)" : "none",
                color: filter === p ? "var(--red)" : "var(--gray)",
                border: filter === p ? "1px solid var(--red-mist)" : "1px solid transparent",
              }}
            >
              {p === "today" ? "Today" : p === "week" ? "This Week" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3" style={{ marginBottom: 16 }}>
        <KpiCard icon="🩺" label="Total Screened"    value={d.screened} delta="↑ 12 vs last event"  deltaType="up" />
        <KpiCard icon="📨" label="WA Messages Sent"  value={d.msgs}     delta="99.1% delivery rate" deltaType="up" />
        <KpiCard icon="🏥" label="Referrals Issued"  value={d.refs}     delta="8 pending follow-up" deltaType="dn" valueRed />
        <KpiCard icon="💊" label="Adherence Rate"    value={`${d.adh}%`} delta="↑ 4% this week"    deltaType="up" />
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 320px", marginBottom: 14 }}>
        <BpDistributionCard />
        <FollowUpDonutCard />
      </div>

      <AdherenceTable onToast={onToast} />
    </div>
  );
}
