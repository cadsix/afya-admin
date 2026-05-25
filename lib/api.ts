const BASE = "https://afya-backend-vepd.onrender.com/api/v1";

// ── Auth token helpers ────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("afya_token");
}

export function setToken(token: string) {
  localStorage.setItem("afya_token", token);
}

export function clearToken() {
  localStorage.removeItem("afya_token");
}

// ── Base fetch wrapper ────────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  // 204 / empty body
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Token { access_token: string; token_type: string }
export interface UserResponse {
  id: number; email: string; full_name: string; role: string;
  is_active: boolean; facility_id: number | null; created_at: string;
}
export interface BPReadingResponse {
  id: number; patient_id: number; systolic: number; diastolic: number;
  category: string; reading_type: string; recorded_at: string;
}
export interface PrescribedMedicationResponse {
  id: number; patient_id: number; drug_name: string;
  dose: string | null; frequency: string | null;
  reminder_time: string; created_at: string;
}
export interface PatientResponse {
  id: number; first_name_or_alias: string; whatsapp_number: string;
  age_range: string; gender: string | null; status: string;
  is_enrolled_in_adherence: boolean; screening_event_id: number | null;
  facility_id: number | null; bp_readings: BPReadingResponse[];
  prescriptions: PrescribedMedicationResponse[];
  created_at: string; medication_name: string | null;
  referral_facility: string | null; arrived_at: string | null;
  diagnosis: string | null; nhis_number: string | null;
}
export interface AdherenceLogResponse {
  id: number; patient_id: number; status_logged: string;
  confirmed_at: string; notes: string | null;
}
export interface PatientAdherenceResponse {
  patient_id: number; adherence_rate: number;
  last_7_days: string[]; logs: AdherenceLogResponse[];
}
export interface ScreeningEventResponse {
  id: number; name: string; location: string;
  partner_organization: string | null; date: string;
  is_closed: boolean; created_at: string;
}
export interface FacilityResponse {
  id: number; name: string; address: string | null;
  region: string | null; contact_number: string | null; created_at: string;
}
export interface MessageLogResponse {
  id: number; patient_id: number; sender: string;
  message_body: string; timestamp: string; status: string;
}
export interface MessageTemplateResponse {
  id: number; template_type: string; content: string;
  is_active: boolean; version: number; updated_at: string;
}

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = {
  login: (username: string, password: string) => {
    const body = new URLSearchParams({ username, password });
    return request<Token>("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }, false);
  },
  me: () => request<UserResponse>("/users/me"),
  list: () => request<UserResponse[]>("/users/"),
  deactivate: (userId: number) =>
    request<UserResponse>(`/users/${userId}/deactivate`, { method: "PATCH" }),
  register: (data: { email: string; full_name: string; password: string; role?: string }) =>
    request<UserResponse>("/users/register", { method: "POST", body: JSON.stringify(data) }, false),
};

// ── Screening / Patients ──────────────────────────────────────────────────────
export const screening = {
  listPatients: (params?: {
    skip?: number; limit?: number; status?: string;
    event_id?: number; search?: string; enrolled?: boolean; facility_id?: number;
  }) => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) q.set(k, String(v));
      });
    }
    return request<PatientResponse[]>(`/screening/patients?${q}`);
  },
  getPatient: (id: number) => request<PatientResponse>(`/screening/patients/${id}`),
  getPatientAdherence: (id: number) =>
    request<PatientAdherenceResponse>(`/screening/patients/${id}/adherence`),
  getPatientBpReadings: (id: number) =>
    request<BPReadingResponse[]>(`/screening/patients/${id}/bp-readings`),
  getPatientMessages: (id: number) =>
    request<MessageLogResponse[]>(`/screening/patients/${id}/messages`),
  updatePatientStatus: (id: number, status: string) =>
    request<PatientResponse>(`/screening/patients/${id}/status`, {
      method: "PATCH", body: JSON.stringify({ status }),
    }),
  markReferralSeen: (id: number) =>
    request<PatientResponse>(`/screening/patients/${id}/referral/mark-seen`, { method: "PATCH" }),
  startTreatment: (id: number, data: { prescriptions?: { drug_name: string; dose?: string; frequency?: string }[]; preferred_reminder_time?: string }) =>
    request<PatientResponse>(`/screening/patients/${id}/treatment/start`, {
      method: "POST", body: JSON.stringify(data),
    }),
  registerParticipant: (data: unknown) =>
    request<PatientResponse>("/screening/register", { method: "POST", body: JSON.stringify(data) }),
};

// ── Events ────────────────────────────────────────────────────────────────────
export const events = {
  list: () => request<ScreeningEventResponse[]>("/events/"),
  get: (id: number) => request<ScreeningEventResponse>(`/events/${id}`),
  create: (data: { name: string; location: string; partner_organization?: string }) =>
    request<ScreeningEventResponse>("/events/", { method: "POST", body: JSON.stringify(data) }),
  close: (id: number) =>
    request<ScreeningEventResponse>(`/events/${id}/close`, { method: "PUT" }),
  getPatients: (id: number) => request<PatientResponse[]>(`/events/${id}/patients`),
  getSummary: (id: number) => request<Record<string, unknown>>(`/events/${id}/summary`),
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const analytics = {
  summary: (facility_id?: number) => {
    const q = facility_id ? `?facility_id=${facility_id}` : "";
    return request<Record<string, unknown>>(`/analytics/summary${q}`);
  },
  adherence: (facility_id?: number) => {
    const q = facility_id ? `?facility_id=${facility_id}` : "";
    return request<Record<string, unknown>>(`/analytics/adherence${q}`);
  },
  referrals: () => request<Record<string, unknown>>("/analytics/referrals"),
  needsOutreach: () => request<Record<string, unknown>[]>("/analytics/needs-outreach"),
  timeline: (period?: "7d" | "30d" | "90d") => {
    const q = period ? `?period=${period}` : "";
    return request<Record<string, unknown>>(`/analytics/timeline${q}`);
  },
  exportCsv: () =>
    request<string>("/analytics/export-csv", {
      headers: { "Content-Type": "text/plain" },
    }),
};

// ── Facilities ────────────────────────────────────────────────────────────────
export const facilities = {
  list: () => request<FacilityResponse[]>("/facilities/"),
  get: (id: number) => request<FacilityResponse>(`/facilities/${id}`),
  create: (data: { name: string; address?: string; region?: string; contact_number?: string }) =>
    request<FacilityResponse>("/facilities/", { method: "POST", body: JSON.stringify(data) }),
  getReferrals: (id: number) => request<PatientResponse[]>(`/facilities/${id}/referrals`),
  getAdherence: (id: number) =>
    request<Record<string, unknown>[]>(`/facilities/${id}/adherence`),
};

// ── Templates ─────────────────────────────────────────────────────────────────
export const templates = {
  list: () => request<MessageTemplateResponse[]>("/templates/"),
  get: (id: number) => request<MessageTemplateResponse>(`/templates/${id}`),
  create: (data: { template_type: string; content: string; is_active?: boolean }) =>
    request<MessageTemplateResponse>("/templates/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: { template_type: string; content: string; is_active?: boolean }) =>
    request<MessageTemplateResponse>(`/templates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};
