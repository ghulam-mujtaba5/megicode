# Megicode — Software Delivery & Project Management Automation (Internal Portal)

This TODO is the implementation roadmap for an internal portal that automates and monitors Megicode’s end‑to‑end software delivery process (from first client request → delivery → feedback), aligned with BPMN “TO‑BE” process modeling.

It is designed for:
- A 2‑founder team (part‑time, project‑based collaborators at first)
- $0 cost where possible (free tiers first)
- A modern 2025 stack (this repo already uses Next.js 15 + React 19 + TypeScript)
- High observability: event logs, status colors, instance monitoring, and audit history

Owner: Ghulam Mujtaba (COMSATS, Lahore) — Company: https://megicode.com

---

## 1) Goals (what “done” means)

### Core automation goals
- Convert inbound requests into structured “work” automatically (lead → project → tasks)
- Move work forward through a clear process (handoffs from PM → Dev → QA → Delivery)
- Reduce manual/duplicate work using integrations + templates

### Monitoring & control goals (must-have)
- Each process instance is trackable with a clear status + timeline
- Status colors are consistent (UI badges + filters later if needed)
- Full execution/event logs (who did what, when, and why)
- “Work forwarding” is explicit (task assignment + ownership transitions)
- Role-based access control (users only see what they should)
- Process structures are changeable (versioned process definitions)

### Practical business outcomes
- Faster onboarding (less setup work per project)
- Consistent project tracking and client updates
- Easier reporting for class submission (BPMN + implementation mapping)

---

## 2) Constraints & principles

- Free-tier first: choose tools with generous free plans.
- BYO-keys: any AI features must work only when API keys exist; the system must still work without AI.
- Minimal operations: avoid complex infra at MVP (no Kubernetes, no heavy workflow engine to start).
- Keep within this codebase style:
	- Next.js App Router
	- CSS Modules + existing theme context
	- Avoid hardcoding new design tokens; reuse existing patterns

---

## 3) Proposed MVP product scope (v0)

### A) Authentication & users
- Google login (OAuth)
- Roles: Founder/Admin, PM, Developer, QA, Viewer
- Organization: single org (Megicode) for MVP

### B) Intake → project creation
- Create Lead from:
	- Website contact form submission (existing route can be extended)
	- Manual entry inside the portal
- Convert Lead → Project with:
	- Target delivery date, budget estimate, priority
	- Project owner (PM) assigned

### C) Process + tasks
- Process definition: a versioned “Megicode Delivery Process” model
- Process instance: created automatically when Project is created
- Tasks: generated from the process definition (PM review, dev, QA, delivery, feedback)
- Task assignment + reassignment (handoff tracking)

### D) Monitoring / dashboards (must)
- “My Work” view: tasks assigned to me + due dates
- Project page: status badge, timeline, current stage, assigned team
- Instance monitoring: list of all running instances + progress
- Logs:
	- Event log (state changes, assignments, comments, emails sent)
	- Audit log (auth actions, role changes, config changes)

### E) Email automation (free-tier friendly)
- Send confirmation email to lead/client
- Send weekly status update (manual trigger at MVP; later scheduled)
- Delivery package email (links + summary)

---

## 4) Recommended tools (free-tier friendly)

### Database
- Turso (libSQL) free tier

### ORM / migrations (recommended)
- Drizzle ORM (simple, TypeScript-first)

### Auth
- Auth.js / NextAuth (Google provider)

### Email
- Use existing email path (project already has nodemailer + resend dependency)
- Pick one for MVP:
	- Resend (recommended if the free plan fits), or
	- Nodemailer via Zoho SMTP (already used by the website contact route)

### Optional integrations (later)
- Trello or Notion for workspace creation (free plans; implement after core portal works)
- HubSpot free CRM sync (optional, but API constraints may apply)

### Optional AI (later, BYO-key)
- Requirement clarification: turn lead notes → user stories + acceptance criteria
- Weekly update drafting: summarize timeline + blockers

---

## 5) Process model (BPMN mapping)

### BPMN “TO-BE” flow (source of truth)
1. Start: Client submits request
2. Automated: Record request (Lead created)
3. User task: PM reviews request
4. Gateway: Approved? (Approve / Reject)
5. Automated: Create project workspace (optional integration)
6. User/rule: Assign developer(s)
7. Optional AI task: Requirements clarification
8. Subprocess: Design → Dev → Test → Review → QA
9. Automated: Weekly status email
10. User task: Final review + deployment
11. Automated: Delivery package + summary
12. User task: Client feedback collection
13. End: Close project / instance

