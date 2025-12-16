# Megicode — Software Delivery & Project Management Automation (Internal Portal)

## Implementation Status: ✅ Core Features Implemented (2024-01)

### Summary of Recent Updates:
- **Database Schema**: Extended with 20+ new tables and 30+ new fields
- **Lead Management**: Added Feasibility Check, Estimation Calculator, Stakeholder Map, Risk Assessment with UI
- **Project Management**: Added QA Signoffs, Retrospectives, NPS Surveys, Feedback, Environment Config, Meeting Notes with UI
- **Validation**: Comprehensive Zod schemas for all internal portal server actions
- **Remote Database**: All changes pushed to Turso (libSQL) production database

### Progress Log (2025-12-16)
- **Validation (Zod)**: Added/extended centralized Zod schemas + safe parsing for internal Task Detail server actions; updated `/api/contact` to use Zod validation with structured 400 responses.
- **Data Integrity**: Fixed Task Detail status dropdown to match DB enum (removed unsupported `review`, added `canceled`).
- **Tooling**: Updated `npm run lint` to run ESLint directly (Next.js 16 CLI no longer includes `next lint`).
- **Validation (Expanded)**: Applied Zod-backed form parsing to internal Project and Proposal server actions (QA signoff, retrospectives, NPS, feedback, milestones, attachments, status changes, line items, project conversion) to prevent invalid writes to Turso.
- **Validation (Full Coverage)**: Extended Zod validation to all remaining internal detail pages:
  - **Lead Detail** (`app/internal/leads/[id]/page.tsx`): 11 server actions validated — saveFeasibilityCheck, addEstimation, addStakeholder, removeStakeholder, addRiskAssessment, removeRiskAssessment, addNote, addTag, removeTag, updateStatus, convertToProject
  - **Client Detail** (`app/internal/clients/[id]/page.tsx`): 2 server actions validated — addContact, updateClient
  - **Invoice Detail** (`app/internal/invoices/[id]/page.tsx`): 4 server actions validated — addItem, recordPayment, updateStatus, sendInvoice
- **Validation Schemas Added**: createClientContactFormSchema, updateClientFormSchema, invoiceAddItemFormSchema, recordPaymentFormSchema, invoiceUpdateStatusFormSchema, invoiceSendFormSchema, riskAssessmentFormSchema, removeByIdFormSchema, feasibilityCheckFormSchema, estimationFormSchema, stakeholderFormSchema, leadAddNoteFormSchema, leadAddTagFormSchema, leadRemoveTagFormSchema, leadConvertToProjectFormSchema

### Progress Log (2025-12-17)
- **Centralized Constants**: Created `lib/constants/statuses.ts` with typed enums for all entity statuses aligned with database schema:
  - User roles: `USER_ROLE` (admin, pm, dev, qa, viewer)
  - Lead statuses: `LEAD_STATUS` (new, in_review, approved, rejected, converted)
  - Lead complexity: `LEAD_COMPLEXITY` (simple, moderate, complex, very_complex)
  - Project statuses: `PROJECT_STATUS` (new, in_progress, blocked, in_qa, delivered, closed, rejected)
  - Task statuses: `TASK_STATUS` (todo, in_progress, blocked, done, canceled)
  - Proposal statuses: `PROPOSAL_STATUS` (draft, pending_approval, approved, sent, revised, accepted, declined)
  - Invoice statuses: `INVOICE_STATUS` (draft, sent, partial, paid, overdue, canceled)
  - Client statuses: `CLIENT_STATUS` (active, inactive, churned)
  - Bug statuses/severity: `BUG_STATUS`, `BUG_SEVERITY`
  - Project risk statuses: `PROJECT_RISK_STATUS` (open, mitigated, closed)
  - Health statuses: `HEALTH_STATUS` (green, amber, red)
  - Feasibility enums: `TECHNICAL_FEASIBILITY`, `RESOURCE_AVAILABILITY`, `RISK_LEVEL`, `RISK_CATEGORY`
  - Cost models: `COST_MODEL` (fixed, hourly, retainer)
  - Email statuses: `EMAIL_STATUS` (sent, failed, bounced)
  - All enums include `*_OPTIONS` arrays with labels and colors for UI dropdowns
