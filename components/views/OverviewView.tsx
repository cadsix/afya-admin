"use client";

import { useState, useEffect } from "react";
import KpiCard from "../KpiCard";
import BpDistributionCard from "../BpDistributionCard";
import FollowUpDonutCard from "../FollowUpDonutCard";
import AdherenceTable from "../AdherenceTable";
import { analytics } from "@/lib/api";

interface OverviewViewProps {
  onToast: (msg: string) => void;
}

type FilterPeriod = "today" | "week" | "month";

interface DashSummary {
  total_screened?: number;
  messages_sent?: number;
  total_referrals?: number;
  adherence_rate?: number;
  bp_distribution?: Record<string, number>;
}

export default function OverviewView({ onToast }: OverviewViewProps) {
  const [filter, setFilter] = useState<FilterPeriod>("today");
  const [summary, setSummary] = useState<DashSummary>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analytics.summary()
      .then(data => setSummary(data as DashSummary))
      .catch(() => onToast("Could not load dashboard summary"))
      .finally(() => setLoading(false));
  }, [onToast]);

  const screened = summary.total_screened ?? 0;
  const msgs     = summary.messages_sent ?? screened;
  const refs     = summary.total_referrals ?? 0;
  const adh      = summary.adherence_rate != null ? Math.round(summary.adherence_rate * 100) : 0;

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-wrap justify-between items-start gap-3" style={{ marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>Programme Overview</div>
          <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>Ho Municipal Health Directorate</div>
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

      {/* KPI row — 2 cols mobile, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginBottom: 16 }}>
        <KpiCard icon="🩺" label="Total Screened"   value={loading ? "…" : screened} delta="↑ 12 vs last event"  deltaType="up" />
        <KpiCard icon="📨" label="WA Messages Sent" value={loading ? "…" : msgs}     delta="99.1% delivery rate" deltaType="up" />
        <KpiCard icon="🏥" label="Referrals Issued" value={loading ? "…" : refs}     delta="8 pending follow-up" deltaType="dn" valueRed />
        <KpiCard icon="💊" label="Adherence Rate"   value={loading ? "…" : `${adh}%`} delta="↑ 4% this week"   deltaType="up" />
      </div>

      {/* Charts — stacked mobile, side-by-side desktop */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-3.5" style={{ marginBottom: 14 }}>
        <BpDistributionCard bpDistribution={summary.bp_distribution} />
        <FollowUpDonutCard />
      </div>

      <AdherenceTable onToast={onToast} />
    </div>
  );
}
