"use client";

interface TopbarProps {
  onToast: (msg: string) => void;
  onNewEvent: () => void;
}

export default function Topbar({ onToast, onNewEvent }: TopbarProps) {
  return (
    <div
      className="flex items-center justify-between px-6 flex-shrink-0 z-10"
      style={{ height: 56, background: "var(--white)", borderBottom: "1px solid var(--gray-lt)" }}
    >
      <div className="flex items-center gap-1.5" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)" }}>
        <div className="logo-dot-anim rounded-full" style={{ width: 7, height: 7, background: "var(--red)" }} />
        Afya Admin
      </div>
      <div className="flex items-center gap-3">
        <span style={{ fontSize: ".78rem", color: "var(--gray)" }}>Ho Municipal · May 2026</span>
        <div style={{ width: 1, height: 24, background: "var(--gray-lt)" }} />
        <button
          onClick={() => onToast("CSV exported")}
          className="transition-all"
          style={{ fontSize: ".78rem", fontWeight: 400, padding: "6px 14px", borderRadius: 3, border: "1px solid var(--gray-lt)", color: "var(--ink-mid)", cursor: "pointer", background: "none", fontFamily: "inherit" }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--red)"; (e.target as HTMLButtonElement).style.color = "var(--red)"; }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--gray-lt)"; (e.target as HTMLButtonElement).style.color = "var(--ink-mid)"; }}
        >Export CSV ↓</button>
        <button
          onClick={() => onToast("PDF exported")}
          className="transition-all"
          style={{ fontSize: ".78rem", fontWeight: 400, padding: "6px 14px", borderRadius: 3, border: "1px solid var(--gray-lt)", color: "var(--ink-mid)", cursor: "pointer", background: "none", fontFamily: "inherit" }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--red)"; (e.target as HTMLButtonElement).style.color = "var(--red)"; }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--gray-lt)"; (e.target as HTMLButtonElement).style.color = "var(--ink-mid)"; }}
        >Export PDF ↓</button>
        <button
          onClick={onNewEvent}
          style={{ background: "var(--red)", color: "white", border: "1px solid var(--red)", fontSize: ".78rem", fontWeight: 500, padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "var(--red-deep)"; }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "var(--red)"; }}
        >+ New Event</button>
        <div style={{ width: 1, height: 24, background: "var(--gray-lt)" }} />
        <a
          href="#"
          style={{ fontSize: ".78rem", color: "var(--gray)", padding: "6px 12px", border: "1px solid var(--gray-lt)", borderRadius: 3, textDecoration: "none" }}
          onMouseEnter={e => { (e.target as HTMLAnchorElement).style.borderColor = "var(--red)"; (e.target as HTMLAnchorElement).style.color = "var(--red)"; }}
          onMouseLeave={e => { (e.target as HTMLAnchorElement).style.borderColor = "var(--gray-lt)"; (e.target as HTMLAnchorElement).style.color = "var(--gray)"; }}
        >← Overview</a>
      </div>
    </div>
  );
}
