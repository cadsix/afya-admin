"use client";

import { useState, useEffect } from "react";
import { events, ScreeningEventResponse } from "@/lib/api";

interface EventsViewProps {
  onToast: (msg: string) => void;
  onNewEvent: () => void;
}

export default function EventsView({ onToast, onNewEvent }: EventsViewProps) {
  const [data, setData] = useState<ScreeningEventResponse[]>([]);
  const [summaries, setSummaries] = useState<Record<number, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    events.list()
      .then(async (evs) => {
        setData(evs);
        const map: Record<number, Record<string, unknown>> = {};
        await Promise.all(evs.map(async ev => {
          try { map[ev.id] = await events.getSummary(ev.id); } catch { /* skip */ }
        }));
        setSummaries(map);
      })
      .catch(() => onToast("Could not load events"))
      .finally(() => setLoading(false));
  }, [onToast]);

  const thStyle = { textAlign: "left" as const, padding: "9px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".57rem", letterSpacing: ".12em", textTransform: "uppercase" as const, color: "var(--gray)", borderBottom: "1px solid var(--gray-lt)", background: "var(--gray-xlt)" };
  const tdBase = { padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" };

  return (
    <div>
      <div className="flex justify-between items-start" style={{ marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>Screening Events</div>
          <div style={{ fontSize: ".76rem", color: "var(--gray)", marginTop: 3 }}>All events under Ho Municipal Health Directorate</div>
        </div>
        <button
          onClick={onNewEvent}
          style={{ background: "var(--red)", color: "white", border: "1px solid var(--red)", fontSize: ".78rem", fontWeight: 500, padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "var(--red-deep)"; }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "var(--red)"; }}
        >+ New Event</button>
      </div>

      <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Event","Date","Location","Screened","High BP","Referrals","WA Sent","Status","Action"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ ...tdBase, textAlign: "center", fontSize: ".8rem", color: "var(--gray)" }}>Loading…</td></tr>
              ) : data.map(ev => {
                const s = summaries[ev.id] ?? {};
                const screened  = (s.total_screened as number) ?? 0;
                const highBp    = (s.high_bp_count as number) ?? 0;
                const refs      = (s.referral_count as number) ?? 0;
                const waSent    = (s.messages_sent as number) ?? screened;
                const isLive    = !ev.is_closed;

                return (
                  <tr
                    key={ev.id}
                    onMouseEnter={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)"))}
                    onMouseLeave={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = ""))}
                  >
                    <td style={{ ...tdBase, fontWeight: 500, fontSize: ".81rem", color: "var(--ink-mid)" }}>{ev.name}</td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".75rem", color: "var(--ink-mid)" }}>
                      {new Date(ev.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ ...tdBase, fontSize: ".81rem", color: "var(--ink-mid)" }}>{ev.location}</td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".81rem", color: "var(--ink-mid)" }}>{screened}</td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".81rem", color: "var(--red)" }}>{highBp}</td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".81rem", color: "var(--ink-mid)" }}>{refs}</td>
                    <td style={{ ...tdBase, fontFamily: "var(--font-jetbrains), monospace", fontSize: ".81rem", color: "var(--green)" }}>{waSent}</td>
                    <td style={tdBase}>
                      {isLive
                        ? <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".6rem", padding: "2px 7px", borderRadius: 2, background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-border)" }}>● Live</span>
                        : <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".6rem", padding: "2px 7px", borderRadius: 2, background: "var(--gray-xlt)", color: "var(--gray)" }}>Closed</span>
                      }
                    </td>
                    <td style={tdBase}>
                      <button
                        onClick={() => onToast(isLive ? "Event details opened" : "Event report downloaded")}
                        style={{ fontSize: ".7rem", padding: "4px 10px", borderRadius: 2, color: "var(--gray)", border: "1px solid transparent", cursor: "pointer", background: "none", fontFamily: "inherit" }}
                        onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red-pale)"; b.style.color = "var(--red)"; b.style.borderColor = "var(--red-mist)"; }}
                        onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--gray)"; b.style.borderColor = "transparent"; }}
                      >{isLive ? "View" : "Report ↓"}</button>
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
