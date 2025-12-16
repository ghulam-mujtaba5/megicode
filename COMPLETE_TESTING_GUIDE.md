# Complete Internal Portal Testing Guide

## Overview
Comprehensive testing checklist for the internal portal covering:
- ✅ API functionality
- ✅ Navigation and accessibility
- ✅ Authentication and authorization
- ✅ CRUD operations
- ✅ Theme switching
- ✅ UI/UX consistency

## Prerequisites
- [ ] Dev server running: `npm run dev`
- [ ] Database accessible (for CRUD tests)
- [ ] Test user accounts with different roles (admin, pm, dev, viewer, qa)
- [ ] Environment variables configured (ZOHO_USER, ZOHO_PASS, etc.)

---

## Part 1: Public Website Access

### 1.1 Portal Links Visibility
- [ ] **Navbar**: Navigate to homepage `/`, verify "Portal" link with lock icon in navbar
- [ ] **Footer**: Scroll to footer, verify "Portal" link visible and properly styled
- [ ] **Light Mode**: Verify both links visible and readable in light mode
- [ ] **Dark Mode**: Toggle to dark mode, verify both links visible and styled correctly
- [ ] **Hover Effects**: Hover over both links, verify opacity increases
- [ ] **Click Behavior**: Click each link, verify redirect to `/internal/login`

### 1.2 Responsive Design
- [ ] Desktop (1920px): Portal links visible and properly positioned
- [ ] Tablet (768px): Portal links accessible
- [ ] Mobile (375px): Portal links visible in mobile menu

---

## Part 2: Authentication Flow

### 2.1 Login Page (`/internal/login`)
- [ ] Page loads without errors
- [ ] Form has email and password fields
- [ ] "Sign In" button is visible
- [ ] Form validation shows errors for invalid input
- [ ] Loading state appears during submission
- [ ] Theme switcher works on login page

### 2.2 Authentication Tests
- [ ] **Invalid Credentials**: Enter wrong email/password, verify error message
- [ ] **Valid Admin Login**: Login with admin account, redirects to `/internal` dashboard
- [ ] **Valid PM Login**: Login with PM account, redirects to dashboard
- [ ] **Valid Dev Login**: Login with developer account, redirects to dashboard
- [ ] **Valid Viewer Login**: Login with viewer account, redirects to dashboard

### 2.3 Session Management
- [ ] After login, refresh page - should stay logged in
- [ ] Open new tab, navigate to `/internal` - should stay logged in
- [ ] Close browser, reopen, navigate to `/internal` - session behavior check
- [ ] Logout using sidebar button - redirects to `/internal/login`
- [ ] After logout, try accessing `/internal` - redirects to login

---

## Part 3: Sidebar Navigation Structure

### 3.1 Navigation Visibility (Admin Role)
Login as **admin**, verify sidebar shows:
- [ ] Dashboard (single link)
- [ ] **Sales** (expandable section)
  - [ ] Leads
  - [ ] Proposals
  - [ ] Clients
- [ ] **Projects** (expandable section)
  - [ ] All Projects
  - [ ] Tasks
  - [ ] Resources
- [ ] **Financial** (expandable section)
  - [ ] Invoices
  - [ ] Reports
- [ ] **Tools** (expandable section)
  - [ ] Templates
  - [ ] Bug Tracking
  - [ ] Suggestions
  - [ ] Team
- [ ] **Admin** (expandable section)
  - [ ] Users
  - [ ] Audit Logs
  - [ ] Integrations

### 3.2 Navigation Visibility (PM Role)
Login as **PM**, verify sidebar shows:
- [ ] Dashboard
- [ ] Sales (expandable)
- [ ] Projects (expandable)
- [ ] Financial (expandable)
- [ ] Tools (expandable)
- [ ] ❌ Admin section NOT visible

### 3.3 Navigation Visibility (Dev/Viewer Role)
Login as **Dev or Viewer**, verify sidebar shows:
- [ ] Dashboard
- [ ] ❌ Sales section NOT visible
- [ ] Projects (expandable)
- [ ] ❌ Financial section NOT visible
- [ ] Tools (expandable)
- [ ] ❌ Admin section NOT visible