### Implementation mapping idea
- “Process definition” = versioned JSON model (MVP)
- “Instance” = a row with current stage + timestamps
- “Tasks” = rows generated per instance
- “Events” = append-only log table

---

## 6) Data model (initial draft)

MVP tables (names can change during implementation):
- users (id, name, email, role, createdAt)
- leads (id, name, email, company, message, source, status, createdAt)
- projects (id, leadId, name, ownerUserId, status, priority, startAt, dueAt)
- process_definitions (id, key, version, json, isActive, createdAt)
- process_instances (id, processDefinitionId, projectId, status, currentStepKey, startedAt, endedAt)
- tasks (id, instanceId, key, title, status, assignedToUserId, dueAt, completedAt)
- events (id, instanceId, projectId, type, actorUserId, payloadJson, createdAt)

Notes:
- Keep event payload flexible (JSON) so logs are future-proof.
- Keep “status” enums limited and consistent across UI.

---

## 7) Statuses + colors (UI standard)

Define a small, consistent set for MVP:
- NEW (gray)
- IN_REVIEW (blue)
- APPROVED (green)
- REJECTED (red)
- IN_PROGRESS (blue)
- BLOCKED (yellow)
- IN_QA (purple)
- DELIVERED (green)
- CLOSED (gray)

Implementation note: centralize status → label → color mapping in one utility so every UI uses the same colors.

---

## 8) Pages / routes (MVP)

Internal routes (suggestion):
- /internal/login
- /internal (dashboard)
- /internal/tasks (my tasks)
- /internal/leads (list + create)
- /internal/leads/[id]
- /internal/projects (list)
- /internal/projects/[id] (project + instance + timeline)
- /internal/admin/process (process definition versions)

---

## 9) Pre-work checklist (do this before coding features)

### Local dev
- Install deps: npm install
- Run: npm run dev

### Turso
- Create DB: turso db create megicode-internal
- Create token + URL for libSQL

### Environment variables (draft)
- NEXT_PUBLIC_SITE_URL
- AUTH_SECRET (or NEXTAUTH_SECRET depending on auth library choice)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- TURSO_DATABASE_URL
- TURSO_AUTH_TOKEN
- EMAIL_PROVIDER (resend|zoho)
- RESEND_API_KEY (if using Resend)
- ZOHO_USER, ZOHO_PASS (if using Zoho SMTP)

### Decisions to confirm
- Email provider for MVP: Resend vs Zoho SMTP
- Workspace integration target: Trello vs Notion (pick one later)

---

## 10) Implementation plan (milestones)

### Milestone 0 — Foundation (1–2 days)
- Add DB + migrations (Turso + Drizzle)
- Add Google auth + roles
- Create minimal internal layout with theme support

### Milestone 1 — Core entities (2–4 days)
- Leads CRUD (create/list/view)
- Convert Lead → Project
- Create default process definition (v1)

### Milestone 2 — Workflow execution (3–6 days)
- Create process instance on project creation
- Generate tasks from definition
- Task assignment + handoff
- Status transitions with event logging

### Milestone 3 — Monitoring + logs (2–4 days)
- Instance monitoring list
- Timeline/event log UI
- Audit actions (role changes, definition changes)

### Milestone 4 — Email automation (1–3 days)
- Confirmation email
- Weekly status email (manual trigger first)
- Delivery email

### Milestone 5 — “Nice later” (backlog)
- Trello/Notion auto-board creation
- AI requirement clarification (BYO-key)
- BPMN diagram rendering (bpmn-js) inside admin page
- Scheduling/cron for weekly emails (only after MVP is stable)

---

## 11) Acceptance criteria (MVP)

- A founder can log in with Google.
- A lead can be created (from contact submission or manually).
- A project can be created from a lead.
- A process instance is created automatically and generates tasks.
- Tasks can be assigned/reassigned; the portal shows “My Tasks”.
- Every transition writes an immutable event log.
- Monitoring pages show instance status clearly with colors.
- Email sending works for at least confirmation + delivery.