- **Prettier Config**: Added `.prettierrc` and `.prettierignore` files with standard formatting rules
- **Package Scripts**: Added `npm run format` and `npm run format:check` commands
- **Dependencies**: Installed prettier as dev dependency
- **Error Boundaries**: Enhanced `app/error.tsx` with polished UI using Next.js Image, created `app/internal/error.tsx` for internal portal-specific error handling
- **Toast Notifications**: Created `context/ToastContext.tsx` with `useToast` hook supporting success/error/warning/info types; integrated `ToastProvider` into internal portal via `app/internal/providers.tsx`
- **Confirmation Modals**: Created `components/ConfirmModal/ConfirmModal.tsx` - accessible modal with variants (danger/warning/default), loading state, and keyboard handling (Escape to close)
- **Empty States**: Created `components/EmptyState/EmptyState.tsx` with presets for common scenarios (NoTasks, NoProjects, NoResults, NoLeads, NoClients, NoInvoices, NoComments, NoNotes)
- **Loading Skeletons**: Created `components/Skeleton/Skeleton.tsx` with base Skeleton component and presets (SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable, SkeletonList, SkeletonKanban)
- **Breadcrumbs**: Created `components/Breadcrumbs/Breadcrumbs.tsx` with `InternalBreadcrumbs` helper for consistent navigation across internal portal
- **Status Badges**: Created `components/StatusBadge/StatusBadge.tsx` with `StatusBadgeAuto` that auto-detects variant based on status string, and `getStatusVariant` helper that maps status strings to color variants
- **Next.js Config Cleanup**: Removed deprecated `eslint.ignoreDuringBuilds` from `next.config.mjs` (Next.js 16 no longer supports this option)
- **Pre-commit Hooks**: Installed Husky + lint-staged; configured `.husky/pre-commit` to run `lint-staged` on staged files (ESLint + Prettier)
- **License**: Added MIT LICENSE file
- **Improved .gitignore**: Comprehensive patterns for OS files, IDE, logs, cache, TypeScript build info, testing coverage, etc.
- **Engine Locking**: Added `engines.node >= 18.0.0` to package.json
- **DB Seeding Script**: Created `scripts/db-seed.ts` with sample users, clients, leads, projects, tasks, milestones; added `npm run db:seed` command

### Progress Log (2025-01-09)
- **Global Search**: Created `/internal/search` page with cross-entity search for leads, projects, tasks, clients, and users
- **Gantt Chart View**: Created `/internal/projects/[id]/gantt` page with visual task timeline, milestone markers, week headers, and today indicator
- **Sprint Planner**: Added `sprintNumber` field to tasks table with index; updated Task Detail page with sprint assignment UI
- **Resource Allocation Grid**: Created `/internal/resources` page showing team workload distribution with task counts and overload warnings
- **Workload Balancing**: Integrated overload warnings (>10 tasks = high, >15 = critical) into Resources page
- **API Endpoint Planner**: Added `api_endpoints` table (method, path, description, authRequired, roleRequired, status, schemas) + full CRUD UI in Project Detail page
- **Project Templates UI**: Created `/internal/templates` page with add/toggle active/delete functionality for project templates
- **Similar Project Suggester**: Added Similar Projects UI section to Lead Detail sidebar (matches by service type or tech preferences)
- **NDA Management**: Added NDA tracking fields to leads table (ndaStatus, ndaUrl, ndaSentAt, ndaSignedAt, ndaExpiresAt) + UI section in Lead Detail page
- **Support Tickets UI**: Extended Project Detail page with full support ticket management (add, status updates)
- **Navigation Updates**: Added Search and Resources links to internal portal navigation
- **Critical Path Analysis**: Added Critical Path section to Project Detail page highlighting blocked/overdue/due-soon tasks with risk indicators
- **Developer Velocity**: Added Developer Velocity section to Resources page with completed tasks per user, sprint breakdown visualization, and team average
- **Renewal Reminder**: Added `contractRenewalAt` and `maintenanceContractActive` fields to projects table + Renewal Reminders section on dashboard for contracts expiring within 30 days
- **Case Study Draft**: Added `case_studies` table (title, summary, challenge, solution, results, testimonial, status) + Case Study section in Project Detail for delivered/closed projects
- **Process Improvement Suggestion**: Added `process_suggestions` table (title, description, category, priority, status, reviewNotes) + `/internal/suggestions` page with submission form and review workflow
- **Resource Availability Check**: Added Ready for Scoping section to Leads page showing new/in_review leads without estimations
- **Local Setup Guide**: Created `/internal/setup-guide` page with step-by-step instructions, prerequisites, commands, and troubleshooting
- **Accessibility Audit Log**: Added `accessibility_audits` table (WCAG level, criterion, severity, affected users, recommendation) + UI in Project Detail page
- **Mobile Responsiveness Checklist**: Added `mobile_checks` table (category, breakpoint, status, device) + UI in Project Detail with quick-add common checks
- **Transaction Safety**: Added `withTransaction()` helper to lib/db/index.ts for atomic multi-step operations
- **Sensitive Data Review**: Confirmed internal portal data exposure is appropriate (auth required)

