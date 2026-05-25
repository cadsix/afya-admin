# Afya Platform — API Integration Reference

Base URL: `https://afya-backend-vepd.onrender.com/api/v1`

All authenticated endpoints require a Bearer token in the `Authorization` header.  
Token is obtained via `POST /users/login` and stored in `localStorage` as `afya_token`.

---

## Authentication

### POST `/users/login`
Get an access token.  
**Auth:** None  
**Body:** `application/x-www-form-urlencoded` — `username`, `password`  
**Returns:** `{ access_token, token_type }`  
**Used in:** `lib/api.ts → users.login()`

### POST `/users/register`
Register a new staff user (Admin, Program Manager, CHW/Operator).  
**Auth:** None  
**Body:** `{ email, full_name, password, role? }`  
**Returns:** `UserResponse`

### GET `/users/me`
Get the currently authenticated user's profile.  
**Auth:** Required  
**Returns:** `UserResponse`  
**Used in:** future profile/header component

### GET `/users/`
List all registered staff users. Super Admin only.  
**Auth:** Required  
**Returns:** `UserResponse[]`

### PATCH `/users/{user_id}/deactivate`
Disable a user account without deleting it.  
**Auth:** Required (Super Admin)  
**Returns:** `UserResponse`

### PATCH `/users/me/facility`
Set or update the facility mapping for the logged-in user.  
**Auth:** Required  
**Body:** `{ facility_id: number }`  
**Returns:** `UserResponse`

---

## Screening & Patients

### POST `/screening/register`
Register a new screening participant. Calculates BP category and queues a WhatsApp notification.  
**Auth:** None  
**Body:** `PatientCreate` (name, whatsapp_number, age_range, bp_reading required)  
**Returns:** `PatientResponse`

### POST `/screening/sync-offline`
Batch sync of offline-captured registrations from the Operator PWA.  
**Auth:** None  
**Body:** `PatientCreate[]`  
**Returns:** sync result object

### GET `/screening/patients`
List all patients with optional filters.  
**Auth:** None  
**Query params:** `skip`, `limit`, `status`, `event_id`, `search`, `enrolled`, `facility_id`  
**Returns:** `PatientResponse[]`  
**Used in:** `PatientsView`, `AdherenceTable`, `AdherenceView`, `ReferralsView`, `OutreachView`

### GET `/screening/patients/{patient_id}`
Full patient profile including all BP readings and prescriptions.  
**Auth:** None  
**Returns:** `PatientResponse`  
**Used in:** `OutreachView` (per-patient fetch from outreach queue)

### DELETE `/screening/patients/{patient_id}`
Soft-delete a patient (revokes consent, opts out of comms). Super Admin only.  
**Auth:** Required  
**Returns:** `{}`

### GET `/screening/patients/{patient_id}/bp-readings`
Full BP history for a patient, newest first.  
**Auth:** None  
**Returns:** `BPReadingResponse[]`

### GET `/screening/patients/{patient_id}/adherence`
Medication adherence details: rate, 7-day dot array, full log.  
**Auth:** None  
**Returns:** `PatientAdherenceResponse`  
**Used in:** `AdherenceTable`, `AdherenceView`

### PATCH `/screening/patients/{patient_id}/status`
Manually update a patient's status.  
**Auth:** None  
**Body:** `{ status: string }`  
Valid values: `Under Review`, `Referred`, `Diagnosed — On Medication`, `Diagnosed — No Medication`, `Needs Outreach`, `Opted Out`  
**Returns:** `PatientResponse`  
**Used in:** `OutreachView → Mark Contacted`

### POST `/screening/patients/{patient_id}/treatment/start`
Activate medication adherence reminders. Sends WhatsApp start message.  
**Auth:** None  
**Body:** `{ prescriptions?, prescription_instructions?, preferred_reminder_time? }`  
**Returns:** `PatientResponse`

### PATCH `/screening/patients/{patient_id}/prescription`
Replace existing prescriptions and notify patient via WhatsApp.  
**Auth:** None  
**Body:** `{ prescriptions: PrescribedMedicationCreate[] }`  
**Returns:** `PatientResponse`

### PATCH `/screening/patients/{patient_id}/referral/mark-seen`
Mark a referred patient as arrived at the facility. Stops referral reminders.  
**Auth:** None  
**Returns:** `PatientResponse`  
**Used in:** `ReferralsView → Mark Attended`

### GET `/screening/patients/{patient_id}/messages`
WhatsApp message log history for a patient.  
**Auth:** None  
**Returns:** `MessageLogResponse[]`

### POST `/screening/intake/{patient_id}`
Submit clinical intake from the facility portal. Records clinical BP, creates prescriptions, activates reminders.  
**Auth:** None  
**Body:** `ClinicalIntakeRequest`  
**Returns:** `PatientResponse`

---

## Events

### GET `/events/`
List all screening events.  
**Auth:** Required  
**Returns:** `ScreeningEventResponse[]`  
**Used in:** `EventsView`

