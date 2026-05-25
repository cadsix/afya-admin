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
    <>
      <Topbar onToast={showToast} onNewEvent={handleNewEvent} />

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "220px 1fr", overflow: "hidden" }}>
        <Sidebar activeView={activeView} onSwitch={setActiveView} onToast={showToast} />

        <main style={{ overflowY: "auto", padding: 24 }}>
          {activeView === "overview"  && <OverviewView  onToast={showToast} />}
          {activeView === "events"    && <EventsView    onToast={showToast} onNewEvent={handleNewEvent} />}
          {activeView === "patients"  && <PatientsView  onToast={showToast} />}
          {activeView === "referrals" && <ReferralsView onToast={showToast} />}
          {activeView === "adherence" && <AdherenceView />}
          {activeView === "outreach"  && <OutreachView  onToast={showToast} />}
        </main>
      </div>

      <Toast message={toastMsg} visible={toastVisible} />
    </>
  );
}