---

## Project Scope
This roadmap focuses exclusively on the **End-to-End Software Delivery Process** (Client Request → Delivery → Feedback). It aligns with the BPMN "TO-BE" process modeling to automate the core business of Megicode: building and delivering software.

**Excluded Domains:** Finance, HR, External Client Portal, CMS, General AI, Social, Mobile Apps.
**Excluded Tech:** Heavy DevOps (Kubernetes, Docker), Complex CI/CD pipelines.

---

## Section 1: Feature Roadmap (120+ Features)

### Module A: Client Request & Requirements (Intake)
*Focus: Capturing the initial request, scoping, and preparing for development.*

1.  ✅ **Request Intake Form:** Standardized internal form to log new client requests.

3.  ✅ **Requirements Gathering Wizard:** Step-by-step form to document functional requirements and SRS file URL uploading. *(Added srsUrl, functionalRequirements, nonFunctionalRequirements, targetPlatforms, techPreferences, integrationNeeds to leads table)*

5.  ✅ **Estimation Calculator:** Helper to estimate hours based on feature complexity without AI. *(Added estimations table with totalHours, hourlyRate, complexity, confidence, assumptions)*

7. 
8.  ✅ **Feasibility Check:** Checklist for technical feasibility review. *(Added feasibility_checks table with technicalFeasibility, resourceAvailability, timelineRealistic, budgetAdequate, riskLevel)*
9.  ✅ **Competitor Analysis Log:** Field to note competitors mentioned by client. *(Added competitorNotes to leads table)*
10. ✅ **Existing System Audit:** Form to log details of legacy systems if rebuilding. *(Added existingSystemNotes to leads table)*
11. ✅ **Stakeholder Map:** Identify key decision-makers on the client side. *(Added stakeholders table with name, role, email, influence, interest)*
12. ✅ **Request Status Pipeline:** Kanban (New -> Scoping -> Estimating -> Ready for Dev). *(Existing lead status workflow)*
13. ✅ **Document Attachment:** Attach initial briefs/RFPs to the request. *(Existing attachments system)*
14. ✅ **Similar Project Suggester:** Show past projects with similar requirements. *(Added UI in Lead Detail page sidebar - matches by service type or tech preferences)*
15. ✅ **Resource Availability Check:** Quick view of available leads for scoping. *(Added Ready for Scoping section to Leads page showing new/in_review leads without estimations)*
16. ✅ **Risk Assessment (Pre-Project):** Identify high-risk technical areas early. *(Added risk_assessments table with title, category, probability, impact, riskScore, mitigationPlan + UI in Lead Detail page)*
17. ✅ **Budget vs. Estimate Alert:** Warn if technical estimate exceeds client budget. *(Implemented alert in Lead Detail page when sum of estimations exceeds estimatedBudget)*
18. ✅ **NDA Management:** Track if NDA is signed before sharing deep technical details. *(Added ndaStatus, ndaUrl, ndaSentAt, ndaSignedAt, ndaExpiresAt fields to leads table + UI in Lead Detail page)*

20. ✅ **Conversion to Project:** One-click action to turn a "Request" into a "Project".

### Module B: Project Planning & Management
*Focus: Organizing the work, assigning resources, and scheduling.*

