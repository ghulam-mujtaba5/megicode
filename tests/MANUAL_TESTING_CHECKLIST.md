# Internal Portal Flow Testing Checklist

This checklist helps verify all internal portal features work end-to-end.

## Setup
- [ ] Database migrated: `npm run db:migrate`
- [ ] Database seeded: `npm run db:seed`
- [ ] Dev server running: `npm run dev`
- [ ] Can access http://localhost:3000

---

## 1. Lead Management Flow

### Lead Intake
- [ ] Navigate to http://localhost:3000/contact
- [ ] Fill and submit contact form
- [ ] Verify success message appears
- [ ] Check console for no errors

### Lead Review (Internal)
- [ ] Navigate to /internal/leads
- [ ] Verify seeded leads appear (John Smith, Sarah Johnson)
- [ ] Click on a lead to view details
- [ ] Add a note to the lead
- [ ] Update lead status to "in_review"
- [ ] Verify status change persists

### Lead Approval
- [ ] Change lead status to "approved"
- [ ] Verify lead can be converted to project

---

## 2. Project Management Flow

### Project Creation
- [ ] Navigate to /internal/projects
- [ ] Verify seeded projects appear (Acme E-commerce Platform)
- [ ] Click on project to view details
- [ ] Verify project metadata loads (owner, status, dates)

### Task Management
- [ ] View project tasks
- [ ] Verify seeded tasks appear (setup-repo, auth-system, etc.)
- [ ] Update task status (todo → in_progress → done)
- [ ] Assign task to user
- [ ] Add task comment
- [ ] Verify changes persist

### Milestones
- [ ] View project milestones
- [ ] Verify seeded milestones (Alpha Release, Beta Release, Production Launch)
- [ ] Check milestone dates and status

---

## 3. Business Process Flow

### Process Visualization
- [ ] Navigate to /internal/process
- [ ] Verify process flowchart renders
- [ ] Check that flowchart shows process steps
- [ ] Verify interactive elements work

### Process Instance
- [ ] View running process instance
- [ ] Check current step is highlighted
- [ ] Verify step completion tracking

---

## 4. Proposals & Invoicing Flow

### Proposal Management
- [ ] Navigate to proposals section (if available)
- [ ] Verify seeded proposal exists (Acme E-commerce SOW)
- [ ] View proposal items
- [ ] Check total amount calculation

### Invoice Management
- [ ] Navigate to invoices section
- [ ] Verify seeded invoice exists (INV-1001)
- [ ] View invoice items
- [ ] Check payment status

---

## 5. Bug Tracking Flow

### Bug Reporting
- [ ] Navigate to bugs section
- [ ] Verify seeded bug exists (Checkout button issue)
- [ ] View bug details
- [ ] Update bug status
- [ ] Assign bug to developer

---

## 6. Time Tracking Flow

### Time Entry
- [ ] Navigate to time tracking section
- [ ] Verify seeded time entries exist
- [ ] View time entries by project
- [ ] Check billable status

---

## 7. Client Management Flow

### Client List
- [ ] Navigate to clients section
- [ ] Verify seeded clients (Acme Corporation, TechStart Inc)
- [ ] View client details
- [ ] Check client contacts

---

## 8. Meetings & Notes Flow

### Meeting Management
- [ ] Navigate to meetings section
- [ ] Verify seeded meeting (Sprint Planning)
- [ ] View meeting details
- [ ] Check meeting link and agenda

---

## 9. Attachments Flow

### File Management
- [ ] Navigate to project with attachments
- [ ] Verify seeded attachment (architecture.png)
- [ ] Check attachment metadata (filename, size, type)

---

## 10. Navigation & UI Flow

### Sidebar Navigation
- [ ] Open/close sidebar
- [ ] Navigate between sections
- [ ] Verify active route highlighting
- [ ] Check responsive behavior on mobile

### Theme Switching
- [ ] Toggle light/dark theme
- [ ] Verify theme persists on reload
- [ ] Check all components respect theme

---

## Database Verification

After completing flows, verify DB state:

```bash
# Connect to database (Turso example)
turso db shell your-database

# Check counts
SELECT COUNT(*) FROM users;          -- Should be 4
SELECT COUNT(*) FROM leads;          -- Should be 2
SELECT COUNT(*) FROM clients;        -- Should be 2
SELECT COUNT(*) FROM projects;       -- Should be 2
SELECT COUNT(*) FROM tasks;          -- Should be 5
SELECT COUNT(*) FROM proposals;      -- Should be 1
SELECT COUNT(*) FROM invoices;       -- Should be 1
SELECT COUNT(*) FROM bugs;           -- Should be 1
SELECT COUNT(*) FROM meetings;       -- Should be 1
SELECT COUNT(*) FROM time_entries;   -- Should be 1
```

---

## Automated Testing

Run automated E2E tests:

```bash
# Install Playwright if not already done
npm i -D playwright @playwright/test
npx playwright install chromium

# Run tests
npm run test:e2e

# View results
npx playwright show-report
```

---

## Capture Full Trace

```bash
# Capture DevTools trace
npm run test:trace

# View trace
npx playwright show-trace traces/trace-<timestamp>.zip
```

---

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
- Verify `.env.local` has correct credentials
- Check Turso DB is accessible
- Re-run migrations: `npm run db:migrate`

### Auth Issues
- Verify `NEXTAUTH_SECRET` is set
- Clear browser cookies/local storage
- Check auth provider configuration

---

## Success Criteria

All flows completed successfully when:
- ✅ No console errors
- ✅ All CRUD operations work
- ✅ Data persists across reloads
- ✅ UI responds to user actions
- ✅ DB state matches expectations
- ✅ Automated tests pass
- ✅ Theme switching works
- ✅ Responsive design verified
