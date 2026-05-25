"use client";

interface EventsViewProps {
  onToast: (msg: string) => void;
  onNewEvent: () => void;
}

const events = [
  { name: "Kpando Market Screening",    date: "18 May 2026", location: "Kpando, Ho Municipal",    screened: 47,  highBp: 8,  refs: 8,  waSent: 47,  status: "live" as const },
  { name: "Hohoe Community Health Day", date: "10 May 2026", location: "Hohoe, Volta Region",      screened: 112, highBp: 23, refs: 23, waSent: 112, status: "closed" as const },
  { name: "Ho Central Market Screening",date: "02 May 2026", location: "Ho Central, Volta Region", screened: 88,  highBp: 19, refs: 19, waSent: 88,  status: "closed" as const },
];

export default function EventsView({ onToast, onNewEvent }: EventsViewProps) {
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
                  <th key={h} style={{ textAlign: "left", padding: "9px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".57rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gray)", borderBottom: "1px solid var(--gray-lt)", background: "var(--gray-xlt)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr
                  key={ev.name}
                  onMouseEnter={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = "var(--red-pale)"))}
                  onMouseLeave={e => Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c => (c.style.background = ""))}
                >
                  <td style={{ padding: "11px 13px", fontWeight: 500, fontSize: ".81rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{ev.name}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".75rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{ev.date}</td>
                  <td style={{ padding: "11px 13px", fontSize: ".81rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{ev.location}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".81rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{ev.screened}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".81rem", color: "var(--red)", borderBottom: "1px solid var(--gray-xlt)" }}>{ev.highBp}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".81rem", color: "var(--ink-mid)", borderBottom: "1px solid var(--gray-xlt)" }}>{ev.refs}</td>
                  <td style={{ padding: "11px 13px", fontFamily: "var(--font-jetbrains), monospace", fontSize: ".81rem", color: "var(--green)", borderBottom: "1px solid var(--gray-xlt)" }}>{ev.waSent}</td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    {ev.status === "live" ? (
                      <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".6rem", padding: "2px 7px", borderRadius: 2, background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-border)" }}>● Live</span>
                    ) : (
                      <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".6rem", padding: "2px 7px", borderRadius: 2, background: "var(--gray-xlt)", color: "var(--gray)" }}>Closed</span>
                    )}
                  </td>
                  <td style={{ padding: "11px 13px", borderBottom: "1px solid var(--gray-xlt)" }}>
                    <button
                      onClick={() => onToast(ev.status === "live" ? "Event details opened" : "Event report downloaded")}
                      style={{ fontSize: ".7rem", padding: "4px 10px", borderRadius: 2, color: "var(--gray)", border: "1px solid transparent", cursor: "pointer", background: "none", fontFamily: "inherit" }}
                      onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = "var(--red-pale)"; b.style.color = "var(--red)"; b.style.borderColor = "var(--red-mist)"; }}
                      onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = "none"; b.style.color = "var(--gray)"; b.style.borderColor = "transparent"; }}
                    >{ev.status === "live" ? "View" : "Report ↓"}</button>
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