### 3.4 Collapsible Sections
- [ ] Click "Sales" - expands to show Leads, Proposals, Clients
- [ ] Click "Sales" again - collapses section
- [ ] Expand "Projects" - shows All Projects, Tasks, Resources
- [ ] Multiple sections can be expanded simultaneously
- [ ] Active page's parent section highlights differently

### 3.5 Sidebar Collapse Feature
- [ ] Click collapse button (chevron icon) - sidebar width reduces to 72px
- [ ] Icons remain visible when collapsed
- [ ] Labels disappear when collapsed
- [ ] Hover over icons shows tooltip with label
- [ ] Click expand button - sidebar returns to full width
- [ ] Collapsible sections hidden when sidebar collapsed

### 3.6 Active State Highlighting
- [ ] Current page highlighted in navigation
- [ ] Parent section highlights when child is active
- [ ] Active state visible in both light and dark modes

---

## Part 4: Page Accessibility Tests

### 4.1 Core Pages (All Roles)
- [ ] `/internal` - Dashboard loads, shows KPIs and quick actions
- [ ] `/internal/projects` - Projects list visible
- [ ] `/internal/tasks` - Tasks list or Kanban board visible
- [ ] `/internal/resources` - Resource allocation page loads
- [ ] `/internal/templates` - Template library visible
- [ ] `/internal/bugs` - Bug tracking page loads
- [ ] `/internal/suggestions` - Suggestions list visible
- [ ] `/internal/team` - Team overview page loads

### 4.2 Sales Pages (Admin/PM Only)
- [ ] `/internal/leads` - Leads dashboard visible
- [ ] `/internal/leads/[id]` - Individual lead details load
- [ ] `/internal/leads/board` - Kanban board view works
- [ ] `/internal/proposals` - Proposals list visible
- [ ] `/internal/proposals/[id]` - Proposal details load
- [ ] `/internal/clients` - Client list visible
- [ ] `/internal/clients/[id]` - Client details load

### 4.3 Financial Pages (Admin/PM Only)
- [ ] `/internal/invoices` - Invoice list visible
- [ ] `/internal/invoices/[id]` - Invoice details load
- [ ] `/internal/reports` - Reports dashboard visible

### 4.4 Project Sub-Pages
- [ ] `/internal/projects/[id]` - Project details page loads
- [ ] `/internal/projects/[id]/gantt` - Gantt chart renders
- [ ] `/internal/tasks/[id]` - Task details visible
- [ ] `/internal/tasks/all` - All tasks list loads

### 4.5 Admin Pages (Admin Only)
- [ ] `/internal/admin/users` - User management page
- [ ] `/internal/admin/audit` - Audit logs page
- [ ] `/internal/admin/integrations` - Integrations page
- [ ] `/internal/admin/process` - Process management
- [ ] `/internal/admin/process/new` - New process form

### 4.6 Other Pages
- [ ] `/internal/onboarding` - Onboarding page (new users)
- [ ] `/internal/setup-guide` - Setup guide documentation
- [ ] `/internal/search` - Global search functionality
- [ ] `/internal/instances` - Instance management

---

## Part 5: Theme Switching Tests

### 5.1 Theme Toggle Functionality
- [ ] Login to internal portal
- [ ] Locate theme toggle button in sidebar footer
- [ ] Click toggle - page switches to dark mode instantly
- [ ] Click toggle again - returns to light mode
- [ ] Theme preference persists across page navigations
- [ ] Theme preference persists after logout/login

### 5.2 Visual Consistency - Light Mode
Test on each page type:
- [ ] Dashboard - All KPI cards readable, no dark text on dark bg
- [ ] Leads page - Lead cards properly styled
- [ ] Projects page - Project cards and status badges readable
- [ ] Tasks page - Kanban columns and task cards readable
- [ ] Resources page - Team workload charts visible
- [ ] Admin/Users - Badge colors (active/pending/suspended) visible
- [ ] Gantt chart - Legend and task bars properly colored

### 5.3 Visual Consistency - Dark Mode
Test on each page type:
- [ ] Dashboard - All KPI cards have proper dark backgrounds
- [ ] **No light-colored components visible** (this was the main fix)
- [ ] Text is light colored and readable on dark backgrounds
- [ ] Buttons and inputs have dark backgrounds
- [ ] Modal dialogs have dark backgrounds
- [ ] Dropdown menus styled for dark mode
- [ ] Tables have alternating row colors in dark theme
- [ ] Charts and graphs use dark-mode-appropriate colors

