# Megicode Internal Portal - Complete Instructions Package

**For applying to another project's main portal**

---

## 📚 Contents
This package contains all instructions, guidelines, and standards used in developing the Megicode Internal Portal. Use these as a reference for UI/UX design, quality standards, and feature implementation.

---

## 1. TECHNICAL ARCHITECTURE GUIDE

### File Structure
```
app/
  ├── internal/              # Internal portal pages
  ├── api/                   # API route handlers
  └── [feature]/             # Feature pages

components/
  ├── [Feature]/             # Feature components
  │   ├── FeatureName.tsx
  │   ├── FeatureNameCommon.module.css
  │   ├── FeatureNameLight.module.css
  │   └── FeatureNameDark.module.css
  └── Common UI components

context/
  └── ThemeContext.tsx       # Theme management

hooks/
  ├── useIntersectionObserver.ts
  ├── usePageView.ts
  └── Custom React hooks

lib/
  ├── logo.ts                # Asset paths
  └── Shared utilities

utils/
  ├── animations.ts          # Framer Motion variants
  └── Helpers

styles/
  └── Global CSS
```

### Key Architectural Principles

1. **Three-File CSS Module System (CRITICAL)**
   Every themed component must have:
   - `ComponentCommon.module.css` - Shared styles (always applied)
   - `ComponentLight.module.css` - Light theme only
   - `ComponentDark.module.css` - Dark theme only

2. **Server/Client Component Pattern**
   - Pages use `"use client"` directive for interactivity
   - Layouts remain server components where possible
   - Use `dynamic()` imports for code-splitting large components

3. **Component Organization**
   - Components organized by feature folder
   - Each feature is self-contained
   - Reusable components in shared areas

4. **Theme Implementation**
   ```tsx
   import commonStyles from './ComponentCommon.module.css';
   import lightStyles from './ComponentLight.module.css';
   import darkStyles from './ComponentDark.module.css';
   import { useTheme } from '@/context/ThemeContext';

   export function Component() {
     const { theme } = useTheme();
     const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
     
     // Apply both: className={`${commonStyles.class} ${themeStyles.class}`}
   }
   ```

---

## 2. CODING CONVENTIONS & BEST PRACTICES

### Import Standards
- Use `@/` path alias for absolute imports from project root
- Import logos from `@/lib/logo.ts` - never hardcode paths
- Group imports: React → Next.js → Components → Utilities

### Component Patterns
```tsx
// ✅ DO: Client component with theme support
"use client";
import { useTheme } from '@/context/ThemeContext';

export function MyComponent() {
  const { theme } = useTheme();
  // implementation
}

// ❌ DON'T: Skip "use client" on components using hooks
// ❌ DON'T: Mix theme styles in single CSS file
// ❌ DON'T: Hardcode asset paths
```

### Animation System
Use shared Framer Motion variants from `utils/animations.ts`:
- `fadeInUp` - Fade in with upward motion
- `fadeInDown` - Fade in with downward motion
- `staggerContainer` - For staggered child animations
- `fadeIn(direction, delay)` - Directional fade with delay
- `scaleOnHover` - Hover scale interactions

### Metadata & SEO
- Export `metadata` objects from page files
- Follow Next.js metadata conventions
- Use dynamic metadata generation where needed

### Loading States
- Use `<LoadingAnimation size="medium" />` for Suspense fallbacks
- Implement skeleton loaders for data tables
- Show progress indicators for long operations

### Accessibility
- Include ARIA labels on all interactive elements
- Use semantic HTML (button, nav, section, etc.)
- Add screen-reader-only headings where needed
- Maintain color contrast for WCAG AA compliance
- Ensure keyboard navigation works throughout

---

## 3. UI/UX DESIGN STANDARDS

### Theme System
**Primary Colors:**
- Primary Blue: `#4573df`
- Primary Dark: `#2d4fa2`
- Secondary Orange: `#ff9800`

**Light Mode:**
- Background: `#ffffff`
- Surface: `#f5f7fa`
- Text: `#23272f`
- Border: `rgba(107, 114, 128, 0.15)`

**Dark Mode:**
- Background: `#181c22`
- Surface: `#1f2937`
- Text: `#e5e7eb`
- Border: `rgba(255, 255, 255, 0.1)`

### Typography
- Primary Font: Open Sans
- Secondary Font: Poppins
- UI Font: Inter
- Fallback: Arial, sans-serif

**Scale:**
- H1: 40px (2.5rem) - Bold
- H2: 32px (2rem) - Bold
- H3: 23.2px (1.45rem) - Semibold
- Body: 16px (1rem) - Regular
- Caption: 14px (0.875rem) - Regular

