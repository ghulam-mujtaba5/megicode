# Internal Workflow Automation — TODO (Megicode)

Scope: ONLY internal portal + business process automation under `/internal`. Exclude public website pages.

## Current (already built)
- [x] Auth: Google OAuth + role gate (`admin|pm|dev|qa|viewer`)
- [x] DB tables: `users`, `leads`, `projects`, `process_definitions`, `process_instances`, `tasks`, `events`, `audit_events`
- [x] Leads: list/create + detail + Convert → Project + Start Process + auto-generate tasks
- [x] Projects: list + detail (process view + tasks update + event log + status derivation)
- [x] My Tasks
- [x] Process Admin (read-only definitions)

---

## Goal (what we are building)
Run business end-to-end inside `/internal`:
Lead → qualify → proposal → approval → project setup → delivery → QA → deploy → invoice → close → support.

---

## Roles (permissions, simple)
- `admin`: users, roles, process versions, billing, integrations, delete/restore
- `pm`: leads, proposals, projects, assignment, client comms
- `dev`: tasks, estimates, time logs, deploy notes
- `qa`: QA queue, bugs, signoff
- `viewer`: read-only

Hard rules
- Server-side guard for every action/page (`requireRole` pattern)
- Every write: create `events` + `audit_events`

---

## Modules → Pages → Features (MAX list, short words)

### 1) Dashboard / Control Center
Pages
- [ ] `/internal` dashboard v2
Features
- [ ] KPI tiles: new leads, approved, converted, active projects, blocked, overdue
- [ ] My queue: tasks by status + due
- [ ] PM queue: approvals waiting, QA waiting, invoices overdue
- [ ] Alerts: SLA breach, blocked > N days, due in 48h

### 2) Leads (CRM-lite)
Pages
- [x] `/internal/leads`
- [x] `/internal/leads/[id]`
Add
- [ ] `/internal/leads/pipeline` (kanban)
- [ ] `/internal/leads/import` (CSV)
- [ ] `/internal/leads/rules` (auto actions)
Features
- [ ] Assign owner (PM)
- [ ] Notes/comments + mentions
- [ ] Tags + priority + budget range
- [ ] Dedupe + merge (email/phone)
- [ ] Lead scoring (simple rules)
- [ ] Qualification checklist + call outcome
- [ ] Convert guard: require approved + owner + due
Automation
- [ ] Auto-create lead from inbound (contact form → internal lead) + event
- [ ] Auto-create follow-up tasks on new lead (call, email, meeting)

### 3) Client / Accounts
Pages
- [ ] `/internal/clients`
- [ ] `/internal/clients/[id]`
Features
- [ ] Client profile: company, contacts, timezone, billing info
- [ ] Contact list: roles (CEO/PO/Finance), preferred channel
- [ ] Communication history (email + meetings)

### 4) Proposal / Quote / SOW
Pages
- [ ] `/internal/proposals`
- [ ] `/internal/proposals/[id]`
- [ ] `/internal/templates` (proposal/SOW/email)
Features
- [ ] Proposal lifecycle: draft → sent → revised → accepted/declined
- [ ] Cost models: fixed / T&M / retainer
- [ ] Items: milestone, rate, hours, discounts
- [ ] Admin approval step before sending
- [ ] PDF export + send email
- [ ] Attach NDA/SOW (upload)

### 5) Projects (Delivery hub)
Pages
- [x] `/internal/projects`
- [x] `/internal/projects/[id]`
Add
- [ ] `/internal/projects/[id]/timeline`
- [ ] `/internal/projects/[id]/files`
- [ ] `/internal/projects/[id]/risks`
- [ ] `/internal/projects/[id]/billing`
- [ ] `/internal/projects/[id]/comm`
Features
- [ ] Project profile: repo links, env URLs, slack channel, meeting link
- [ ] Milestones + deliverables
- [ ] Risks/issues log + owner + due
- [ ] Decision log
- [ ] Acceptance criteria checklist
- [ ] Closeout checklist (handover, docs, credentials, warranty)

### 6) Workflow Engine (Process Definitions + Instances)
Pages
- [x] `/internal/admin/process` (read-only)
Add
- [ ] `/internal/admin/process/builder`
- [ ] `/internal/admin/process/[key]/versions`
- [ ] `/internal/projects/[id]/process` (instance detail)
Must
- [ ] CRUD definitions: key, version, activate, rollback
- [ ] Step meta: role, default due days, required fields, checklist
- [ ] Task generation rules: role-based assignment + due offsets
- [ ] Instance actions: start/pause/cancel/complete
- [ ] Step gating: cannot advance until required tasks done
Advanced
- [ ] Branching steps (if/else)
- [ ] Parallel steps (multi-active)
- [ ] Dependencies (task A blocks B)
- [ ] Approval step type (approve/reject)
- [ ] SLA policy per step + breach events
- [ ] Rollback/reopen step

