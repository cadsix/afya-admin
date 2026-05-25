"use client";

import { useState, useCallback, useEffect } from "react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import OverviewView from "@/components/views/OverviewView";
import EventsView from "@/components/views/EventsView";
import PatientsView from "@/components/views/PatientsView";
import ReferralsView from "@/components/views/ReferralsView";
import AdherenceView from "@/components/views/AdherenceView";
import OutreachView from "@/components/views/OutreachView";

type View = "overview" | "events" | "patients" | "referrals" | "adherence" | "outreach";

export default function AdminPage() {
  const [activeView, setActiveView] = useState<View>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    if (toastVisible) {
      const t = setTimeout(() => setToastVisible(false), 2800);
      return () => clearTimeout(t);
    }
  }, [toastVisible, toastMsg]);

  const handleNewEvent = () => showToast("New event form — coming in next build");

  return (
    <div className="flex flex-col" style={{ height: "100dvh", overflow: "hidden" }}>
      <Topbar
        onToast={showToast}
        onNewEvent={handleNewEvent}
        onMenuToggle={() => setSidebarOpen(o => !o)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onSwitch={setActiveView}
          onToast={showToast}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto" style={{ padding: "16px 16px", minWidth: 0 }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            {activeView === "overview"  && <OverviewView  onToast={showToast} />}
            {activeView === "events"    && <EventsView    onToast={showToast} onNewEvent={handleNewEvent} />}
            {activeView === "patients"  && <PatientsView  onToast={showToast} />}
            {activeView === "referrals" && <ReferralsView onToast={showToast} />}
            {activeView === "adherence" && <AdherenceView />}
            {activeView === "outreach"  && <OutreachView  onToast={showToast} />}
          </div>
        </main>
      </div>

      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