### Component Structure
- **Sidebar Navigation**: Expandable sections, role-based visibility
- **Top Navigation**: Theme toggle, user profile
- **Dashboard**: KPI cards, quick actions, activity feed
- **Data Tables**: Pagination, sorting, filtering
- **Forms**: Clear labels, inline validation, loading states
- **Modals**: Overlay, centered, proper focus management

### Responsive Design
- Desktop (1920px): Full sidebar, all features visible
- Laptop (1366px): Sidebar collapses on demand
- Tablet (768px): Mobile-optimized sidebar
- Mobile (375px): Drawer navigation, optimized spacing

### Loading & Error Handling
- Network errors: User-friendly messages
- Form validation: Inline error display
- 404 Pages: "Not Found" message
- 403 Pages: "Access Denied" message
- Use error boundaries for React errors

---

## 4. NAVIGATION & ROLE-BASED ACCESS

### Sidebar Structure (Admin View)
```
Dashboard
├── Sales (expandable)
│   ├── Leads
│   ├── Proposals
│   └── Clients
├── Projects (expandable)
│   ├── All Projects
│   ├── Tasks
│   └── Resources
├── Financial (expandable)
│   ├── Invoices
│   └── Reports
├── Tools (expandable)
│   ├── Templates
│   ├── Bug Tracking
│   ├── Suggestions
│   └── Team
└── Admin (expandable)
    ├── Users
    ├── Audit Logs
    └── Integrations
```

### Role-Based Visibility
**Admin**: All navigation items visible
**PM**: Sales, Projects, Financial, Tools (no Admin section)
**Developer**: Dashboard, Projects, Tools (no Sales/Financial)
**Viewer**: Dashboard, Projects, Tools (limited access)

---

## 5. TESTING STANDARDS

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Theme switching works on all pages
- [ ] No visibility issues in light/dark mode
- [ ] Navigation is intuitive and accessible
- [ ] Forms validate correctly
- [ ] Loading states display properly
- [ ] Error messages are clear
- [ ] Responsive design works on all breakpoints
- [ ] CRUD operations function correctly
- [ ] Role-based access is enforced

### Automated Testing
- **TypeScript**: `npx tsc --noEmit` - No type errors
- **ESLint**: `npm run lint` - No linting issues
- **Build**: `npm run build` - Successful production build
- **API Tests**: Verify all endpoints respond correctly
- **Theme Tests**: Verify no light elements in dark mode

### Performance Standards
- Dashboard loads in < 2 seconds
- Page transitions feel smooth
- Large lists pagination/virtualize
- Images optimized with Next.js Image component

---

## 6. FEATURE IMPLEMENTATION GUIDELINES

### Dashboard Features
- KPI cards with real-time data
- Quick action buttons
- Activity feed
- Recent items (leads, projects, tasks)
- Upcoming deadlines/renewals

### Lead Management
- Lead list view
- Kanban board (New → Contacted → Proposal → Won/Lost)
- Lead detail page
- Conversion to project
- Pipeline tracking

### Project Management
- Project list with status
- Kanban task board
- Gantt chart view
- Calendar view for deadlines
- Team member allocation
- Resource workload tracking

### Financial Management
- Invoice list
- Invoice details with line items
- Payment status tracking
- Project profitability reports
- Financial dashboard with KPIs

### Admin Features
- User management (CRUD)
- Role assignment
- Audit log viewing
- System integrations setup
- Process workflow management

### Quality Standards for Features
- **Completeness**: All core functionality implemented
- **Data Integrity**: Real database connection (no mock data)
- **Performance**: Optimized queries, pagination for large lists
- **Accessibility**: WCAG AA compliance
- **Security**: Proper authorization checks on all endpoints
- **Documentation**: Clear comments for complex logic

---

## 7. DATABASE & API INTEGRATION

### ORM Pattern
- Use Drizzle ORM for type-safe queries
- Connection pooling with single client instance
- Prepared statements for security
- Transaction support with error handling

### API Route Structure
```tsx
// app/api/[feature]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Validate auth
  // Fetch data
  // Return response
}

export async function POST(request: NextRequest) {
  // Validate auth
  // Parse request
  // Validate input
  // Save data
  // Return success
}
```

### Query Optimization
- Use indexes on frequently queried columns
- Implement pagination for large result sets
- Select only needed columns
- Use eager loading for relationships
- Cache frequently accessed data

---

## 8. DEPLOYMENT & ENVIRONMENT