### 7) Tasks (work mgmt)
Pages
- [x] `/internal/tasks` (My Tasks)
Add
- [ ] `/internal/tasks/all`
- [ ] `/internal/tasks/[id]`
- [ ] `/internal/team` workload
Features
- [ ] Comments + mentions
- [ ] Attachments
- [ ] Subtasks/checklists
- [ ] Labels: bug/feature/chore
- [ ] Estimate + time tracking
- [ ] Dependencies + blocker reason
- [ ] Bulk ops: assign/status/due
Automation
- [ ] Reminders: due soon, overdue
- [ ] Auto-escalate blocked tasks to PM/admin

### 8) QA / Bugs / Release
Pages
- [ ] `/internal/qa/queue`
- [ ] `/internal/projects/[id]/qa`
- [ ] `/internal/bugs`
Features
- [ ] Bug tracker: severity, env, steps, screenshots
- [ ] Test plan templates + test runs
- [ ] Release checklist + signoff
- [ ] QA gate: cannot deploy until QA signoff

### 9) Billing / Invoices / Payments
Pages
- [ ] `/internal/invoices`
- [ ] `/internal/invoices/[id]`
- [ ] `/internal/projects/[id]/billing`
Features
- [ ] Invoice draft from milestones or time logs
- [ ] Status: unpaid/partial/paid
- [ ] Reminders schedule
- [ ] Revenue dashboard

### 10) Communication (Email + Meetings)
Pages
- [ ] `/internal/projects/[id]/comm`
- [ ] `/internal/meetings`
Features
- [ ] Email templates: follow-up, proposal, kickoff, weekly status, delivery
- [ ] Email log per lead/project (sent)
- [ ] Meeting notes + action items → tasks

### 11) Integrations + Webhooks
Pages
- [ ] `/internal/admin/integrations`
Features
- [ ] Outbound webhooks: lead.created, lead.converted, task.updated, instance.started
- [ ] Slack notify (channel per project)
- [ ] GitHub link: repo URL, release notes, deploy log
- [ ] Zapier/Make support (signed payload)

### 12) Reporting (Ops)
Pages
- [ ] `/internal/reports/funnel`
- [ ] `/internal/reports/cycle-time`
- [ ] `/internal/reports/sla`
- [ ] `/internal/reports/team`
Metrics
- [ ] Lead funnel + conversion rate
- [ ] Cycle time per step
- [ ] Task aging + WIP
- [ ] SLA breaches + reasons

### 13) Admin (Users + Security)
Pages
- [ ] `/internal/admin/users`
- [ ] `/internal/admin/audit`
- [ ] `/internal/admin/settings`
Features
- [ ] Add/update role, deactivate
- [ ] Allowed emails/domains UI (optional DB override)
- [ ] Audit search (actor/action/target/date)

---

## Flows (exact system behavior)

### Flow A: Lead intake → qualification
1) Create lead (manual/import/inbound)
2) Assign PM owner
3) Auto tasks: `schedule_call`, `send_intro`, `collect_requirements`
4) PM marks lead `in_review` + notes
5) Approve/reject → event + audit

### Flow B: Proposal → acceptance
1) Create proposal from lead (template)
2) Admin approval required
3) Send proposal PDF/email
4) Track status: sent/revised/accepted/declined

### Flow C: Convert → project + process instance (already exists, extend)
1) Convert lead to project (requires approved)
2) Start process instance from active definition
3) Create tasks from steps; assign by role rules
4) Current step derived from first incomplete task

### Flow D: Task updates → instance step → project status (already exists, extend)
1) Task status change logs event
2) Recompute instance current step
3) Derive project status
4) Trigger notifications + SLA checks

### Flow E: Delivery → invoice → close
1) Delivery tasks done → “delivery package” step complete
2) Auto invoice draft
3) Payment recorded
4) Close checklist done → project closed

---

## Automation Engine (rules)
- [ ] Rule model: `WHEN event.type IF condition THEN actions[]`
- [ ] Actions: create task, assign, set due, send email, webhook, slack
- [ ] Idempotency + retries + dead-letter table

---

## Internal APIs (for integrations)
Add `app/api/internal/*`
- [ ] `POST /api/internal/leads/import`
- [ ] `POST /api/internal/webhooks/*` (inbound)
- [ ] `POST /api/internal/process/activate`
- [ ] `POST /api/internal/invoices/send`

---

## DB Additions (next)
Must next
- [ ] `task_comments`, `lead_notes`, `attachments`
- [ ] `clients`, `client_contacts`
Soon
- [ ] `proposals`, `proposal_versions`, `proposal_items`
- [ ] `invoices`, `payments`
Advanced
- [ ] `approvals`, `sla_policies`, `instance_fields`
- [ ] `bugs`, `test_runs`, `signoffs`
- [ ] `integrations`, `webhook_deliveries`

---

## Build Order (fast value)
1) Comments/notes + attachments
2) Lead pipeline + owner + dedupe
3) Process builder (CRUD + activate)
4) Task detail + reminders + deps
5) Proposal + approvals + PDF
6) Billing
7) Reports
8) Integrations