### 5.4 Component-Level Theme Tests
- [ ] **Sidebar**: Background dark, text light, hover states visible
- [ ] **Top Navigation**: Theme toggle icon changes (sun/moon)
- [ ] **Forms**: Input fields dark bg, light text, visible borders
- [ ] **Buttons**: Primary buttons styled correctly in both themes
- [ ] **Cards**: KPI cards, project cards, lead cards all dark
- [ ] **Badges**: Status badges (success/warning/error) visible in both modes
- [ ] **Alerts**: Info/success/warning/error alerts styled correctly
- [ ] **Modals**: Dialog backgrounds and overlays dark themed
- [ ] **Tables**: Headers, rows, and borders dark themed
- [ ] **Charts**: Bar/line/pie charts use theme-appropriate colors

---

## Part 6: API Endpoint Tests

### 6.1 Run Automated API Tests
```bash
npx tsx scripts/comprehensive-internal-portal-test.ts
```
Expected results:
- [ ] All routes return 200 OK or appropriate status
- [ ] Protected routes return 401 without authentication
- [ ] No "fetch failed" errors (dev server must be running)

### 6.2 Manual API Tests
- [ ] POST `/api/contact` - Submit contact form, check email sent
- [ ] GET `/api/posts` - Returns list of blog posts
- [ ] GET `/api/articles` - Returns articles list
- [ ] POST `/api/internal/onboarding` - Create new user (admin only)
- [ ] GET `/api/internal/admin/users` - Returns users list (admin only)

---

## Part 7: CRUD Operations Tests

### 7.1 Leads Management
- [ ] **Create**: Add new lead from `/internal/leads`, fills form, submits successfully
- [ ] **Read**: View lead list, click lead card, details page loads
- [ ] **Update**: Edit lead details, save changes, verify update
- [ ] **Delete**: Delete test lead, confirm removal from list
- [ ] **Board View**: Drag lead between kanban columns, status updates

### 7.2 Projects Management
- [ ] **Create**: Create new project from dashboard or projects page
- [ ] **Read**: View project details, check team members, tasks list
- [ ] **Update**: Edit project name, description, or team
- [ ] **Delete**: Archive or delete test project
- [ ] **Gantt Chart**: View project in Gantt view, verify tasks display

### 7.3 Tasks Management
- [ ] **Create**: Add new task from tasks page or Kanban
- [ ] **Read**: View task details, check assigned user, due date
- [ ] **Update**: Change task status, reassign to different user
- [ ] **Delete**: Delete test task, verify removal
- [ ] **Kanban**: Drag task between columns (To Do → In Progress → Done)

### 7.4 Clients Management (Admin/PM)
- [ ] **Create**: Add new client with contact details
- [ ] **Read**: View client profile, see associated projects
- [ ] **Update**: Edit client information, save changes
- [ ] **Delete**: Remove test client
- [ ] **Navigation**: Access from Sales → Clients in sidebar

### 7.5 Invoices Management (Admin/PM)
- [ ] **Create**: Generate new invoice for client
- [ ] **Read**: View invoice details, line items, total
- [ ] **Update**: Edit invoice items or status
- [ ] **Export**: Download invoice as PDF (if feature exists)
- [ ] **Delete**: Delete test invoice

### 7.6 User Management (Admin Only)
- [ ] **Create**: Add new user via onboarding form
- [ ] **Read**: View users list in `/internal/admin/users`
- [ ] **Update**: Change user role (viewer → dev → pm → admin)
- [ ] **Update**: Change user status (active → suspended → pending)
- [ ] **Delete**: Remove test user account

---

## Part 8: Role-Based Access Control

### 8.1 Admin Role Access
Login as **admin**, verify CAN access:
- [ ] All dashboard features
- [ ] Leads, Proposals, Clients (Sales section)
- [ ] Projects, Tasks, Resources
- [ ] Invoices, Reports (Financial section)
- [ ] All Tools pages
- [ ] Admin section (Users, Audit, Integrations)

### 8.2 PM Role Access
Login as **PM**, verify:
- [ ] ✅ CAN access: Leads, Proposals, Clients, Invoices, Reports
- [ ] ❌ CANNOT access: `/internal/admin/*` routes (should redirect or show 403)

