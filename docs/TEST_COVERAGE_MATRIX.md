# Test Coverage Matrix

## Overview
This document maps all user flows, features, and acceptance criteria for end-to-end testing.

---

## 1. Lead Management Flow

### Flow: Lead Intake → Review → Approval → Conversion to Project

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 1.1 | Lead submission via contact form | `POST /api/contact` | Lead created with status='new' | Lead record exists, email sent to admin |
| 1.2 | Admin views leads list | `/internal/leads` | All leads visible | Leads table displays, filtering works |
| 1.3 | Admin adds lead note | Internal UI + API | `lead_notes` record created | Note appears in lead detail |
| 1.4 | Admin updates lead status | Internal UI + API | Lead status='in_review' | Status change reflected, audit log entry |
| 1.5 | Lead approval | Internal UI | Lead status='approved' | Lead marked approved, ready for conversion |
| 1.6 | Convert lead to project | Internal UI + API | Project created, linked to lead | Project exists with leadId, lead status='converted' |

**Seed Data Required:**
- 2+ leads with different statuses
- 1+ lead notes
- Admin user with permissions

---

## 2. Requirements & Estimation Flow

### Flow: Lead → Requirements Wizard → Estimation → Feasibility Check

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 2.1 | Fill requirements wizard | Internal UI | Lead has functional/non-functional requirements JSON | Requirements saved, fields populated |
| 2.2 | Add SRS document | Internal UI | `srsUrl` field populated | Document link visible |
| 2.3 | Create estimation | Internal UI + API | `estimations` record created | Breakdown JSON saved, total hours calculated |
| 2.4 | Run feasibility check | Internal UI | `feasibility_checks` record | Technical/resource/timeline checks completed |
| 2.5 | Review estimation | Internal UI | Estimation visible | Breakdown displayed, confidence shown |

**Seed Data Required:**
- Lead with partial requirements
- Estimation templates
- Feasibility check rules

---

## 3. Proposal & SOW Flow

### Flow: Approved Lead → Create Proposal → Send → Accept → Invoice

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 3.1 | Create proposal from lead | Internal UI | `proposals` record with status='draft' | Proposal form pre-filled from lead/estimation |
| 3.2 | Add proposal items | Internal UI | `proposal_items` records | Line items visible, totals calculated |
| 3.3 | Submit for approval | Internal UI | Proposal status='pending_approval' | Approval workflow triggered |
| 3.4 | Approve proposal | Internal UI | Proposal status='approved' | Approved by manager |
| 3.5 | Send proposal to client | Email + API | Proposal status='sent', `sentAt` timestamp | Email log entry, client receives email |
| 3.6 | Client accepts proposal | Client portal or manual | Proposal status='accepted' | Project can be created |

**Seed Data Required:**
- Approved lead
- Proposal templates
- Email templates

---

## 4. Project Creation & Onboarding Flow

### Flow: Accepted Proposal → Create Project → Kickoff → Onboarding Checklist

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 4.1 | Create project from proposal | Internal UI | Project record, status='new' | Project linked to proposal, client, lead |
| 4.2 | Assign PM/owner | Internal UI | Project `ownerUserId` set | PM receives notification |
| 4.3 | Start process instance | Internal UI + API | `process_instances` record, status='running' | Process started, current step identified |
| 4.4 | Generate onboarding checklist | Automation | `onboarding_checklists` record | Checklist items from template |
| 4.5 | Schedule kickoff meeting | Internal UI | `meetings` record | Meeting created with attendees |
| 4.6 | Complete kickoff step | Internal UI | Business process step='completed' | Kickoff marked done, next step active |

**Seed Data Required:**
- Accepted proposal
- Process definition (standard_delivery)
- Project template with default tasks
- Onboarding checklist template

---

## 5. Development & Task Management Flow

### Flow: Active Project → Sprint Planning → Task Execution → QA Handoff

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 5.1 | Create tasks from template | Internal UI | Multiple `tasks` records | Tasks linked to project, process instance |
| 5.2 | Assign tasks to developers | Internal UI | Tasks have `assignedToUserId` | Developer sees tasks in their queue |
| 5.3 | Start task | Internal UI | Task status='in_progress' | Status change, start time logged |
| 5.4 | Log time on task | Internal UI | `time_entries` record | Time tracked, billable flag set |
| 5.5 | Add task comment | Internal UI | `task_comments` record | Comment visible in task detail |
| 5.6 | Complete task | Internal UI | Task status='done', `completedAt` set | Task marked complete, completion logged |
| 5.7 | Trigger QA handoff | Automation | Business process message sent | QA step notified, message in `business_process_messages` |

**Seed Data Required:**
- Active project with tasks
- Process instance with 'development' step active
- Developer and QA users
- Task templates

---

## 6. Bug Tracking & QA Flow

### Flow: Bug Report → Assignment → Fix → Verification → Closure

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 6.1 | Report bug | Internal UI | `bugs` record, status='open' | Bug visible in bugs list |
| 6.2 | Assign bug to developer | Internal UI | Bug `assignedToUserId` set | Developer notified |
| 6.3 | Update bug status | Internal UI | Bug status='in_progress' | Status change logged |
| 6.4 | Mark bug resolved | Internal UI | Bug status='resolved', `resolvedAt` set | Resolution time recorded |
| 6.5 | QA verification | Internal UI | Bug status='closed' | Final closure confirmed |
| 6.6 | Bug linked to task | Internal UI | Bug `taskId` populated | Bug associated with fix task |

