"use client";

export default function FollowUpDonutCard() {
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, overflow: "hidden" }}>
      <div className="flex justify-between items-center" style={{ padding: "13px 18px", borderBottom: "1px solid var(--gray-lt)" }}>
        <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>Follow-up Conversion</span>
        <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>Last 30 days · 19 referrals</span>
      </div>
      <div style={{ padding: 18 }}>
        <div className="flex flex-col items-center gap-3.5" style={{ paddingTop: 4, paddingBottom: 4 }}>
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="50" fill="none" stroke="var(--gray-xlt)" strokeWidth="14" />
            <circle cx="65" cy="65" r="50" fill="none" stroke="var(--green)" strokeWidth="14"
              strokeDasharray="182 314" strokeDashoffset="78" strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1.2s ease" }} />
            <circle cx="65" cy="65" r="50" fill="none" stroke="var(--amber)" strokeWidth="14"
              strokeDasharray="83 314" strokeDashoffset="-104" strokeLinecap="round" />
            <circle cx="65" cy="65" r="50" fill="none" stroke="var(--red)" strokeWidth="14"
              strokeDasharray="49 314" strokeDashoffset="-187" strokeLinecap="round" />
            <text x="65" y="68" textAnchor="middle" fontFamily="var(--font-cormorant), serif" fontSize="22" fontWeight="700" fill="var(--ink)">58%</text>
            <text x="65" y="80" textAnchor="middle" fontFamily="var(--font-jetbrains), monospace" fontSize="7" fill="var(--gray)">ATTENDED</text>
          </svg>
          <div className="flex flex-col gap-2 w-full">
            {[
              { color: "var(--green)", label: "Attended clinic", val: 11 },
              { color: "var(--amber)", label: "Pending (≤14 days)", val: 5 },
              { color: "var(--red)", label: "Missed / No response", val: 3 },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
                <div style={{ fontSize: ".75rem", color: "var(--ink-mid)", flex: 1 }}>{row.label}</div>
                <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".75rem", fontWeight: 500, color: "var(--ink)" }}>{row.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