### 8.3 Dev/Viewer Role Access
Login as **Dev or Viewer**, verify:
- [ ] ✅ CAN access: Dashboard, Projects, Tasks, Tools
- [ ] ❌ CANNOT access: Leads, Proposals, Clients, Invoices
- [ ] ❌ CANNOT access: Admin section
- [ ] Direct URL access to restricted pages redirects or shows error

---

## Part 9: UI/UX Tests

### 9.1 Loading States
- [ ] Page transitions show loading animation
- [ ] Form submissions show loading spinner on button
- [ ] Data tables show skeleton loaders while fetching
- [ ] Long operations (imports, exports) show progress indicators

### 9.2 Error Handling
- [ ] Network errors show user-friendly message
- [ ] Form validation errors display inline
- [ ] 404 pages show proper "Not Found" message
- [ ] 403 pages show "Access Denied" for unauthorized routes
- [ ] Error boundaries catch React errors without crashing app

### 9.3 Responsive Design
- [ ] Desktop (1920px): Full sidebar, all features visible
- [ ] Laptop (1366px): Layout adjusts properly
- [ ] Tablet (768px): Sidebar collapses or becomes drawer
- [ ] Mobile (375px): Mobile-optimized navigation

### 9.4 Performance
- [ ] Dashboard loads in < 2 seconds
- [ ] Page transitions feel smooth
- [ ] Large lists (100+ items) paginate or virtualize
- [ ] Images and assets load quickly

### 9.5 Accessibility
- [ ] All interactive elements keyboard-navigable
- [ ] Focus indicators visible
- [ ] Screen reader labels on icon buttons
- [ ] Color contrast meets WCAG AA standards
- [ ] Form inputs have proper labels and ARIA attributes

---

## Part 10: Integration Tests

### 10.1 Search Functionality
- [ ] Navigate to `/internal/search`
- [ ] Enter search query (e.g., project name)
- [ ] Results show relevant items from leads, projects, tasks, clients
- [ ] Click result navigates to correct detail page

### 10.2 Notifications/Alerts
- [ ] Check if notification system exists
- [ ] Create action that triggers notification (e.g., new lead assigned)
- [ ] Verify notification appears
- [ ] Click notification navigates to relevant page

### 10.3 Real-time Updates (If Implemented)
- [ ] Open same page in two browser windows
- [ ] Update data in one window
- [ ] Verify data refreshes in second window

---

## Test Results Summary

### Completion Checklist
- [ ] All public access points working (navbar, footer links)
- [ ] Authentication flow complete for all roles
- [ ] Sidebar navigation shows correct items per role
- [ ] All 35+ pages accessible and load without errors
- [ ] Theme switching works on all pages (light/dark)
- [ ] No visibility issues in dark mode
- [ ] API endpoints respond correctly
- [ ] CRUD operations work for all entities
- [ ] Role-based access control enforced
- [ ] UI/UX polished and responsive

### Known Issues Found
_Document any bugs or issues discovered during testing:_

1. Issue: ____________________
   - Severity: High/Medium/Low
   - Steps to reproduce: ____________________
   - Expected vs Actual: ____________________

### Performance Metrics
- Dashboard load time: _____ ms
- Page transition speed: _____ ms
- Theme toggle response: _____ ms

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Quick Test Commands

```bash
# Start development server
npm run dev

# Run API tests (server must be running)
npx tsx scripts/test-internal-apis.ts

# Run comprehensive tests
npx tsx scripts/comprehensive-internal-portal-test.ts

# Check theme consistency
npx tsx scripts/check-theme-consistency.ts

# Build production bundle
npm run build

# Run production server
npm start
```

---

## Next Steps After Testing

1. **Document all issues** found in GitHub Issues or project management tool
2. **Prioritize fixes**: P0 (critical) → P1 (important) → P2 (nice-to-have)
3. **Create user documentation** for internal portal features
4. **Set up monitoring** for production errors (Sentry, LogRocket, etc.)
5. **Schedule regular audits** (monthly theme consistency checks)

---

**Testing Date**: _______________
**Tested By**: _______________
**Environment**: Development / Staging / Production
**Status**: ✅ Passed / ⚠️ Passed with issues / ❌ Failed

