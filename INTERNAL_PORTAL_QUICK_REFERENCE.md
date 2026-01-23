# Megicode Internal Portal - Quick Reference Guide

**For implementing similar standards in another project**

---

## 📦 What You're Getting

This package contains **complete instructions** from the Megicode Internal Portal development. Use these to apply the same UI/UX patterns, quality standards, and features to another project's main portal.

---

## 🚀 Quick Start

### 1. **Technical Architecture** → `INTERNAL_PORTAL_INSTRUCTIONS_PACKAGE.md`
   - File structure
   - Coding conventions
   - Three-file CSS module system (CRITICAL)
   - Component patterns
   - Theme implementation

### 2. **Feature Specification** → `INTERNAL_PORTAL_FEATURE_SPEC.md`
   - Complete feature list (20 sections)
   - Dashboard, Leads, Projects, Tasks
   - Reports, Invoices, Users, Admin
   - Notifications, Automation
   - Performance & Security requirements

### 3. **Original Documentation** (in your workspace):
   - `.github/copilot-instructions.md` - Main technical guide
   - `INTERNAL_PORTAL_UX_IMPROVEMENTS.md` - UX enhancements applied
   - `INTERNAL_PORTAL_ROADMAP.md` - Feature roadmap
   - `BRAND_PLAYBOOK.md` - Brand guidelines
   - `COMPLETE_TESTING_GUIDE.md` - Testing checklist

---

## 🎨 Key Design Principles

### 1. **Three-File CSS Module System** (MOST IMPORTANT)
Every component must have:
```
ComponentName/
  ComponentName.tsx
  ComponentNameCommon.module.css   (shared styles)
  ComponentNameLight.module.css    (light theme)
  ComponentNameDark.module.css     (dark theme)
```

### 2. **Theme Implementation**
```tsx
const { theme } = useTheme();
const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
className={`${commonStyles.class} ${themeStyles.class}`}
```

### 3. **Component Organization**
- Features organized in folders
- Reusable components in shared areas
- Use `@/` path aliases
- Never hardcode asset paths

### 4. **Animation System**
Use Framer Motion variants:
- `fadeInUp`, `fadeInDown`
- `staggerContainer`
- `scaleOnHover`

---

## 🎯 Essential Features to Implement

### Tier 1 (MVP - Required)
- [ ] Dashboard with KPIs
- [ ] Leads management
- [ ] Projects & Tasks
- [ ] Users & Roles
- [ ] Theme switching (Light/Dark)
- [ ] Responsive design
- [ ] Authentication

### Tier 2 (Important)
- [ ] Invoicing
- [ ] Reports & Analytics
- [ ] Resource allocation
- [ ] Admin panel
- [ ] Sidebar navigation
- [ ] Accessibility (WCAG AA)

### Tier 3 (Nice to Have)
- [ ] Kanban boards
- [ ] Gantt charts
- [ ] Process automation
- [ ] Real-time updates
- [ ] Client portal
- [ ] Mobile app

---

## 📊 Database & API Pattern

### Schema Structure
```
Leads
├── id, name, company, value
├── status, owner, created_at
└── Associated with Clients & Projects

Projects
├── id, name, description, status
├── client_id, team_members
├── budget, timeline
└── Associated with Tasks & Invoices

Tasks
├── id, title, description
├── assigned_to, status, due_date
├── project_id, priority
└── Time tracking data

Invoices
├── id, client_id, amount, status
├── line_items, due_date
└── Payment tracking

Users
├── id, email, role, status
├── permissions, created_at
└── Audit trail
```

### API Pattern
```tsx
// GET - Fetch data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Auth check
  // Fetch data
  return NextResponse.json(data);
}

// POST - Create data
export async function POST(request: NextRequest) {
  // Auth check
  // Parse request
  // Validate
  // Save
  return NextResponse.json({ success: true });
}
```

---

## 🎨 Design System

### Colors
```css
Primary: #4573df
Primary Dark: #2d4fa2
Secondary: #ff9800

Light Mode:
  Background: #ffffff
  Surface: #f5f7fa
  Text: #23272f

Dark Mode:
  Background: #181c22
  Surface: #1f2937
  Text: #e5e7eb
```

### Typography
```css
Fonts: Open Sans (body), Poppins (UI), Inter (code)

H1: 40px bold
H2: 32px bold
H3: 23px semibold
Body: 16px regular
Caption: 14px regular
```

### Responsive
```css
Desktop: 1920px - full sidebar
Laptop: 1366px - collapsible sidebar
Tablet: 768px - drawer nav
Mobile: 375px - mobile optimized
```

---

## ✅ Quality Standards

### Before Deployment
- [ ] TypeScript: `tsc --noEmit` (no errors)
- [ ] Linting: `npm run lint` (no issues)
- [ ] Build: `npm run build` (successful)
- [ ] Manual Testing: All pages, all themes, all roles
- [ ] Accessibility: WCAG AA compliance
- [ ] Performance: < 2s dashboard load

### Testing Checklist
- [ ] Theme switching works everywhere
- [ ] No light elements in dark mode
- [ ] All navigation items visible per role
- [ ] Forms validate correctly
- [ ] Loading states display
- [ ] Error messages clear
- [ ] Responsive on all breakpoints
- [ ] CRUD operations work
- [ ] Role-based access enforced

### Performance Targets
- Dashboard: < 2 seconds
- List pages: < 1.5 seconds  
- Page transitions: < 500ms
- API responses: < 500ms
- Bundle size: < 200KB

---

## 🔐 Security Checklist

### Authentication
- [ ] Secure password hashing
- [ ] Session management
- [ ] CSRF protection
- [ ] Rate limiting

