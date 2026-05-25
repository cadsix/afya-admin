"use client";

interface KpiCardProps {
  icon: string;
  label: string;
  value: string | number;
  delta: string;
  deltaType: "up" | "dn" | "neutral";
  valueRed?: boolean;
}

const deltaStyles = {
  up: { background: "var(--green-bg)", color: "var(--green)" },
  dn: { background: "var(--red-pale)", color: "var(--red)" },
  neutral: { background: "var(--gray-xlt)", color: "var(--gray)" },
};

export default function KpiCard({ icon, label, value, delta, deltaType, valueRed }: KpiCardProps) {
  return (
    <div
      className="relative overflow-hidden group transition-all"
      style={{ background: "var(--white)", border: "1px solid var(--gray-lt)", borderRadius: 4, padding: "18px" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--red-mist)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--gray-lt)"; }}
    >
      <div
        className="absolute top-0 left-0 right-0 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
        style={{ height: 2, background: "var(--red)" }}
      />
      <div className="absolute" style={{ right: 14, top: 16, fontSize: "1.3rem", opacity: .12 }}>{icon}</div>
      <div style={{ fontSize: ".72rem", color: "var(--gray)", marginBottom: 7 }}>{label}</div>
      <div
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "2.4rem",
          fontWeight: 700,
          color: valueRed ? "var(--red)" : "var(--ink)",
          lineHeight: 1,
          marginBottom: 7,
        }}
      >
        {value}
      </div>
      <span
        className="inline-flex items-center gap-1"
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: ".65rem",
          padding: "2px 7px",
          borderRadius: 2,
          ...deltaStyles[deltaType],
        }}
      >
        {delta}
      </span>
    </div>
  );
}
