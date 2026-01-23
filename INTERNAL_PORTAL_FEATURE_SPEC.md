# Megicode Internal Portal - Complete Feature Specification

**For implementing in another project's main portal**

---

## 📋 Feature Overview

This document outlines all features implemented in the Megicode Internal Portal that should be replicated in the main portal.

---

## 1. DASHBOARD

### Components
- KPI Cards (4 main metrics)
  - Total Revenue
  - Active Projects
  - Team Productivity
  - Client Satisfaction Score
- Quick Action Buttons
  - Create New Lead
  - Create New Project
  - Add Task
  - View Reports
- Activity Feed
  - Recent updates from projects
  - New leads assigned
  - Completed tasks
  - Upcoming deadlines

### Data Requirements
- Real-time data from database
- Refresh interval: 5-10 seconds or manual refresh
- Caching strategy for performance

### Interactions
- Click KPI card to navigate to detailed reports
- Expandable activity items for more info
- Quick actions have loading states
- Theme switching available

---

## 2. LEAD MANAGEMENT

### Leads List Page (`/leads`)
**Features:**
- Table view with columns: Name, Company, Status, Value, Created Date
- Filter by status (New, Contacted, Proposal Sent, Won, Lost)
- Sort by any column
- Search by name or company
- Create new lead button
- Row actions: View, Edit, Delete, Convert to Project

**UI Elements:**
- Responsive table with pagination (20 items per page)
- Status badges with color coding
- Avatar/initials for lead owner
- Quick view modal on click

### Lead Kanban Board (`/leads/board`)
**Features:**
- Columns: New → Contacted → Proposal Sent → Negotiation → Won/Lost
- Drag & drop tasks between columns
- Card shows: Lead name, value, owner, due date
- Click card to open details
- Update status on drag
- Add new lead button above columns

**Performance:**
- Virtual scrolling for large lists
- Optimistic UI updates
- WebSocket for real-time sync (optional)

### Lead Details Page (`/leads/[id]`)
**Information:**
- Lead name, company, contact person
- Email, phone, location
- Company size, industry, budget
- Status timeline
- Communication history
- Associated opportunities
- Edit form with save/cancel
- Convert to Project button
- Delete option

**Interactions:**
- Save changes with validation
- Add notes/comments
- Log calls/emails
- Attach documents
- Set reminders
- Assign to team member

---

## 3. PROJECT MANAGEMENT

### Projects List Page (`/projects`)
**Display:**
- Grid or list view toggle
- Cards showing: Project name, status, team members, progress, due date
- Filter by status (Planning, Active, On Hold, Completed)
- Sort by date, priority, or client
- Search functionality

**Actions:**
- Create new project
- Click project to view details
- Edit project
- Archive project
- Delete project (admin only)

**Status Indicators:**
- Color-coded status badges
- Progress bar showing completion
- Alert for overdue projects
- Resource allocation indicator

### Project Details Page (`/projects/[id]`)
**Tabs:**
- Overview (description, status, timeline, budget)
- Team Members (assigned roles, availability)
- Tasks (associated tasks, completion status)
- Files (project documents, assets)
- Timeline (Gantt chart)
- Budget & Profitability
- Communication

**Information:**
- Project name, description, status
- Client info and contact
- Project manager and team
- Start and end dates
- Budget and actual spend
- Progress percentage
- Recent activity

### Gantt Chart View (`/projects/[id]/gantt`)
**Features:**
- Timeline view of all project tasks
- Task bars showing duration
- Dependency lines between tasks
- Drag to reschedule tasks
- Zoom in/out
- Critical path highlighting
- Resource allocation view
- Milestone markers

---

## 4. TASK MANAGEMENT

### Tasks Kanban Board (`/tasks`)
**Layout:**
- Columns: Backlog → To Do → In Progress → In Review → Done
- Drag & drop between columns
- Card details: Task title, priority, assignee, due date
- Group by: Status (default), Priority, Assignee, Project

**Features:**
- Create new task
- Quick edit on card
- Click card for full details
- Search and filter
- Bulk actions (assign, change priority, delete)
- Swimlane view option

**Performance:**
- Pagination per column
- Virtual scrolling
- Optimistic updates

### Task Details Page (`/tasks/[id]`)
**Information:**
- Task title, description, priority
- Assigned to, reporter, status
- Due date and time tracking
- Subtasks (if any)
- Related tasks/dependencies
- Attachments
- Comments/discussion thread
- History/activity log

**Interactions:**
- Change status
- Reassign task
- Update priority
- Add subtasks
- Add comments
- Add attachments
- Log time spent
- Create related tasks

---

## 5. RESOURCE MANAGEMENT

