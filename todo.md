# Internal Workflow Automation — TODO (Megicode)

Note: The canonical, full requirements and roadmap have been preserved in a separate file for clarity: [REQUIREMENTS.md](REQUIREMENTS.md). This `todo.md` remains intact and will not be removed; the new file is a direct copy.

Scope: ONLY internal portal + business process automation under `/internal`. Exclude public website pages.

---

## ✅ IMPLEMENTATION COMPLETE (Dec 16, 2025)

### Database
- ✅ 29 tables created on Turso
- ✅ Migration `0002_flowery_power_man.sql` applied
- ✅ All schema types verified (`tsc --noEmit` passes)

### Pages Implemented

| Module | Route | Status |
|--------|-------|--------|
| Dashboard | `/internal` | ✅ KPIs, queues, alerts |
| Leads | `/internal/leads` | ✅ List, create |
| Lead Detail | `/internal/leads/[id]` | ✅ Notes, tags, status |
| Clients | `/internal/clients` | ✅ List, create |
| Client Detail | `/internal/clients/[id]` | ✅ Contacts, projects |
| Proposals | `/internal/proposals` | ✅ List, create |
| Proposal Detail | `/internal/proposals/[id]` | ✅ Line items, status |
| Projects | `/internal/projects` | ✅ List |
| Project Detail | `/internal/projects/[id]` | ✅ Milestones, notes, process |
| Tasks | `/internal/tasks` | ✅ My tasks |
| Task Detail | `/internal/tasks/[id]` | ✅ Comments, checklists, time |
| Invoices | `/internal/invoices` | ✅ List, create |
| Invoice Detail | `/internal/invoices/[id]` | ✅ Line items, payments |
| Reports | `/internal/reports` | ✅ Funnel, status, financials |
| Process Admin | `/internal/admin/process` | ✅ Definition list |
| Process Detail | `/internal/admin/process/[key]` | ✅ Steps, versions |
| User Admin | `/internal/admin/users` | ✅ Role management |
| Process Instances | `/internal/instances` | ✅ Running workflows |
| Instance Detail | `/internal/instances/[id]` | ✅ Step navigation |

### Database Tables (29 total)
```
users, leads, lead_notes, lead_tags
clients, client_contacts
proposals, proposal_items
projects, project_notes, project_risks, milestones
process_definitions, process_instances
tasks, task_comments, task_checklists, time_entries
invoices, invoice_items, payments
bugs, meetings, email_logs
integrations, webhook_deliveries
events, audit_events, attachments
```

---

## 🚀 DEPLOYMENT STEPS

### 1. Google OAuth Setup
Go to https://console.cloud.google.com/apis/credentials
- Create OAuth 2.0 Client ID
- Add authorized redirect: `https://yourdomain.com/api/auth/callback/google`
- Copy Client ID & Secret to `.env.local`

### 2. Environment Variables
```env
# Already configured
TURSO_DATABASE_URL=libsql://megicode-internal-megicode.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=<your-token>

# Update these for production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-secure-secret>
AUTH_SECRET=<same-as-above>
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>

# Access control
INTERNAL_ALLOWED_DOMAINS=megicode.com
INTERNAL_ADMIN_EMAILS=admin@megicode.com
INTERNAL_DEFAULT_ROLE=viewer
```

### 3. Vercel Deployment
```bash
vercel --prod
```
Add all env vars in Vercel dashboard.

---

## 📋 OPTIONAL FUTURE ENHANCEMENTS

These are not required for MVP but can be added later:

### Phase 2 (Nice to have)
- [ ] Lead kanban board view
- [ ] CSV import for leads
- [ ] PDF export for proposals/invoices
- [ ] Email sending via Zoho/Resend
- [ ] Slack integration
- [ ] GitHub webhook integration

### Phase 3 (Advanced)
- [ ] Branching/parallel workflow steps
- [ ] SLA policy enforcement
- [ ] Test run/QA signoff system
- [ ] Time tracking reports
- [ ] Client portal (external access)
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



not waste too much time on build again again check tsc no emit etc and continue 