21.  ✅ **Project Dashboard:** High-level view of all active development projects.
22.  ✅ **Gantt Chart View:** Timeline visualization of phases and dependencies. *(Created /internal/projects/[id]/gantt page with task timeline, milestone markers, week headers)*
23.  ✅ **Sprint Planner:** Organize tasks into 2-week development cycles. *(Added sprintNumber field to tasks table + UI in Task Detail page)*
24.  ✅ **Critical Path Analysis:** Highlight tasks that block the delivery date. *(Added Critical Path section to Project Detail page showing blocked/overdue/due-soon tasks with risk indicators)*
25.  ✅ **Resource Allocation Grid:** View which developer is assigned to which project. *(Created /internal/resources page with team workload visualization)*
26.  ✅ **Milestone Tracker:** Track major deliverables (Alpha, Beta, Gold).
27.  ✅ **Task Dependencies:** Link tasks (Task B cannot start until Task A is done). *(sub_tasks table added)*
28.  ✅ **Workload Balancing:** Warn if a developer is over-assigned. *(Implemented in /internal/resources page with overloaded warnings)*
29.  ✅ **Project Wiki/Docs:** Internal technical documentation per project. *(Added wikiUrl to projects table)*
30.  ✅ **Architecture Diagram Storage:** Place to store system design images. *(Added architectureDiagramUrl to projects table)*
31.  ✅ **Database Schema Planner:** Text-based schema planning tool. *(Added dbSchemaUrl to projects table)*
32.  ✅ **API Endpoint Planner:** List planned API routes before coding. *(Added api_endpoints table with method, path, description, authRequired, status + UI in Project Detail page)*
34.  ✅ **Environment Config Manager:** Track needed env vars (keys) for the project. *(Added environment_configs table with key, environment, description, isSecret + UI in Project Detail page)*
35.  ✅ **Project Health Indicators:** Auto-calculated RAG (Red/Amber/Green) status. *(Added healthStatus to projects table)*
36.  ✅ **Change Request Log:** Track changes to scope after kickoff. *(Added change_requests table)*
37.  ✅ **Meeting Notes Log:** Store technical decisions made in meetings. *(Added meeting_notes table with title, meetingType, notes, actionItems, decisionsJson + UI in Project Detail page)*
38.  ✅ **Decision Record (ADR):** Log "Why we chose Tech X over Tech Y". *(Added decision_records table)*
39.  ✅ **Project Template Library:** Start new projects with standard tasks. *(Created /internal/templates page with add/toggle/delete functionality)*
40.  ✅ **Archive System:** Read-only mode for delivered projects. *(Added deletedAt soft delete field)*

### Module C: Development & Execution
*Focus: The actual coding workflow, task management, and developer tools.*

41.  ✅ **Kanban Board (Dev):** Todo -> In Progress -> Code Review -> QA -> Done.
42.  ✅ **Task Detail View:** Rich text description, acceptance criteria, screenshots.
43.  ✅ **Sub-tasks:** Break complex features into smaller dev steps. *(Added sub_tasks table)*
47.  ✅ **Time Tracking (Task Level):** Developers log hours against specific tasks.
48.  ✅ **Blocker Flagging:** "I am blocked" button that notifies the PM.

52.  🔌 **Error Log Integration:** View recent Sentry errors linked to the project. *(Requires Sentry integration)*
53.  🔌 **Commit History Feed:** Stream of recent commits in the project view. *(Requires GitHub API integration)*
54.  ✅ **Developer Velocity:** Track tasks completed per sprint. *(Added Developer Velocity section to /internal/resources page with completed tasks per user, sprint breakdown, team average)*
56.  ✅ **Local Setup Guide:** Markdown file rendered in-portal for new devs. *(Created /internal/setup-guide page with step-by-step instructions, prerequisites, commands, troubleshooting)*

59.  ✅ **Priority Levels:** Critical, High, Medium, Low.
60.  ✅ **Search:** Global search for tasks across all projects. *(Created /internal/search page with cross-entity search for leads, projects, tasks, clients, users)*

### Module D: Quality Assurance (QA) & Testing
*Focus: Ensuring the software works before delivery.*

61.  ✅ **Bug Tracker:** Dedicated interface for logging and managing defects.
72.  ✅ **Performance Test Log:** Record Lighthouse scores or load test results. *(Added performance_tests table)*
73.  ✅ **Security Scan Results:** Place to paste/link security audit findings. *(Added security_audits table)*
74.  ✅ **Accessibility Audit Log:** Track WCAG compliance issues. *(Added accessibility_audits table with WCAG level, criterion, severity, affected users + UI in Project Detail page)*
75.  ✅ **QA Sign-off:** Formal button for QA Lead to approve a release. *(Added qa_signoffs table with UI)*

80.  ✅ **Mobile Responsiveness Checklist:** Specific checks for mobile view. *(Added mobile_checks table with category, breakpoint, status, device tested + UI in Project Detail with quick-add common checks)*

