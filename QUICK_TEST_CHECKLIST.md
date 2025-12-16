# Quick Testing Checklist - Internal Portal

## ⚡ 5-Minute Quick Test

### 1. Start Server (1 min)
```bash
npm run dev
```
Wait for "✓ Ready" message

### 2. Public Access Test (1 min)
- [ ] Open `http://localhost:3000`
- [ ] See "Portal" link in navbar (far right)
- [ ] See "Portal" link in footer (near social icons)
- [ ] Click navbar Portal link → redirects to `/internal/login`

### 3. Login & Navigation (2 min)
- [ ] Login with admin credentials
- [ ] Sidebar shows 6 sections: Dashboard, Sales, Projects, Financial, Tools, Admin
- [ ] Click "Sales" → expands to Leads/Proposals/Clients
- [ ] Click "Leads" → page loads
- [ ] Active page highlighted in blue

### 4. Theme Test (30 sec)
- [ ] Click moon icon in sidebar footer
- [ ] Page switches to dark mode
- [ ] No light text on light backgrounds visible
- [ ] Click sun icon → returns to light mode

### 5. Role Test (30 sec)
- [ ] Logout, login as PM
- [ ] See Sales, Projects, Financial, Tools
- [ ] ❌ No Admin section visible
- [ ] Logout, login as viewer
- [ ] ❌ No Sales or Financial sections visible

---

## 📋 Component-Level Checklist

