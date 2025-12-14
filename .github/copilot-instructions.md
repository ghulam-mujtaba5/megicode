# Megicode - Copilot Instructions

## Project Overview
Next.js 15 + React 19 company website with TypeScript. Uses App Router, Framer Motion for animations, and a custom theme system for light/dark modes.

## Architecture

### File Structure
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable UI components organized by feature (e.g., `AboutHero/`, `Services/`)
- `context/` - React context providers (ThemeContext)
- `hooks/` - Custom React hooks (`useIntersectionObserver`, `usePageView`)
- `lib/` - Shared utilities and constants (`logo.ts`, `metadata.ts`)
- `utils/` - Animation variants, helpers (`animations.ts`)
- `styles/` - Global CSS and CSS modules

### Server/Client Component Pattern
- Pages use `"use client"` directive for interactivity
- Layouts remain server components where possible
- Use `dynamic()` imports for code-splitting large components (see [app/services/page.tsx](app/services/page.tsx))

## Critical Theming Pattern (Three-File CSS Module System)
Every themed component follows this structure:
```
ComponentName/
  ComponentName.tsx
  ComponentNameCommon.module.css  # Shared styles (always applied)
  ComponentNameLight.module.css   # Light theme only
  ComponentNameDark.module.css    # Dark theme only
```

**Usage pattern** (from [components/AboutHero/AboutHero.tsx](components/AboutHero/AboutHero.tsx)):
```tsx
import commonStyles from './AboutHeroCommon.module.css';
import lightStyles from './AboutHeroLight.module.css';
import darkStyles from './AboutHeroDark.module.css';
import { useTheme } from '../../context/ThemeContext';

const { theme } = useTheme();
const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

// Apply both: className={`${commonStyles.class} ${themeStyles.class}`}
```

## Animation System
Use shared Framer Motion variants from [utils/animations.ts](utils/animations.ts):
- `fadeInUp`, `fadeInDown` - Basic entrance animations
- `staggerContainer` - For staggered child animations
- `fadeIn(direction, delay)` - Directional fade with delay
- `scaleOnHover` - Hover interactions

## Logo & Asset Management
Import logo paths from [lib/logo.ts](lib/logo.ts) - never hardcode paths:
```tsx
import { LOGO_MAIN_LIGHT, LOGO_MAIN_DARK, LOGO_NAVBAR_LIGHT } from '@/lib/logo';
```

## API Routes
Located in `app/api/`. Contact form uses Zoho SMTP ([app/api/contact/route.ts](app/api/contact/route.ts)).
- Required env vars: `ZOHO_USER`, `ZOHO_PASS`
- All API routes use Next.js Route Handlers pattern

## Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build (auto-generates sitemap via postbuild) |
| `npm run lint` | ESLint check |
| `npm run generate-meta` | Generate meta images (runs from scripts/) |

## Key Conventions
1. **Component imports**: Use `@/` path alias for absolute imports from project root
2. **Page metadata**: Export `metadata` objects from page files for SEO (see [app/layout.tsx](app/layout.tsx))
3. **Loading states**: Use `<LoadingAnimation size="medium" />` for Suspense fallbacks
4. **Accessibility**: Include ARIA labels, semantic HTML, screen-reader-only headings where needed
5. **Navigation**: Desktop (`NavBar_Desktop_Company/`) and Mobile (`NavBar_Mobile/`) navbars are separate components

## Environment Variables
- `NEXT_PUBLIC_SITE_URL` - Base URL for metadata
- `ZOHO_USER`, `ZOHO_PASS` - Email SMTP credentials

## Do NOT
- Hardcode logo/asset paths (use `lib/logo.ts`)
- Mix theme styles in a single CSS file (follow three-file pattern)
- Skip the `"use client"` directive on components using hooks/context
