"use client";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 999,
        background: "var(--green)",
        color: "white",
        padding: "11px 18px",
        borderRadius: 4,
        fontSize: ".83rem",
        fontWeight: 500,
        transform: visible ? "translateY(0)" : "translateY(60px)",
        opacity: visible ? 1 : 0,
        transition: "all .3s",
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}