### Authorization
- [ ] Role-based access control
- [ ] Fine-grained permissions
- [ ] Resource-level checks
- [ ] Audit logging

### Data Protection
- [ ] HTTPS only
- [ ] Input validation
- [ ] Output escaping
- [ ] SQL injection prevention (ORM)
- [ ] XSS protection

---

## 📱 Navigation Structure

### Sidebar (Expandable Sections)
```
Dashboard
├── Sales
│   ├── Leads
│   ├── Proposals
│   └── Clients
├── Projects
│   ├── All Projects
│   ├── Tasks
│   └── Resources
├── Financial
│   ├── Invoices
│   └── Reports
├── Tools
│   ├── Templates
│   ├── Bug Tracking
│   └── Team
└── Admin (admin only)
    ├── Users
    └── Audit Logs
```

### Role Visibility
- **Admin**: All sections
- **PM**: All except Admin
- **Dev**: Dashboard, Projects, Tools only
- **Viewer**: Dashboard, Projects (read-only)

---

## 🔧 Development Workflow

### Component Creation
1. Create feature folder: `components/FeatureName/`
2. Create component file: `FeatureName.tsx` with `"use client"`
3. Create three CSS modules:
   - `FeatureNameCommon.module.css` (shared)
   - `FeatureNameLight.module.css` (light theme)
   - `FeatureNameDark.module.css` (dark theme)
4. Import both theme styles
5. Use `useTheme()` hook for conditional styling
6. Add accessibility features (ARIA, semantic HTML)

### Page Creation
1. Create page folder: `app/feature/`
2. Create `page.tsx` with `"use client"` if interactive
3. Add metadata export for SEO
4. Use layout components (Sidebar, TopNav)
5. Implement role-based access check
6. Add loading state with Suspense
7. Test on all breakpoints

### API Route Creation
1. Create route file: `app/api/feature/route.ts`
2. Implement GET/POST/etc handlers
3. Add authentication check
4. Validate user role/permissions
5. Validate request data
6. Use database ORM for queries
7. Return appropriate status codes
8. Handle errors gracefully

---

## 🧪 Testing Commands

```bash
# Development
npm run dev                   # Start dev server

# Testing
npm run lint                  # ESLint check
tsc --noEmit                 # TypeScript check
npm run build                # Production build

# Validation
npm run test                 # Run tests (if setup)
npm run test:e2e             # E2E tests (if setup)

# Database
npm run db:push              # Apply migrations
npm run db:studio            # View database
```

---

## 📝 Common Issues & Solutions

### Issue: Light-colored text in dark mode
**Solution**: Ensure using separate `DarkMode.module.css` with proper text colors

### Issue: Forms not submitting
**Solution**: Check CSRF token, validate input server-side, check API route

### Issue: Slow page load
**Solution**: Add pagination, implement virtual scrolling, optimize queries, use caching

### Issue: Theme not persisting
**Solution**: Use localStorage in ThemeContext, ensure persistence on mount

### Issue: Mobile menu not closing
**Solution**: Add onClick handler to close drawer after navigation

---

## 📚 File References

### In Your Workspace
- `.github/copilot-instructions.md` - Technical guide
- `components/` - Example components
- `app/internal/` - Portal pages
- `utils/animations.ts` - Animations
- `context/ThemeContext.tsx` - Theme setup
- `styles/` - Global CSS

### New Files Created (This Package)
- `INTERNAL_PORTAL_INSTRUCTIONS_PACKAGE.md` - Complete technical guide
- `INTERNAL_PORTAL_FEATURE_SPEC.md` - Feature specifications
- `INTERNAL_PORTAL_QUICK_REFERENCE.md` - This file

---

## 🎓 Learning Path

### Week 1: Foundation
- [ ] Read `INTERNAL_PORTAL_INSTRUCTIONS_PACKAGE.md`
- [ ] Study three-file CSS module system
- [ ] Review existing components
- [ ] Setup project structure

### Week 2: Components
- [ ] Create first themed component
- [ ] Implement theme switching
- [ ] Add animations
- [ ] Test on mobile

### Week 3: Features
- [ ] Build dashboard
- [ ] Implement CRUD pages
- [ ] Add authentication
- [ ] Connect to database

### Week 4: Polish
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Testing & QA
- [ ] Deployment

---

## 🚀 Next Steps

1. **Read the full guides**:
   - `INTERNAL_PORTAL_INSTRUCTIONS_PACKAGE.md` (Technical)
   - `INTERNAL_PORTAL_FEATURE_SPEC.md` (Features)

2. **Review existing implementations**:
   - Check `components/` folder for patterns
   - Study `app/internal/` pages
   - Understand `context/ThemeContext.tsx`

3. **Start building**:
   - Setup project structure
   - Create first component with three-file CSS
   - Implement theme switching
   - Add first feature

4. **Validate**:
   - Run TypeScript checks
   - Run ESLint
   - Manual testing
   - Performance audit
   - Accessibility audit

5. **Deploy**:
   - Prepare production build
   - Create backups
   - Deploy to staging
   - Test production
   - Deploy to production

---

## 📞 Quick Help

### TypeScript Error?
```bash
npx tsc --noEmit
```

### ESLint Issue?
```bash
npm run lint -- --fix
```

### Need to check component pattern?
Look at: `components/AboutHero/` or similar component

### Need animation example?
Check: `utils/animations.ts` and usage in pages

### Need database example?
Check: `app/internal/page.tsx` or similar

### Need API example?
Check: `app/api/contact/route.ts`

---

**Version**: 1.0
**Created**: January 24, 2026
**Language**: Next.js 15, React 19, TypeScript
**Status**: ✅ Production Ready

This package is ready to use for implementing the same standards in another project!