### Environment Variables
```
NEXT_PUBLIC_SITE_URL=              # Base URL
NEXT_PUBLIC_DEV_LOGIN_ENABLED=     # Enable quick login
DATABASE_URL=                      # Database connection
ZOHO_USER=                         # Email SMTP
ZOHO_PASS=                         # Email SMTP
```

### Build Commands
```bash
npm run dev              # Development server
npm run build            # Production build
npm run lint             # ESLint check
npm run start            # Production server
npm run generate-meta    # Generate meta images
```

### Deployment Checklist
- [ ] All environment variables set
- [ ] TypeScript validation passing
- [ ] ESLint checks passing
- [ ] Build successful
- [ ] Manual testing completed
- [ ] Database migrated
- [ ] Backups created
- [ ] Deployment monitored

---

## 9. PERFORMANCE OPTIMIZATION

### Code Splitting
- Use `dynamic()` imports for large components
- Lazy load heavy libraries
- Bundle analysis with `@next/bundle-analyzer`

### Image Optimization
- Use Next.js `<Image>` component
- Provide responsive sizes
- Use appropriate formats (WebP, AVIF)

### Database Performance
- Implement query caching
- Use pagination (20-50 items per page)
- Index frequently queried columns
- Monitor slow queries

### Frontend Performance
- Minimize bundle size
- Implement virtual scrolling for long lists
- Use memoization for expensive computations
- Optimize animations with GPU acceleration

---

## 10. QUALITY ASSURANCE CHECKLIST

### Before Deployment
- [ ] Code review completed
- [ ] All tests passing
- [ ] TypeScript validation passes
- [ ] ESLint passes
- [ ] Manual testing on all breakpoints
- [ ] Theme switching tested
- [ ] Accessibility audit passed
- [ ] Performance audit passed
- [ ] Security review completed
- [ ] Documentation updated

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Confirm no data loss
- [ ] Monitor user feedback
- [ ] Schedule follow-up review

---

## 11. COMMON PATTERNS & SNIPPETS

### Theme-Aware Component
```tsx
'use client';

import commonStyles from './MyComponentCommon.module.css';
import lightStyles from './MyComponentLight.module.css';
import darkStyles from './MyComponentDark.module.css';
import { useTheme } from '@/context/ThemeContext';

export function MyComponent() {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <div className={`${commonStyles.container} ${themeStyles.container}`}>
      {/* Content */}
    </div>
  );
}
```

### Loading State
```tsx
import { Suspense } from 'react';
import LoadingAnimation from '@/components/LoadingAnimation';

export function PageWithLoading() {
  return (
    <Suspense fallback={<LoadingAnimation size="medium" />}>
      <DataComponent />
    </Suspense>
  );
}
```

### Animated Component
```tsx
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/animations';

export function AnimatedList() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      {items.map((item) => (
        <motion.div key={item.id} variants={fadeInUp}>
          {item.name}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## 12. DO'S AND DON'Ts

### ✅ DO
- Use `@/` path aliases for imports
- Follow three-file CSS module pattern for themes
- Include "use client" on components with hooks
- Export metadata objects from pages
- Use Framer Motion variants from utils
- Implement role-based access control
- Test on multiple breakpoints
- Document complex logic
- Use TypeScript for type safety
- Optimize database queries

### ❌ DON'T
- Hardcode asset/logo paths
- Mix theme styles in single CSS file
- Skip "use client" on hook/context components
- Use mock data in production
- Ignore accessibility requirements
- Deploy without testing
- Leave console errors
- Skip TypeScript validation
- Use inline styles for themed components
- Forget pagination for large lists

---

## 13. RESOURCES & REFERENCES

### Key Files to Reference
- `.github/copilot-instructions.md` - Main technical guide
- `components/` - Example themed components
- `app/internal/` - Example portal pages
- `utils/animations.ts` - Animation variants
- `lib/logo.ts` - Asset management
- `context/ThemeContext.tsx` - Theme implementation

### Documentation
- Next.js 15 App Router: https://nextjs.org/docs
- React 19: https://react.dev
- Framer Motion: https://www.framer.com/motion/
- TypeScript: https://www.typescriptlang.org/docs/
- Drizzle ORM: https://orm.drizzle.team/

---

## 14. CONTACT & SUPPORT

For questions about these guidelines:
- Review the example components in the codebase
- Check existing implementations for patterns
- Refer to the architecture documentation
- Run TypeScript validation to catch issues early

---

**Last Updated**: January 24, 2026
**Version**: 1.0
**Status**: Production Ready