### Resources Page (`/resources`)
**Team Overview:**
- Collapsible team member cards
- Member info: Name, email, role, avatar
- Workload indicator (visual bar)
- Current task count
- Project count
- Availability status

**Expandable Details:**
- List of assigned tasks
- Project allocations
- Workload percentage
- Availability calendar
- Billable hours this month
- Performance metrics

**Features:**
- Filter by role or team
- Sort by workload or availability
- Bulk assignment
- Capacity planning view
- Vacation/time-off marking
- Skill matrix display

**Performance:**
- Collapsible reduces initial render
- ~60% reduction in page height
- Expand on demand

---

## 6. REPORTING & ANALYTICS

### Reports Dashboard (`/reports`)
**Key Metrics:**
- Revenue (total, by project, by client)
- Project profitability (top 10, expandable for all)
- Team productivity (tasks completed, velocity)
- Client satisfaction scores
- Pipeline value
- Forecast for next quarter

**Charts:**
- Revenue trend (line chart)
- Project status breakdown (pie chart)
- Team productivity (bar chart)
- Budget vs. actual (stacked bar)
- Lead conversion rate (funnel)

**Interactivity:**
- Hover for details
- Click for drill-down
- Date range selector
- Export to CSV/PDF
- Save custom reports

### Project Profitability Report
**Display:**
- Table: Project name, budget, actual spend, profit/loss
- Sortable and filterable
- Show top 10 by default
- "Show All" button for complete list
- Color coding: Green (profit), Red (loss)
- Pie chart for profit distribution

---

## 7. INVOICING & BILLING

### Invoices List (`/invoices`)
**Display:**
- Table with: Invoice number, client, amount, status, due date, date created
- Filter by status (Draft, Sent, Paid, Overdue)
- Search by invoice number or client
- Create new invoice

**Actions:**
- View invoice details
- Edit invoice (draft only)
- Send invoice (email)
- Mark as paid
- Generate PDF
- Delete invoice

### Invoice Details (`/invoices/[id]`)
**Components:**
- Invoice header (number, date, due date)
- Client information
- Line items (description, qty, unit price, total)
- Subtotal, tax, total
- Payment terms
- Payment status
- Notes
- History of communications

**Features:**
- Edit line items
- Apply discounts
- Add taxes
- Send reminders
- Track payment status
- Export as PDF

---

## 8. AUTHENTICATION & AUTHORIZATION

### Login Page (`/internal/login`)
**Features:**
- Email and password fields
- Form validation
- Error messages
- Loading state
- Theme toggle available
- Quick login buttons (if enabled)
  - Admin role button
  - PM role button
  - Developer role button
  - QA role button
- Custom email/password input

**Security:**
- Server-side validation
- Email whitelist check
- Rate limiting on attempts
- Secure session management
- CSRF protection

### Quick Login (Dev Mode)
**Activation:**
- Controlled by `NEXT_PUBLIC_DEV_LOGIN_ENABLED` env var
- Only available in development or when explicitly enabled
- Still requires email to be in whitelist

**Features:**
- Quick login buttons with emojis
- Preset role shortcuts
- Custom email input
- Loading indicators
- UX enhancements (visual feedback)

---

## 9. USER MANAGEMENT (Admin Only)

### Users List (`/admin/users`)
**Display:**
- Table with: Name, email, role, status, last login, actions
- Filter by role, status
- Search by name or email
- Create new user button

**Actions:**
- View user details
- Edit user (role, permissions)
- Change password
- Suspend/activate user
- Delete user
- View user activity

### User Creation (`/admin/users/new`)
**Form Fields:**
- First name, last name
- Email
- Role (Admin, PM, Developer, Viewer)
- Permissions (if applicable)
- Send welcome email checkbox

**Validation:**
- Email uniqueness
- Required fields
- Strong password (if applicable)
- Email format validation

---

## 10. AUDIT & COMPLIANCE

### Audit Logs (`/admin/audit`)
**Display:**
- Table with: User, action, resource, timestamp, changes
- Filter by user, action type, date range
- Search functionality
- Export to CSV

**Information:**
- What changed
- Who changed it
- When it changed
- Previous value
- New value
- IP address (optional)

**Features:**
- Real-time updates
- Detailed drill-down
- Export capabilities
- Archive old logs
- Search by any field

---

## 11. SYSTEM INTEGRATION

### Settings Page (`/admin/integrations`)
**Integrations:**
- ClickUp (bi-directional sync)
- GitHub (commit linking)
- Slack (notifications)
- Email (SMTP configuration)
- Stripe (payment processing)

**For Each Integration:**
- Connection status (connected/disconnected)
- Test connection button
- Configuration options
- Sync frequency settings
- Authentication tokens (secure display)
- Logs of sync activities
- Disconnect option