### Navbar & Footer Links
- [ ] Navbar: Portal link visible on all public pages
- [ ] Footer: Portal link visible on all public pages
- [ ] Both have lock icon (SVG)
- [ ] Hover increases opacity 0.7 → 1.0
- [ ] Light mode: blue color (#4573df)
- [ ] Dark mode: lighter blue (#6b9fff)

### Sidebar Navigation
- [ ] **Dashboard** - Direct link, always visible
- [ ] **Sales** - Collapsible, admin/pm only
  - [ ] Leads → `/internal/leads`
  - [ ] Proposals → `/internal/proposals`
  - [ ] Clients → `/internal/clients`
- [ ] **Projects** - Collapsible, all roles
  - [ ] All Projects → `/internal/projects`
  - [ ] Tasks → `/internal/tasks`
  - [ ] Resources → `/internal/resources`
- [ ] **Financial** - Collapsible, admin/pm only
  - [ ] Invoices → `/internal/invoices`
  - [ ] Reports → `/internal/reports`
- [ ] **Tools** - Collapsible, all roles
  - [ ] Templates → `/internal/templates`
  - [ ] Bug Tracking → `/internal/bugs`
  - [ ] Suggestions → `/internal/suggestions`
  - [ ] Team → `/internal/team`
- [ ] **Admin** - Collapsible, admin only
  - [ ] Users → `/internal/admin/users`
  - [ ] Audit Logs → `/internal/admin/audit`
  - [ ] Integrations → `/internal/admin/integrations`

### Collapsible Behavior
- [ ] Click section header → expands/collapses
- [ ] Chevron icon rotates 180° when expanded
- [ ] Child items indent correctly
- [ ] Active child highlights parent section
- [ ] Multiple sections can be open simultaneously
- [ ] When sidebar collapsed, sections don't show

### Sidebar Collapse/Expand
- [ ] Click chevron button in header → sidebar narrows to 72px
- [ ] Labels disappear, icons remain
- [ ] Hover over icon → tooltip shows label
- [ ] Click chevron again → sidebar expands to 260px
- [ ] Collapsible sections re-appear

### Theme System
- [ ] Toggle in sidebar footer (sun/moon icon)
- [ ] Instant theme switch (no page reload)
- [ ] **Dashboard** - KPI cards dark background in dark mode
- [ ] **Leads page** - Lead cards properly themed
- [ ] **Projects page** - Project cards properly themed
- [ ] **Tasks page** - Kanban columns properly themed
- [ ] **Admin/Users** - Badge colors visible in both modes
- [ ] **Sidebar** - Background and text colors correct
- [ ] **Forms** - Input fields styled for active theme

---

## 🚨 Common Issues to Check

### Issue 1: Portal Links Not Visible
**Check:**
- Browser console for React errors
- Network tab for failed CSS loads
- Navbar component rendered (not mobile view hiding it)

**Fix:** Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)

### Issue 2: Sidebar Sections Not Expanding
**Check:**
- Browser console for JavaScript errors
- Click directly on section header, not child items
- Sidebar not in collapsed state

**Fix:** Check [InternalSidebar.tsx](components/InternalSidebar/InternalSidebar.tsx) for `expandedSections` state

### Issue 3: Wrong Sections Visible for Role
**Check:**
- User role in database (admin/pm/dev/viewer/qa)
- Case-sensitive role comparison
- Session contains correct role

**Fix:** Logout/login to refresh session

### Issue 4: Dark Mode Shows Light Components
**Check:**
- CSS variables in use (not hardcoded colors)
- [data-theme="dark"] attribute on `<html>` element
- Component imported correct theme CSS module

**Fix:** Check recent 225 theme fixes, verify CSS variable usage

### Issue 5: Active Page Not Highlighted
**Check:**
- `isActive()` function in sidebar
- Current pathname matches link href
- `.active` CSS class applied

**Fix:** Check [InternalSidebar.module.css](components/InternalSidebar/InternalSidebar.module.css) for `.active` styles

---

## 🔍 Debug Commands

```bash
# Check if server is running
curl http://localhost:3000

# Check for TypeScript errors
npm run build

# Run theme consistency checker
npx tsx scripts/check-theme-consistency.ts

# Run API tests (requires server running)
npx tsx scripts/comprehensive-internal-portal-test.ts
```

---

## ✅ Pass Criteria

**Minimum to Pass:**
- ✅ Public portal links work (2/2)
- ✅ Login successful
- ✅ Sidebar shows correct sections for role
- ✅ All 18 links navigate without errors
- ✅ Theme toggle works
- ✅ No visibility issues in dark mode

**Complete Pass:**
- Everything above +
- ✅ Collapsible sections work smoothly
- ✅ Active states highlight correctly
- ✅ Sidebar collapse/expand works
- ✅ Role-based filtering correct
- ✅ All CRUD operations functional

---

## 📸 Visual Reference

### Expected Sidebar (Admin View - Expanded)
```
[Logo]                              [<]
-----------------------------------
Dashboard
Sales                               [v]
  Leads
  Proposals
  Clients
Projects                            [v]
  All Projects
  Tasks
  Resources
Financial                           [v]
  Invoices
  Reports
Tools                               [v]
  Templates
  Bug Tracking
  Suggestions
  Team
Admin                               [v]
  Users
  Audit Logs
  Integrations
-----------------------------------
[User Avatar] username@email
              admin
[Sun/Moon] Light/Dark Mode
[Logout] Sign Out
```

### Expected Navbar Portal Link
```
Home | About | Services | Projects | Article | Contact | Reviews | Careers | [🔒 Portal]
```

### Expected Footer Portal Link
```
© Copyright 2025 Megicode... [🔒 Portal] [LinkedIn] [Instagram] [GitHub]
```

---

## 🎯 Testing Priorities

### P0 - Critical (Must Work)
1. Login/logout functionality
2. Sidebar navigation to all pages
3. Theme switching (light/dark)
4. Role-based section visibility

### P1 - Important (Should Work)
1. Collapsible sections expand/collapse
2. Active page highlighting
3. Public portal links visible
4. Sidebar collapse feature

### P2 - Nice to Have (Can Wait)
1. Smooth animations on transitions
2. Tooltips when sidebar collapsed
3. Parent highlighting when child active
4. Mobile responsiveness

---

**Last Updated**: December 16, 2025  
**Version**: 1.0  
**Related Docs**: 
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Full implementation details
- [COMPLETE_TESTING_GUIDE.md](COMPLETE_TESTING_GUIDE.md) - Comprehensive 10-part testing guide
- [INTERNAL_PORTAL_NAVIGATION_AUDIT.md](INTERNAL_PORTAL_NAVIGATION_AUDIT.md) - Navigation structure analysis
