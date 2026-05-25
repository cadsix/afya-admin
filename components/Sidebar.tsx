"use client";

type View = "overview" | "events" | "patients" | "referrals" | "adherence" | "outreach";

interface SidebarProps {
  activeView: View;
  onSwitch: (view: View) => void;
  onToast: (msg: string) => void;
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  view?: View;
  label: string;
  icon: string;
  badge?: number;
  action?: () => void;
}

export default function Sidebar({ activeView, onSwitch, onToast, open, onClose }: SidebarProps) {
  const overviewItems: NavItem[] = [
    { view: "overview",  label: "Dashboard",          icon: "📊" },
    { view: "events",    label: "Screening Events",    icon: "🗺" },
    { view: "patients",  label: "All Patients",        icon: "👥" },
  ];
  const programmeItems: NavItem[] = [
    { view: "referrals", label: "Referral Tracking",   icon: "🔁" },
    { view: "adherence", label: "Adherence Programme", icon: "💊" },
    { view: "outreach",  label: "Needs Outreach",      icon: "🚨", badge: 3 },
  ];
  const reportItems: NavItem[] = [
    { label: "Export Reports", icon: "📄", action: () => onToast("Generating report...") },
    { label: "Message Logs",   icon: "📨", action: () => onToast("Message log opened") },
  ];

  const handleSwitch = (view: View) => {
    onSwitch(view);
    onClose(); // close drawer on mobile after nav
  };

  const Item = ({ item }: { item: NavItem }) => {
    const isActive = item.view && activeView === item.view;
    return (
      <div
        onClick={() => item.view ? handleSwitch(item.view) : item.action?.()}
        className="flex items-center gap-2.5 cursor-pointer transition-all"
        style={{
          padding: "9px 18px",
          fontSize: ".83rem",
          color: isActive ? "var(--red)" : "var(--ink-mid)",
          background: isActive ? "var(--red-pale)" : "transparent",
          borderLeft: isActive ? "2px solid var(--red)" : "2px solid transparent",
          fontWeight: isActive ? 500 : 400,
        }}
        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "var(--gray-xlt)"; }}
        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
      >
        <span style={{ fontSize: ".95rem", width: 18, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
        {item.label}
        {item.badge && (
          <span className="ml-auto" style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".6rem", background: "var(--red)", color: "white", padding: "1px 5px", borderRadius: 10 }}>
            {item.badge}
          </span>
        )}
      </div>
    );
  };

  const Section = ({ label }: { label: string }) => (
    <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gray)", padding: "12px 18px 4px" }}>
      {label}
    </div>
  );

  const sidebarContent = (
    <aside
      className="overflow-y-auto h-full"
      style={{ width: 220, background: "var(--white)", borderRight: "1px solid var(--gray-lt)" }}
    >
      <div style={{ padding: 18, borderBottom: "1px solid var(--gray-lt)" }}>
        <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>Programme Admin</div>
        <div style={{ fontSize: ".7rem", color: "var(--gray)" }}>Ho Municipal Health Directorate</div>
      </div>
      <Section label="Overview" />
      {overviewItems.map(i => <Item key={i.label} item={i} />)}
      <Section label="Programmes" />
      {programmeItems.map(i => <Item key={i.label} item={i} />)}
      <Section label="Reports" />
      {reportItems.map(i => <Item key={i.label} item={i} />)}
    </aside>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden md:block h-full">
        {sidebarContent}
      </div>

      {/* Mobile: overlay drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 flex"
          onClick={onClose}
        >
          <div onClick={e => e.stopPropagation()} className="h-full">
            {sidebarContent}
          </div>
          {/* dim overlay */}
          <div className="flex-1" style={{ background: "rgba(15,13,14,0.4)" }} />
        </div>
      )}
    </>
  );
}