---

## 12. NAVIGATION & LAYOUT

### Sidebar Navigation
**Structure:**
- Logo at top
- Main navigation items
- Expandable sections
- Active page highlighting
- Collapse/expand toggle
- User profile at bottom
- Theme switcher at bottom

**Visibility Control:**
- Role-based item visibility
- Collapsible sections
- Hover tooltips
- Icon + label in expanded state
- Icon only in collapsed state

### Top Navigation Bar
**Components:**
- Breadcrumb trail
- Page title
- Search box (optional)
- Theme toggle button
- Notifications icon
- User profile menu

### Mobile Navigation
**Features:**
- Hamburger menu (top left)
- Drawer navigation
- Touch-friendly spacing
- Same navigation structure as desktop
- Close on item selection

---

## 13. NOTIFICATIONS & ALERTS

### System Notifications
**Types:**
- New lead assigned
- Task assigned
- Project status change
- Invoice sent/paid
- Deadline approaching
- System alerts

**Delivery:**
- In-app notifications (top-right)
- Email notifications (daily digest)
- Slack notifications (optional)
- Browser notifications (PWA)

**Features:**
- Mark as read
- Dismiss
- Set preferences per notification type
- Do Not Disturb hours
- Notification center with history

---

## 14. PROCESS AUTOMATION

### Workflow Engine
**Features:**
- Process diagrams (BPMN-style)
- Swimlane visualization
- Step execution
- Automated actions
- Conditional branching
- Task generation triggers
- Email notifications
- Slack integration

**Use Cases:**
- Lead to project conversion
- Project delivery process
- Invoice approval workflow
- Onboarding automation

---

## 15. PERFORMANCE STANDARDS

### Load Times
- Dashboard: < 2 seconds
- List pages: < 1.5 seconds
- Detail pages: < 2 seconds
- Page transitions: < 500ms

### Data Limits
- Tables: Max 50 items per page (pagination)
- Search: Debounce 300ms
- Real-time updates: Every 5-10 seconds
- Timeout: 30 seconds for API calls

### Caching
- Dashboard data: 30 seconds
- List data: 1 minute
- Detail pages: 2 minutes
- User profile: Session duration

---

## 16. SECURITY REQUIREMENTS

### Authentication
- Secure password hashing
- Session-based or JWT auth
- CSRF token on forms
- Rate limiting on login attempts

### Authorization
- Role-based access control (RBAC)
- Fine-grained permissions
- Resource-level security checks
- Audit logging of access

### Data Protection
- HTTPS only
- Secure headers (CSP, X-Frame-Options)
- Input validation on all forms
- Output escaping
- SQL injection prevention (use ORM)

---

## 17. ACCESSIBILITY REQUIREMENTS

### WCAG 2.1 AA Compliance
- Keyboard navigation on all pages
- Screen reader compatibility
- Color contrast (4.5:1 for text)
- Focus indicators visible
- Form labels and ARIA attributes
- Semantic HTML
- Alternative text for images
- Skip navigation links

### Testing
- Automated accessibility audit
- Manual testing with screen reader
- Keyboard-only navigation test
- Color contrast analyzer
- Focus management verification

---

## 18. TESTING CHECKLIST

### Unit Tests
- API endpoints return correct data
- Authentication guards work
- Validation functions pass
- Utility functions correct

### Integration Tests
- Database operations work end-to-end
- API and UI integration
- Third-party integrations (ClickUp, GitHub)
- Email sending functionality

### E2E Tests
- User can login
- Navigation between pages works
- CRUD operations complete
- Forms submit successfully
- Theme switching works
- Role-based access enforced

### Performance Tests
- Page load times acceptable
- Database queries optimized
- No memory leaks
- Bundle size acceptable
- API response times < 500ms

---

## 19. DEPLOYMENT REQUIREMENTS

### Pre-Deployment
- All tests passing
- TypeScript validation passes
- ESLint passes
- Code review approved
- Staging environment tested
- Database migrations prepared
- Backups created

### Post-Deployment
- Monitor error logs
- Verify all features working
- Check database connectivity
- Monitor performance metrics
- Verify integrations working
- Confirm no data loss

---

## 20. FUTURE ENHANCEMENTS

### Phase 2 Features
- Advanced analytics and dashboards
- Custom reporting builder
- Budget forecasting
- Resource capacity planning
- Time tracking integration
- Expense management

### Phase 3 Features
- Client portal (restricted access)
- Mobile app (iOS/Android)
- AI-powered insights
- Automated task estimation
- Advanced workflow builder
- Custom integrations API

---

**Version**: 1.0
**Last Updated**: January 24, 2026
**Status**: Production Ready