**Seed Data Required:**
- Project with bugs
- QA and dev users

---

## 7. Invoice & Payment Flow

### Flow: Project Milestone → Generate Invoice → Send → Payment Received

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 7.1 | Create invoice from proposal | Internal UI | `invoices` record, status='draft' | Invoice items match proposal |
| 7.2 | Add invoice items | Internal UI | `invoice_items` records | Line items, totals calculated |
| 7.3 | Send invoice | Internal UI | Invoice status='sent', `sentAt` set | Email sent, email log entry |
| 7.4 | Record payment | Internal UI | `payments` record, invoice `paidAmount` updated | Payment tracked, invoice status updated |
| 7.5 | Full payment received | Internal UI | Invoice status='paid', `paidAt` set | Invoice marked paid |

**Seed Data Required:**
- Project with milestone reached
- Invoice and invoice items
- Payment methods

---

## 8. Business Process Automation Flow

### Flow: Process Definition → Instance → Step Execution → Automation Trigger

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 8.1 | Load process definition | Internal UI | Process definition active | BPMN/JSON visible |
| 8.2 | Start process instance | API/UI | `process_instances` record | Instance running, first step active |
| 8.3 | Execute step | Internal/automation | `business_process_step_instances` record | Step status tracked |
| 8.4 | Store process data | API | `business_process_data` records | Variables saved (deployment URL, etc.) |
| 8.5 | Send inter-step message | Automation | `business_process_messages` record | Message delivered between steps |
| 8.6 | Run automation action | Automation | `business_process_automations` record | CI/CD triggered, results logged |
| 8.7 | Complete process | Automation/UI | Instance status='completed', `endedAt` set | All steps done, process closed |

**Seed Data Required:**
- Active process definition
- Running process instance
- Step instances with various statuses
- Process data variables

---

## 9. Client Portal Access Flow (Future)

### Flow: Client Login → View Projects → Submit Feedback → Download Deliverables

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 9.1 | Client login | Auth flow | Session created | Client authenticated |
| 9.2 | View assigned projects | Client portal | Projects visible | Only client's projects shown |
| 9.3 | Submit feedback | Client portal | `feedback_items` record | Feedback tracked |
| 9.4 | Download attachments | Client portal | Attachment accessed | Download logged |

**Seed Data Required:**
- Client user account
- Projects linked to client
- Attachments

---

## 10. Reporting & Analytics Flow

### Flow: View Dashboards → Export Reports → Performance Metrics

| Step | Feature | Endpoint/UI | Expected DB State | Acceptance Criteria |
|------|---------|-------------|-------------------|---------------------|
| 10.1 | View project dashboard | `/internal/projects` | Projects data loaded | Charts, stats displayed |
| 10.2 | View process analytics | `/internal/process/analytics` | Process instances, metrics | Flowchart with live data |
| 10.3 | Filter by date range | UI controls | Filtered results | Data reflects date filter |
| 10.4 | Export data | Export API | CSV/JSON generated | File downloaded |

**Seed Data Required:**
- Multiple projects with various statuses
- Process instances with metrics
- Time entries for reporting

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Database migrated to latest schema (`npm run db:migrate`)
- [ ] Database seeded with test data (`npm run db:seed`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Dev server running (`npm run dev`)
- [ ] Auth configured (NextAuth secrets)

### Manual Test Execution
- [ ] Lead intake form submission
- [ ] Internal portal navigation
- [ ] Lead to project conversion
- [ ] Task assignment and completion
- [ ] Bug creation and tracking
- [ ] Invoice generation
- [ ] Process flowchart visualization
- [ ] User role permissions

### Automated Test Execution
- [ ] Run Playwright E2E tests (`npm run test:e2e`)
- [ ] Capture DevTools trace (`npx ts-node scripts/capture-devtools-trace.ts`)
- [ ] Verify DB state after each flow
- [ ] Check console for errors
- [ ] Validate API responses

### Post-Test Validation
- [ ] All flows complete successfully
- [ ] No console errors
- [ ] DB state matches expectations
- [ ] Audit logs captured
- [ ] Email logs recorded
- [ ] Attachments uploaded/downloaded

---

## Coverage Goals

| Area | Target Coverage | Current Status |
|------|----------------|----------------|
| Core Flows | 100% | ✅ Defined |
| API Endpoints | 90% | 🚧 In Progress |
| UI Components | 80% | 🚧 In Progress |
| Business Process Steps | 100% | ✅ Defined |
| Database Tables | 90% | ✅ Seeded |
| Error Scenarios | 70% | ⏸️ Pending |

---

## Notes

- **Seed data must be comprehensive** to test all flows without manual data entry
- **Use MCP/Chrome DevTools** for full network, console, and performance traces
- **Automate where possible** using Playwright for regression testing
- **Document failures** with screenshots and trace files for debugging