### Module E: Delivery & Deployment
*Focus: Releasing the software to the client.*

- ✅ **Staging/Production URLs:** Track staging and production URLs per project. *(Added stagingUrl, productionUrl to projects table)*
- ✅ **Repo URL:** Track repository URL. *(Added repoUrl to projects table)*
- ✅ **Tech Stack:** Document project tech stack. *(Added techStack JSON field to projects table)*
- ✅ **Delivery Date:** Track when project was delivered. *(Added deliveredAt to projects table)*

### Module F: Feedback & Optimization (Post-Delivery)
*Focus: Handling client feedback and continuous improvement.*

101. ✅ **Feedback Inbox:** Central place for client emails/comments after launch. *(Added feedback_items table with UI)*

103. ✅ **Change Request (Post-Live):** Handle requests for new features after delivery. *(Added change_requests table)*

106. ✅ **Retrospective Board:** "Start, Stop, Continue" board for the internal team. *(Added retrospectives table with UI)*
107. ✅ **Client Satisfaction Survey (NPS):** Log the client's happiness score. *(Added nps_surveys table with UI)*
108. ✅ **Lessons Learned Log:** Database of mistakes to avoid next time. *(Added lessons_learned table)*
109. ✅ **Maintenance Task Generator:** Auto-create monthly maintenance tasks. *(Added maintenance_tasks table)*
110. ✅ **Support Ticket System:** Internal view of client support requests. *(Added support_tickets table with ticketNumber, title, category, priority, status, assignedToUserId + UI in Project Detail page)*
111. ✅ **System Uptime Monitor:** View uptime status of delivered projects. *(Added system_health table)*
112. 🔌 **Performance Monitoring:** Track Core Web Vitals over time. *(Requires analytics service integration)*
113. 🔌 **Error Rate Monitor:** Track JS errors in production. *(Requires Sentry/logging service integration)*
114. 🔌 **Usage Analytics:** View basic traffic stats (if available). *(Requires analytics service integration)*
115. ✅ **Renewal Reminder:** Alert when maintenance contract needs renewal. *(Added contractRenewalAt, maintenanceContractActive to projects + Renewal Reminders section on dashboard)*
116. ✅ **Case Study Draft:** Prompt to write a case study based on the project. *(Added case_studies table + Case Study section in Project Detail for delivered/closed projects)*
120. ✅ **Process Improvement Suggestion:** Box to suggest changes to the workflow. *(Added process_suggestions table + /internal/suggestions page with submission and review UI)*

---

## Implementation Legend
- ✅ = Implemented (database schema + UI)
- ⏳ = Pending (planned for future)
- 🔌 = Requires External Service (Sentry, GitHub API, Analytics, etc.)

---

## Section 2: Improvements (Quality & Experience)