### POST `/events/`
Create a new screening event.  
**Auth:** Required  
**Body:** `{ name, location, partner_organization? }`  
**Returns:** `ScreeningEventResponse`  
**Used in:** `Topbar / EventsView → + New Event` (wired to toast, form pending)

### GET `/events/{event_id}`
Full details of a single event.  
**Auth:** Required  
**Returns:** `ScreeningEventResponse`

### PUT `/events/{event_id}/close`
Close an event to lock registrations.  
**Auth:** Required  
**Returns:** `ScreeningEventResponse`

### GET `/events/{event_id}/patients`
All patients registered during a specific event.  
**Auth:** Required  
**Returns:** `PatientResponse[]`

### GET `/events/{event_id}/summary`
Per-event analytics: total screened, BP distribution, referral count, adherence enrollment.  
**Auth:** Required  
**Returns:** summary object  
**Used in:** `EventsView` (per-row stats)

---

## Analytics

### GET `/analytics/summary`
High-level dashboard stats: total screened, BP distribution, referral rates, adherence.  
**Auth:** None  
**Query params:** `facility_id?`  
**Returns:** summary object  
**Used in:** `OverviewView` (KPI cards), `PatientsView` (total count)

### GET `/analytics/adherence`
Adherence stats across all enrolled patients: overall rate, total enrolled, 7-day breakdown.  
**Auth:** None  
**Query params:** `facility_id?`  
**Returns:** stats object  
**Used in:** `AdherenceView` (KPI cards)

### GET `/analytics/referrals`
Referral pipeline: total referred, attended, lost to follow-up.  
**Auth:** None  
**Returns:** stats object  
**Used in:** `ReferralsView` (KPI cards)

### GET `/analytics/needs-outreach`
Patients flagged for CHW outreach due to missed appointments or non-response.  
**Auth:** None  
**Returns:** outreach queue array  
**Used in:** `OutreachView`

### GET `/analytics/timeline`
Screening registrations grouped by day for charting.  
**Auth:** None  
**Query params:** `period` — `7d`, `30d` (default), `90d`  
**Returns:** timeline object

### GET `/analytics/export-csv`
CSV export of all screening participants and latest BP readings. Super Admin / Program Manager only.  
**Auth:** Required  
**Returns:** CSV string (`text/plain`)  
**Used in:** `PatientsView → Export CSV`

---

## Facilities

### GET `/facilities/`
List all registered clinical facilities.  
**Auth:** None  
**Returns:** `FacilityResponse[]`

### POST `/facilities/`
Create a new facility. Super Admin only.  
**Auth:** Required  
**Body:** `{ name, address?, region?, contact_number? }`  
**Returns:** `FacilityResponse`

### GET `/facilities/{facility_id}`
Details of a single facility.  
**Auth:** None  
**Returns:** `FacilityResponse`

### GET `/facilities/{facility_id}/referrals`
Referral queue for a specific facility (patients with status `Referred`).  
**Auth:** None  
**Returns:** `PatientResponse[]`

### GET `/facilities/{facility_id}/adherence`
Adherence details for all active patients at a facility, including 7-day dot arrays.  
**Auth:** None  
**Returns:** adherence array

---

## Message Templates

### GET `/templates/`
List all WhatsApp message templates. Super Admin / Program Manager only.  
**Auth:** Required  
**Returns:** `MessageTemplateResponse[]`

### POST `/templates/`
Create a new custom message template.  
**Auth:** Required  
**Body:** `{ template_type, content, is_active? }`  
**Returns:** `MessageTemplateResponse`

### GET `/templates/{template_id}`
Fetch a single template by ID.  
**Auth:** Required  
**Returns:** `MessageTemplateResponse`

### PUT `/templates/{template_id}`
Update a template's content. Version number auto-increments.  
**Auth:** Required  
**Body:** `{ template_type, content, is_active? }`  
**Returns:** `MessageTemplateResponse`

**Available placeholders by template type:**
- `medication_reminder` — `{name}`, `{medication_name}`
- `screening_result_normal` — `{name}`, `{systolic}`, `{diastolic}`
- `screening_result_referred` — `{name}`, `{systolic}`, `{diastolic}`
- `referral_reminder` — `{name}`
- `healthy_tip` — `{content}`

---

## Webhook

### POST `/webhook/twilio`
Receives incoming WhatsApp messages from patients via Twilio. Handles adherence confirmations, pause/resume, and unsubscribe.  
**Auth:** Twilio signature verification (production)  
**Body:** `application/x-www-form-urlencoded` — `From`, `Body`  
**Returns:** TwiML response string

---

## Ingestion

### POST `/ingestion/bulk-upload`
Upload legacy screening logs from offline areas via CSV.  
**Auth:** Required  
**Body:** `multipart/form-data` — `file`  
**Expected CSV columns:** First Name/Alias, WhatsApp Number, Age Range, Gender, Consent Confirmed, Systolic, Diastolic  
**Returns:** ingestion result object

---

## Health Check

### GET `/`
Verify the API is active.  
**Auth:** None  
**Returns:** `{}`