### UX/UI Improvements (20)
1.  ✅ **Loading Skeletons:** Replace spinners with UI skeletons for perceived speed. *(Created `components/Skeleton/Skeleton.tsx` with `Skeleton`, `SkeletonText`, `SkeletonAvatar`, `SkeletonCard`, `SkeletonTable`, `SkeletonList`, `SkeletonKanban` presets)*
2.  **Optimistic Updates:** Update UI immediately when moving tasks (don't wait for server).
3.  ✅ **Toast Notifications:** Consistent success/error popups. *(Created `context/ToastContext.tsx` with `useToast` hook, integrated into internal portal)*
4.  ✅ **Breadcrumbs:** Clear navigation path (Projects > Project A > Tasks). *(Created `components/Breadcrumbs/Breadcrumbs.tsx` with `InternalBreadcrumbs` helper)*
5.  ✅ **Empty States:** Helpful illustrations when lists are empty. *(Created `components/EmptyState/EmptyState.tsx` with presets for NoTasks, NoProjects, NoResults, NoLeads, NoClients, NoInvoices, NoComments, NoNotes)*
6.  **Keyboard Shortcuts:** `Cmd+S` to save, `Cmd+K` for search.
7.  **Drag-and-Drop:** Smooth DnD for Kanban and file uploads.
8.  **Dark Mode Polish:** Ensure all borders/contrasts are perfect in dark mode.
9.  **Mobile Responsiveness:** Ensure Kanban is usable on tablets/phones.
10. ✅ **Focus Management:** Trap focus in modals for accessibility. *(Created `components/FocusTrap/FocusTrap.tsx` and integrated into ConfirmModal)*
11. ✅ **Inline Editing:** Click a task title to edit it directly. *(Implemented `components/InlineEdit/InlineEdit.tsx` and integrated into TasksView)*
12. ✅ **Filters & Sorting:** Robust filtering for task lists. *(Implemented in `components/TasksView/TasksView.tsx` with status filter, search, and sorting)*
13. ✅ **View Toggles:** Switch between List/Board/Calendar views easily. *(Implemented List/Board toggle in `components/TasksView/TasksView.tsx`)*
14. ✅ **User Avatars:** Show faces on assigned tasks. *(Implemented `components/UserAvatar/UserAvatar.tsx` and integrated into TasksView)*
15. ✅ **Status Colors:** Consistent color coding (Green=Done, Red=Blocked). *(Created `components/StatusBadge/StatusBadge.tsx` with auto-variant detection)*
16. ✅ **Confirmation Modals:** "Are you sure?" for deletions. *(Created `components/ConfirmModal/ConfirmModal.tsx` with danger/warning/default variants)*
17. ✅ **Date Pickers:** User-friendly date range selectors. *(Implemented `components/DatePicker` with `DatePicker` and `DateRangePicker` using `react-day-picker`)*
18. ✅ **Rich Text Editor:** Better editor for task descriptions (TipTap). *(Implemented `components/RichTextEditor` and integrated into Task Detail page)*
19. ✅ **File Previews:** Preview images/PDFs without downloading. *(Implemented `components/FilePreview` and `components/AttachmentList`)*
20. ✅ **Sticky Headers:** Keep column headers visible when scrolling. *(Updated `app/internal/styles.module.css` to ensure table headers are sticky with backdrop blur)*

### Code Quality & Architecture (20)
21.  **Strict TypeScript:** Enable `strictNullChecks` and `noImplicitAny`. *(Deferred - requires ~70+ file fixes)*
22.  ✅ **Zod Validation:** Validate all API inputs and DB outputs. *(Fully implemented: all internal detail page server actions + /api/contact use Zod schemas with safeValidateFormData helper)*
23.  **React Query / SWR:** Use for data fetching and caching state.
24.  **Component Atomicity:** Break large components into small, reusable atoms.
25.  **Custom Hooks:** Extract logic (e.g., `useTaskActions`) from UI.
26.  ✅ **Error Boundaries:** Prevent white screen of death on crashes. *(Enhanced `app/error.tsx`, created `app/internal/error.tsx`)*
27.  ✅ **Centralized Constants:** No magic strings for statuses/roles. *(Created `lib/constants/statuses.ts` with typed enums for all entity statuses aligned with database schema)*
28.  ✅ **Barrel Files:** Clean up `index.ts` exports. *(Added index.ts to component directories)*
29.  **Path Aliases:** Use `@/components` consistently.
30.  **CSS Modules Scoping:** Ensure no class name collisions.
31.  **Server Actions:** Migrate API routes to Server Actions where appropriate.
32.  **Middleware:** Centralize auth and role checks.
33.  ✅ **Logging Service:** Structured logging instead of `console.log`. *(Created `lib/logger.ts` with log levels and context)*
34.  **Type Sharing:** Share types between frontend and backend.
35.  **Dead Code Removal:** Delete unused files and exports.
36.  ✅ **Dependency Audit:** Remove unused npm packages. *(Removed emailjs-com, @react-three/*, three)*
37.  ✅ **Linter Rules:** Add rules for sorting imports and props. *(Added eslint-plugin-import and prettier-plugin-sort-imports)*
38.  ✅ **Prettier Config:** Enforce consistent formatting. *(Added `.prettierrc` and `.prettierignore`, installed prettier, added `npm run format` scripts)*
39.  **Unit Tests:** Add Vitest for utility functions.
40.  **Integration Tests:** Add tests for critical flows (Create Project).

### Performance (10)
41.  **Image Optimization:** Use `next/image` correctly.
42.  **Code Splitting:** Lazy load heavy components (Charts, Editors).
43.  **Bundle Analysis:** Analyze and reduce JS bundle size.
44.  **Server-Side Caching:** Cache heavy DB queries.
45.  **Font Optimization:** Use `next/font` to prevent layout shift.
46.  **Memoization:** Use `useMemo` for expensive calculations.
47.  **Virtualization:** Use `react-window` for long task lists.
48.  ✅ **Debouncing:** Debounce search inputs and auto-saves. *(Created `hooks/useDebounce.ts` with useDebounce, useDebouncedCallback, useThrottledCallback)*
49.  **Database Indexing:** Ensure foreign keys and status columns are indexed.
50.  **Asset Compression:** Compress static images/SVGs.

---

## Section 3: Issues, Flaws & Gaps (Current State)

### Configuration & Setup (10)
6.  ✅ **Pre-commit Hooks:** Husky + lint-staged installed. *(Pre-commit runs ESLint + Prettier on staged files)*
7.  ✅ **License:** MIT LICENSE file added.
8.  ✅ **Improved .gitignore:** Comprehensive patterns for OS, IDE, logs, cache, build artifacts.
9.  ✅ **Dev Dependency Leak:** Moved `drizzle-kit` and `@types/three` from dependencies to devDependencies.
10. ✅ **Engine Locking:** Node version enforced in `package.json`. *(engines.node >= 18.0.0)*

### Database & Data (10)
11. ✅ **Missing Foreign Keys:** Drizzle schema lacks physical foreign key constraints. *(Added references() to all relationship columns in schema.ts)*
12. ✅ **Soft Deletes:** `deletedAt` mechanism added to leads and projects tables.
13. ✅ **Audit Trail:** No system to track "Who changed this task?". *(Implemented logAuditEvent in lib/audit.ts and integrated into task actions)*
14. ✅ **Data Validation:** Zod schemas now guard all internal detail page server actions (Tasks, Projects, Proposals, Leads, Clients, Invoices) and `/api/contact`. Full coverage achieved for database mutation endpoints.
15. ✅ **Enum Hardcoding:** Enums defined in DB schema.
16. ✅ **Index Optimization:** Added indexes on project/lead foreign keys and status columns.
17. ✅ **Seeding:** Database seeding script created. *(scripts/db-seed.ts with sample users, clients, leads, projects, tasks, milestones)*
18. ✅ **Type Safety:** JSON columns are untyped. *(Added .$type<T>() to all JSON columns in schema.ts with types defined in lib/types/json-types.ts)*
19. ✅ **Transaction Safety:** Complex updates aren't wrapped in transactions. *(Added `withTransaction()` helper to lib/db/index.ts for wrapping multi-step operations)*
20. ✅ **Sensitive Data:** User images/emails might be exposed unnecessarily. *(Reviewed: Internal portal requires authentication; email/name display is intentional for team collaboration. User images only shown on protected team page. No public exposure.)*

### API & Backend (10)
21. ✅ **Input Validation:** All internal server actions now use Zod schemas. `/api/contact` uses Zod validation with structured errors.
22. **Error Swallowing:** Errors are caught but not reported structurally. *(Partially addressed: `/api/contact` returns structured 400 errors.)*
23. **Rate Limiting:** No protection against spam/abuse.
24. **Auth Version:** Using older NextAuth v4 pattern.
25. **Role Checks:** Manual `if (role !== 'admin')` checks are error-prone.
26. **Type Safety:** API responses are `any` on the client side.
27. **N+1 Queries:** Potential for inefficient data fetching loops.
28. **Pagination:** Lists return all records; need pagination.
29. **Filtering:** API lacks robust query parameter support.
30. **Timeouts:** Long requests aren't handled gracefully.

### Frontend & UI (10)
31. ✅ **Accessibility:** Icons missing `aria-label`. *(Updated `components/IconSystem/IconWrapper.tsx` to accept ariaLabel and role props)*
32. **Color Contrast:** Some text might be hard to read.
33. ✅ **Loading States:** Improved with Skeleton components. *(components/Skeleton with SkeletonTable, SkeletonList, SkeletonCard, etc.)*
34. ✅ **Error Boundaries:** Error boundaries implemented. *(app/error.tsx enhanced, app/internal/error.tsx created)*
35. **Responsive Design:** Mobile view likely needs work.
36. **Form UX:** Validation only happens on submit.
37. **Prop Drilling:** Data passed down too many layers.
38. ✅ **Hardcoded Strings:** Status constants centralized. *(lib/constants/statuses.ts with typed enums)*
39. **Magic Numbers:** CSS values are hardcoded.
40. **Inconsistent Spacing:** Layout spacing varies across pages.
