# Megicode Public Pages — Full Audit Report

> **Generated:** February 20, 2026
> **Scope:** All public-facing pages only (excludes `/internal/*` and `/megicode/*`)
> **Total Issues Found:** 110+
> **Last Updated:** Fixes applied (see below)

## Fixes Applied

The following issues from this audit have been resolved:

| # | Issue | Fix |
|---|-------|-----|
| 1 | SEO: 5 pages with zero metadata | Created `layout.tsx` files in about/, services/, projects/, contact/, reviews/ to re-export metadata |
| 2.1 | No rate limiting on contact API | Added in-memory IP-based rate limiter (5 req/min) |
| 2.2 | Email header injection risk | Added `sanitizeHeaderValue()` to strip newlines |
| 2.3 | Error messages leak env var names | Changed to generic error messages |
| 3 | GA loads without cookie consent (GDPR) | GA now checks `localStorage` consent + listens for consent events |
| 3.1 | Cookie banner privacy link opens in new tab | Removed `target="_blank"` from internal link |
| 4 | ThemeToggleIcon misleading name/behavior | Fixed `aria-label`, replaced `window.location.href` with `router.push()` |
| 5.1 | Hardcoded "Copyright 2025" across all pages | Created `lib/constants.ts` with `getCopyrightText()`, all pages now use shared constants |
| 6.1 | No skip-to-content link | Added skip nav link in root layout + CSS |
| 6.2 | No `id="main-content"` on main elements | Added to all 10 public page `<main>` tags |
| 7.1 | No lazy loading on home page | Below-fold components now use `dynamic()` imports |
| 8.1 | Contact form reads wrong error field | Fixed `result.message` → `result.error` for error responses |
| 8.2 | Missing `"use client"` directives | Added to 5 components using hooks/browser APIs |
| 8.3 | Untyped article state & missing res.ok check | Added `Article` interface, added response status check |
| 9.1 | Inconsistent dark mode colors | Added CSS custom properties, standardized to `--page-bg-dark` |
| 11.1 | `<head>` tag in client component (not-found) | Removed invalid `<head>` tag |
| 12 | No prefers-reduced-motion support | Added `MotionConfig reducedMotion="user"` + `LazyMotion` in ClientLayout |
| 15.1 | Duplicated nav sections, social links, copyright | Created `lib/constants.ts` as single source of truth |
| 15.2 | Empty `RootLayoutClient.tsx` | Deleted |
| 15.3 | Unused imports (useEffect in careers, Image in not-found) | Cleaned up |

---

## Table of Contents

1. [Critical — SEO: 5 Pages With ZERO Metadata](#1-critical--seo-5-pages-with-zero-metadata)
2. [Critical — Security Issues](#2-critical--security-issues)
3. [High — GDPR / Cookie Consent Violation](#3-high--gdpr--cookie-consent-violation)
4. [High — Misleading ThemeToggleIcon](#4-high--misleading-themetoggleicon)
5. [SEO Issues](#5-seo-issues)
6. [Accessibility Issues](#6-accessibility-issues)
7. [Performance Issues](#7-performance-issues)
8. [Code Quality Issues](#8-code-quality-issues)
9. [CSS / Styling Issues](#9-css--styling-issues)
10. [UX / Usability Issues](#10-ux--usability-issues)
11. [TypeScript Issues](#11-typescript-issues)
12. [Animation Issues](#12-animation-issues)
13. [Configuration & Infrastructure Issues](#13-configuration--infrastructure-issues)
14. [Asset / File Issues](#14-asset--file-issues)
15. [Architecture / Structural Issues](#15-architecture--structural-issues)
16. [Component-Specific Issues](#16-component-specific-issues)
17. [Summary Table](#17-summary-table)

---

## 1. CRITICAL — SEO: 5 Pages With ZERO Metadata

These pages use `"use client"` directive which prevents exporting Next.js `metadata`. No corresponding `layout.tsx` files exist to provide SEO metadata. These pages have **no title, description, OG tags, canonical URL, or any SEO metadata at all**.

| # | Page | File |
|---|------|------|
| 1.1 | About | `app/about/page.tsx` |
| 1.2 | Services | `app/services/page.tsx` |
| 1.3 | Projects | `app/projects/page.tsx` |
| 1.4 | Contact | `app/contact/page.tsx` |
| 1.5 | Reviews | `app/reviews/page.tsx` |

**Fix:** Create a `layout.tsx` in each route directory that exports a `metadata` object, or use `generateMetadata()`.

---

## 2. CRITICAL — Security Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 2.1 | **CRITICAL** | **No rate limiting on contact API** — The `/api/contact` endpoint has no IP-based or session-based rate limiting. Can be hammered with unlimited requests, causing email spam and exhausting SMTP quotas. | `app/api/contact/route.ts` |
| 2.2 | **CRITICAL** | **No CSRF protection on contact form** — The form submits to `/api/contact` without any CSRF token. No `Origin` or `Referer` header check. Any external site can auto-submit the form. | `components/Contact/ConatctUs.tsx` → `app/api/contact/route.ts` |
| 2.3 | **HIGH** | **No rate limiting on client** — No throttle/debounce on form submission. Users can spam "SEND" flooding the API. | `components/Contact/ConatctUs.tsx` L63-87 |
| 2.4 | **HIGH** | **No authentication on internal routes** — Middleware only sets `X-Robots-Tag` headers for `/internal/*` and `/megicode/*` but doesn't block unauthenticated access. Anyone can visit these pages directly. | `middleware.ts` L17-20 |
| 2.5 | **MEDIUM** | **Missing Content-Security-Policy header** — No CSP header configured, leaving the site vulnerable to XSS via injected scripts. | `next.config.mjs` L22-60 |
| 2.6 | **MEDIUM** | **X-Powered-By header not disabled** — Default `X-Powered-By: Next.js` header leaks framework information. Add `poweredByHeader: false` to next.config. | `next.config.mjs` |
| 2.7 | **MEDIUM** | **Email header injection potential** — `name` and `subject` fields are concatenated into email subject without newline stripping. If Zod allows newline chars in strings, this could inject email headers. | `app/api/contact/route.ts` L38-39 |
| 2.8 | **MEDIUM** | **API leaks internal config** — 500 error response says `'Missing CONTACT_TO_EMAIL/TO_EMAIL (or ZOHO_USER as fallback).'` revealing environment variable names to clients. | `app/api/contact/route.ts` L44-47 |
| 2.9 | **MEDIUM** | **External image URLs rendered without validation** — Article images from `payloadw.onrender.com` are rendered with raw `<img src>`. If the API is compromised, malicious content could be served. Should use Next.js `<Image>` with `remotePatterns`. | `app/article/[id]/page.tsx` L78 |
| 2.10 | **LOW** | **dangerouslySetInnerHTML for JSON-LD** — While currently using static data (safe), if user input is ever added to these objects, it becomes an XSS vector. Fragile pattern. | `app/layout.tsx` L164-167 |

---

## 3. HIGH — GDPR / Cookie Consent Violation

| # | Issue | Location |
|---|-------|----------|
| 3.1 | **Google Analytics loads regardless of cookie consent** — When user declines cookies, `localStorage.setItem('cookie_consent', 'declined')` is set, but `GoogleAnalytics.tsx` never checks this value. GA scripts and tracking fire unconditionally. **This violates GDPR in the EU.** | `components/CookieConsentBanner/CookieConsentBanner.tsx` ↔ `components/GoogleAnalytics/GoogleAnalytics.tsx` |
| 3.2 | Cookie consent "Privacy Policy" link opens in new tab (`target="_blank"`) for an internal page (`/privacy-policy`). Internal links should not open in new tabs. | `components/CookieConsentBanner/CookieConsentBanner.tsx` L42 |

---

## 4. HIGH — Misleading ThemeToggleIcon

| # | Issue | Location |
|---|-------|----------|
| 4.1 | **Component named "ThemeToggleIcon" does NOT toggle theme** — It only navigates to the home page via `window.location.href = '/'`. The name, `aria-label="Toggle Theme and Navigate to Megicode"`, and wrapper `role="button"` all suggest theme toggling functionality that doesn't exist. | `components/Icon/sbicon.tsx` |
| 4.2 | **Only renders on mobile** — `if (!isMobile) return null;` makes it invisible on desktop, leaving an empty `#theme-toggle` div on many pages. | `components/Icon/sbicon.tsx` L48 |
| 4.3 | **Uses window.location.href instead of Next.js router** — Causes a full page reload on every click. | `components/Icon/sbicon.tsx` L19 |
| 4.4 | **Hydration mismatch** — `window.matchMedia` check in render path differs between server (null) and client (actual), causing layout shift and React hydration warnings. | `components/Icon/sbicon.tsx` L44 |

---

## 5. SEO Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 5.1 | **HIGH** | Copyright year hardcoded as "2025" on ALL pages — current year is 2026. | `HomePageClient.tsx` L28, `about/page.tsx` L64, `services/page.tsx` L28, `projects/page.tsx` L24, `contact/page.tsx` L118, `careers/page.tsx` L82, `not-found.tsx` L60, `article/page.tsx` L180 |
| 5.2 | **MEDIUM** | `<head>` tag used directly in client component — In App Router, this may not work as expected. Should use `metadata` export or layout. | `app/not-found.tsx` L134 |
| 5.3 | **MEDIUM** | Missing OG images on layout-based metadata. | `app/article/layout.tsx`, `app/careers/layout.tsx`, `app/privacy-policy/layout.tsx` |
| 5.4 | **MEDIUM** | Home page metadata minimal — only `title`, `description`, `canonical`. Missing `openGraph`, `twitter`, `keywords`. | `app/page.tsx` L3 |
| 5.5 | **MEDIUM** | `SearchAction` in JSON-LD references `/services?q={search_term_string}` but no search feature exists. Misleading structured data. | `app/layout.tsx` L128-136 |
| 5.6 | **LOW** | No JSON-LD structured data on article listing page. | `app/article/page.tsx` |
| 5.7 | **LOW** | Sitemap `lastmod` always set to current build date for all pages, not actual content change dates. Misleading for search engines. | `next-sitemap.config.js` L64-68 |
| 5.8 | **LOW** | `SERVICES_OG_IMAGE` exported in metadata.ts points to `/meta/services-og.png` which doesn't exist. Will 404. | `lib/metadata.ts` L6 |
| 5.9 | **LOW** | `createPageMetadata()` doesn't set `siteName` in OpenGraph object. | `lib/metadata.ts` L25-47 |

---

## 6. Accessibility Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 6.1 | **HIGH** | **No "Skip to main content" link** — Users navigating via keyboard must tab through the entire navbar on every page. | All pages |
| 6.2 | **HIGH** | **No focus trap on mobile menu** — When mobile nav is open, focus can escape to elements behind it. | `components/NavBar_Mobile/NavBar-mobile.tsx` |
| 6.3 | **MEDIUM** | **Deprecated `onKeyPress`** used in navbars — Should use `onKeyDown`. | `NavBar_Mobile/NavBar-mobile.tsx` L88, `NavBar_Desktop_Company/nav-bar-Company.tsx` L40, 53, 66, 78, 99, 112, 125 |
| 6.4 | **MEDIUM** | **`role="button"` with no `onClick` or `onKeyDown`** — Multiple pages wrap ThemeToggleIcon in `<div role="button" tabIndex={0}>` with no handlers. | `about/page.tsx` L73, `services/page.tsx` L49, `reviews/page.tsx` L38, `not-found.tsx` L144 |
| 6.5 | **MEDIUM** | **Mobile navbar items are `<motion.li>` with `onClick` and `role="menuitem"` but no `<a>` tag inside** — Screen readers won't announce these as links. | `NavBar_Mobile/NavBar-mobile.tsx` L80 |
| 6.6 | **MEDIUM** | **Footer social icons use `<motion.img>` with `onClick`, `role="button"`, `tabIndex={0}`** — `<img>` is not an interactive element. Should be `<button>` elements wrapping images. | `components/Footer/Footer.tsx` L81 |
| 6.7 | **MEDIUM** | **ScreenshotGallery modal** has no keyboard trap, no Escape-to-close handler. | `components/Projects/ProjectDetailContent.tsx` L131-146 |
| 6.8 | **LOW** | `aria-label="Toggle theme"` on wrappers that don't toggle theme — misleading for screen readers. | Multiple pages |
| 6.9 | **LOW** | Missing keyboard handler on multiple interactive elements with `role="button"` and `tabIndex={0}`. | `services/page.tsx` L49, `reviews/page.tsx` L38, `not-found.tsx` L144 |

---

## 7. Performance Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 7.1 | **HIGH** | **Home page loads ALL components statically** — `MegicodeHeroAnimationAdvancedClient`, `ParticleBackgroundClient`, `WelcomeFrame`, `AboutMeSection`, `ServicesFrame`, `ContactSection`, `TechStack`, `Tagline`, `Footer` are all imported without `dynamic()`. Huge initial bundle. | `app/HomePageClient.tsx` |
| 7.2 | **HIGH** | **Four separate Google Fonts `@import` calls** — Each blocks rendering. Should use a single combined URL or `next/font`. | `styles/global.css` L1-4 |
| 7.3 | **MEDIUM** | Projects page — no `dynamic()` imports for heavy components. | `app/projects/page.tsx` |
| 7.4 | **MEDIUM** | Privacy policy page — no dynamic imports. All components statically imported. | `app/privacy-policy/page.tsx` |
| 7.5 | **MEDIUM** | Footer uses `<motion.img>` instead of Next.js `<Image>` or inline SVGs for social icons. No optimization. | `components/Footer/Footer.tsx` |
| 7.6 | **MEDIUM** | Article detail page uses raw `<img>` for cover images. Missing `width/height`, no lazy loading, causes CLS. | `app/article/[id]/page.tsx` L129 |
| 7.7 | **MEDIUM** | Review cards use `<img>` instead of Next.js `<Image>` for reviewer photos. Misses optimization. | `components/Reviews/ReviewCard/ReviewCard.tsx` L55 |
| 7.8 | **LOW** | 404 page generates 24 particles with infinite Framer Motion animations. Excessive CPU usage for an error page. | `app/not-found.tsx` |
| 7.9 | **LOW** | Both Desktop and Mobile navbars always render and execute JS on every page. CSS visibility only hides them visually but doesn't prevent JS execution. | All pages |
| 7.10 | **LOW** | `usePageView.ts` polls up to 10 times at 200ms intervals for `window.gtag`. If GA is blocked by ad blocker, this burns 2 seconds of retries on every navigation. | `hooks/usePageView.ts` L18-37 |
| 7.11 | **LOW** | `useIntersectionObserver` recreates observer on every render if `threshold`/`root` aren't memoized by callers. | `hooks/useIntersectionObserver.ts` L17-36 |

---

## 8. Code Quality Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 8.1 | **MEDIUM** | `fetch("/api/posts")` has no `res.ok` check before `.json()`. If API returns non-200, `.json()` may fail or return unexpected data. | `app/article/page.tsx` L31 |
| 8.2 | **MEDIUM** | Errors silently swallowed — `.catch(() => { setLoading(false); })` with no error state shown to user. | `app/article/page.tsx` L35 |
| 8.3 | **MEDIUM** | `window.innerWidth < 768` in render path — hydration mismatch risk. Server renders `false` (no window), client may render `true`. | `app/article/page.tsx` L46 |
| 8.4 | **MEDIUM** | Empty `useEffect` with `[theme]` dependency — dead code doing nothing. | `app/careers/page.tsx` L65 |
| 8.5 | **MEDIUM** | Error response field mismatch — API returns `error` and `fieldErrors`, but component reads `result.message`. Server validation error messages are never shown. | `components/Contact/ConatctUs.tsx` L79 |
| 8.6 | **MEDIUM** | `window.location.href = '/about'` causes full page reload instead of client-side navigation. | `components/AboutMeCompany/AboutMeSectionLight.tsx` L54 |
| 8.7 | **MEDIUM** | `require('../utils/axe-a11y')` in server component — `typeof window !== 'undefined'` is always false in Node.js. Dead code. | `app/layout.tsx` L8-12 |
| 8.8 | **LOW** | `useEffect` with eslint-disable for exhaustive-deps. | `app/not-found.tsx` L84 |
| 8.9 | **LOW** | Unused variables: `sections` array defined but never used in 5+ pages. | `projects/page.tsx` L37, `about/page.tsx` L50, `services/page.tsx` L37, `reviews/page.tsx` L24, `article/page.tsx` L24 |
| 8.10 | **LOW** | Unused import: `contactEmail` defined but never used. | `projects/page.tsx` L25 |
| 8.11 | **LOW** | Unused import: `Image` from `next/image` imported but never used. | `app/not-found.tsx` L5 |
| 8.12 | **LOW** | Contact form reimplements `IntersectionObserver` instead of using existing `useIntersectionObserver` hook. | `components/Contact/ConatctUs.tsx` L94-108 |
| 8.13 | **LOW** | Unused props in contact form: `showCertificationBadge`, `showAdditionalCertificationBadge` declared but never used. | `components/Contact/ConatctUs.tsx` L17-19 |
| 8.14 | **LOW** | `useScrollAnimation.ts` — `timeoutId` tracking bug: only latest timeout is tracked, previous ones not cleaned up. | `hooks/useScrollAnimation.ts` L30-50 |
| 8.15 | **LOW** | Service card uses `<a>` instead of Next.js `<Link>` — misses client-side routing and prefetching. | `components/Services/Card/ServiceCard.tsx` L65-68 |

---

## 9. CSS / Styling Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 9.1 | **MEDIUM** | **No `box-sizing: border-box` reset** — The universal box-sizing convention is not applied, causing inconsistent sizing. | `styles/global.css` L8-9 |
| 9.2 | **MEDIUM** | **Hardcoded color values** across all pages instead of CSS variables: `#1d2127`, `#ffffff`, `#181c22` (inconsistent dark shade on contact page). | `about/page.tsx` L68, `services/page.tsx` L45, `projects/page.tsx` L38, `reviews/page.tsx` L36, `contact/page.tsx` L210, `not-found.tsx` L129 |
| 9.3 | **MEDIUM** | **Mixed styling approaches** — Some pages use CSS modules, some use inline styles, some use `<style jsx>`, some use Tailwind classes. No consistency. | `services/page.tsx` (JSX), `article/page.tsx` (inline), `projects/page.tsx` (Tailwind), `not-found.tsx` (mixed) |
| 9.4 | **MEDIUM** | **Scroll-driven animations (Chrome-only)** — `animation-timeline: view()` and `animation-timeline: scroll()` not supported in Firefox/Safari. Elements remain `opacity: 0` with no fallback. | `styles/animations.css` L127-132 |
| 9.5 | **LOW** | Duplicate `body` style declarations — properties like `margin: 0` and `line-height` defined twice. | `styles/global.css` L10-16 and L38-46 |
| 9.6 | **LOW** | Empty media query — `@media (min-width: 769px)` block contains only a comment. | `styles/global.css` L48-50 |
| 9.7 | **LOW** | Sub-pixel border: `.page-container` uses `border: 1.5px solid` — renders inconsistently across browsers. | `styles/global.css` L78 |
| 9.8 | **LOW** | `overflow-x: hidden` applied to both `html` and `body` — masks layout bugs instead of fixing them. | `styles/global.css` L15, L105 |
| 9.9 | **LOW** | Privacy policy page has no theme toggle — user cannot switch theme. | `app/privacy-policy/page.tsx` |
| 9.10 | **LOW** | Inconsistent page structure — some pages wrap navbars in `<header>`, most don't. Some use `<nav>` wrappers, some don't. Projects page has navbars inside `<main>`. | Various pages |
| 9.11 | **LOW** | Heavy inline `style={}` usage in Service detail pages — should be CSS modules. | `components/Services/AIMachineLearningService.tsx`, `DataAnalyticsBIService.tsx` |

---

## 10. UX / Usability Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 10.1 | **HIGH** | **"Copyright 2025"** displayed everywhere in 2026. Looks unmaintained. | All pages |
| 10.2 | **HIGH** | **ThemeToggleIcon navigates to home instead of toggling theme** — Extremely confusing. Multiple pages label it "Toggle Theme." | `components/Icon/sbicon.tsx` L19 |
| 10.3 | **MEDIUM** | **Article list — no error state** — On fetch failure, error is silently swallowed. User sees "No articles found" instead of an error message. | `app/article/page.tsx` L35 |
| 10.4 | **MEDIUM** | **Article error page missing `error` and `reset` props** — Next.js convention. No "Try again" button for users. | `app/article/[id]/error.tsx` |
| 10.5 | **MEDIUM** | **ContactInfoCard shows placeholder phone number** `+123 456 7890` — obviously fake. | `components/Contact/ContactInfoCard.tsx` L42 |
| 10.6 | **MEDIUM** | **Inconsistent contact emails** — `info@megicode.com` in ContactInfoCard vs `contact@megicode.com` elsewhere. | `components/Contact/ContactInfoCard.tsx` L39 |
| 10.7 | **LOW** | Footer default Instagram URL points to personal account (`ghulamujtabaofficial`) instead of company (`megicode`). If any page forgets to pass the prop, users get the personal URL. | `components/Footer/Footer.tsx` L13 |
| 10.8 | **LOW** | Only 3 hardcoded reviews, all 5 stars. Looks like obvious placeholder data. | `components/Reviews/ReviewsGrid/ReviewsGrid.tsx` L5-27 |
| 10.9 | **LOW** | Privacy policy "contact form" link goes to `/#contact-section` — the home page contact section may not actually be a form. | `app/privacy-policy/page.tsx` L103 |
| 10.10 | **LOW** | No input length limits on contact form fields client-side. | `components/Contact/ConatctUs.tsx` L112-138 |

---

## 11. TypeScript Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 11.1 | **MEDIUM** | `useState([])` with no type annotation — `articles` is implicitly `never[]`. All `.map()` callbacks use untyped `article` param. | `app/article/page.tsx` L16 |
| 11.2 | **MEDIUM** | `block` and `c` in article content mapping are completely untyped. | `app/article/[id]/page.tsx` L115-118 |
| 11.3 | **LOW** | Footer props defined via default parameter values with no explicit interface. | `components/Footer/Footer.tsx` L11 |
| 11.4 | **LOW** | `React.ReactNode` referenced without explicit `React` type import in providers. | `app/providers.tsx` L4 |

---

## 12. Animation Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 12.1 | **HIGH** | **No `prefers-reduced-motion` support on most Framer Motion animations.** Only `contact.module.css` and `animations.css` have reduced-motion media queries. All Framer Motion animations across the site ignore this preference. | All pages with Framer Motion |
| 12.2 | **MEDIUM** | **Infinite animations on 404 page** — `floatingVariants` + `glitchVariants` + 24 particles all with `repeat: Infinity`. CPU-intensive on low-end devices. | `app/not-found.tsx` L30-55 |
| 12.3 | **MEDIUM** | **Layout shift from conditional rendering** — `ThemeToggleIcon` returns `null` on desktop after mount check (space allocated during SSR, removed on client). | `components/Icon/sbicon.tsx` L48 |
| 12.4 | **MEDIUM** | **Layout shift from particles** — 404 page particles generated in `useEffect` — container empty on first render, fills with 24 particles causing visual jump. | `app/not-found.tsx` L84 |
| 12.5 | **LOW** | PageTransition component has no reduced-motion fallback. | `components/PageTransition/PageTransition.tsx` |
| 12.6 | **LOW** | ScrollProgressBar spring animation has no reduced-motion fallback. | `components/ScrollProgressBar/ScrollProgressBar.tsx` |
| 12.7 | **LOW** | Mobile navbar menu item entrance animations have no reduced-motion fallback. | `components/NavBar_Mobile/NavBar-mobile.tsx` |

---

## 13. Configuration & Infrastructure Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 13.1 | **MEDIUM** | `eslint: { ignoreDuringBuilds: true }` — ESLint errors silently skipped in production builds. Broken code can ship. Also `build` script uses `--no-lint`. | `next.config.mjs` L3-5, `package.json` |
| 13.2 | **MEDIUM** | Duplicate `X-Robots-Tag` logic — same `noindex, nofollow` set in both middleware and `next.config.mjs` headers. Redundant. | `middleware.ts` L17-20, `next.config.mjs` L56-75 |
| 13.3 | **MEDIUM** | Sitemap exclude / transform inconsistency — `exclude` uses globs (`/internal/*`) but `transform` uses `startsWith('/internal')`. Edge cases may slip through. | `next-sitemap.config.js` L8-18 vs L26-37 |
| 13.4 | **LOW** | `CANONICAL_HOST` in middleware hardcoded but never used for www→non-www redirect. | `middleware.ts` L4-5 |
| 13.5 | **LOW** | Only `images.unsplash.com` and `images.pexels.com` whitelisted for remote images. Any future CDN domain will 404. | `next.config.mjs` L6-19 |
| 13.6 | **LOW** | Duplicate favicon declarations — both `metadata.icons` in layout.tsx AND manual `<link>` elements in `<head>`. The manual `<link>` tags override Next.js favicon handling. | `app/layout.tsx` L43-48, L153-163 |
| 13.7 | **LOW** | Missing `theme-color` meta tag for mobile browser chrome. | `app/layout.tsx` |
| 13.8 | **LOW** | Missing `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` headers. | `next.config.mjs` |

---

## 14. Asset / File Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 14.1 | **MEDIUM** | **Spaces in public filenames** — `Ai icon.svg`, `data scrapping icon.svg`, `data visualization icon.svg`, `Big Data Analytics.svg`, `Desktop App Dark.svg`, `Mobile App Dark.svg`, `email icon.svg`. URL encoding issues. | `public/` directory |
| 14.2 | **MEDIUM** | **Missing PNG image assets** — `AIMachineLearningService.tsx` references `/meta/ai-case-study.png`, `/meta/TensorFlow.png`, `/meta/PyTorch.png`, `/meta/OpenAI.png`. Only SVG versions exist. Will cause 404s. | `components/Services/AIMachineLearningService.tsx` L85, L118-122 |
| 14.3 | **MEDIUM** | Same for `DataAnalyticsBIService.tsx` — references `/meta/PowerBI.png`, `/meta/Tableau.png`, `/meta/SQL.png`. Don't exist. | `components/Services/DataAnalyticsBIService.tsx` L103-108 |
| 14.4 | **MEDIUM** | **Build artifacts committed to git** — `sitemap.xml`, `sitemap-0.xml`, `robots.txt` in `public/` are generated by `next-sitemap` at build time. Should be in `.gitignore`. | `public/sitemap.xml`, `public/sitemap-0.xml`, `public/robots.txt` |
| 14.5 | **LOW** | Duplicate favicon — `favicon.ico` exists at both `public/favicon.ico` and `public/meta/favicon.ico`. | `public/` |
| 14.6 | **LOW** | File named `ux-certificate delte.png` — typo suggests it should have been deleted. | `public/ux-certificate delte.png` |
| 14.7 | **LOW** | Unused `service-worker.js` in public — unclear if actively used or leftover. | `public/service-worker.js` |
| 14.8 | **LOW** | Overlapping icon directories — `public/icons/` and `public/IconSystem/` may have duplicate content. | `public/icons/`, `public/IconSystem/` |
| 14.9 | **LOW** | `components/Services/ServicesHero.tsx` and `ServiceCard.tsx` (root level) are completely empty. Actual implementations are in `Hero/` and `Card/` subdirs. Confusing. | `components/Services/ServicesHero.tsx`, `components/Services/ServiceCard.tsx` |
| 14.10 | **LOW** | Orphaned CSS module files — `ReviewCard.module.css`, `ReviewsGrid.module.css`, `ReviewsHero.module.css`, `ServicesHero.module.css`, `ServiceCard.module.css` exist alongside the three-file-pattern versions and are unused. | `components/Reviews/`, `components/Services/` |
| 14.11 | **LOW** | Empty file: `app/RootLayoutClient.tsx` — should be deleted. | `app/RootLayoutClient.tsx` |
| 14.12 | **LOW** | Contact component filename typo: `ConatctUs.tsx` → should be `ContactUs.tsx`. | `components/Contact/ConatctUs.tsx` |

---

## 15. Architecture / Structural Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 15.1 | **MEDIUM** | **Duplicated navigation config** — The `sections` array (`[{ id: 'home', label: 'Home', href: '/' }, ...]`) is copy-pasted in every single page file AND the mobile navbar. Should be a shared constant. | All pages |
| 15.2 | **MEDIUM** | **Duplicated social links / Footer props** — `linkedinUrl`, `instagramUrl`, `githubUrl`, `copyrightText` are hardcoded in every page. Should be a shared constant. | All pages |
| 15.3 | **MEDIUM** | **Missing `"use client"` directives** on components that use hooks: | |
| | | → `components/Services/AIMachineLearningService.tsx` | Uses `useCalendlyModal()` |
| | | → `components/Services/DataAnalyticsBIService.tsx` | Uses `useCalendlyModal()` |
| | | → `components/Projects/ProjectsShowcase.tsx` | Uses `useTheme()`, `useState()` |
| | | → `components/Projects/ProjectHero.tsx` | Uses `useTheme()` |
| | | → `components/Reviews/ReviewsGrid/ReviewsGrid.tsx` | Uses components with `useTheme()` |
| | | → `hooks/useInViewAnimation.ts` | Uses `useEffect`, `document` |
| 15.4 | **LOW** | Both Desktop and Mobile navbars always mount and execute JS. Only hidden via CSS. Doubles navbar cost. | All pages |
| 15.5 | **LOW** | `ProjectDetailContent.tsx` — `useState` imported on line 46 instead of at top of file with other imports. | `components/Projects/ProjectDetailContent.tsx` L46 |
| 15.6 | **LOW** | `ProjectsShowcase` uses `key={index}` for tech tags — should use tech name as key since it's unique. | `components/Projects/ProjectsShowcase.tsx` L77 |

---

## 16. Component-Specific Issues

### Contact Form (`components/Contact/`)
| # | Issue | File |
|---|-------|------|
| 16.1 | Image paths use bare filenames without leading `/` — `"email icon.svg"` relies on relative resolution. | `ConatctUs.tsx` L141 |
| 16.2 | Spaces in image filename: `"email icon.svg"` — problematic for URL resolution. | `ConatctUs.tsx` L141 |

### Services Components (`components/Services/`)
| # | Issue | File |
|---|-------|------|
| 16.3 | References to non-existent icon paths: `/IconSystem/chatbot.svg`, `/IconSystem/risk.svg`, etc. Need verification. | `AIMachineLearningService.tsx` L68-83 |

### Hooks (`hooks/`)
| # | Issue | File |
|---|-------|------|
| 16.4 | `useParallaxScroll` and `useElementScrollProgress` fire on every scroll event — no throttling via `useDebounce`. | `hooks/useScrollAnimation.ts` L65-76 |

---

## 17. Summary Table

| Category | Critical | High | Medium | Low | Info |
|----------|----------|------|--------|-----|------|
| SEO | 5 | 1 | 4 | 4 | — |
| Security | 2 | 2 | 5 | 1 | — |
| GDPR | — | 1 | — | 1 | — |
| Accessibility | — | 2 | 5 | 2 | — |
| Performance | — | 2 | 5 | 4 | — |
| Code Quality | — | — | 7 | 8 | — |
| CSS / Styling | — | — | 4 | 7 | — |
| UX / Usability | — | 2 | 4 | 4 | — |
| TypeScript | — | — | 2 | 2 | — |
| Animations | — | 1 | 3 | 3 | — |
| Config / Infra | — | — | 3 | 5 | — |
| Assets / Files | — | — | 4 | 8 | — |
| Architecture | — | — | 3 | 3 | — |
| Component-Specific | — | — | — | 2 | 2 |
| **TOTALS** | **7** | **11** | **49** | **53** | **2** |

**Grand Total: 122 issues found**

---

## Recommended Priority Order

### Phase 1 — Critical Fixes (Ship-blocking)
1. Add SEO metadata to 5 public pages (About, Services, Projects, Contact, Reviews)
2. Add rate limiting to `/api/contact`
3. Add CSRF protection to contact form
4. Fix GA to respect cookie consent (GDPR)
5. Fix copyright year to be dynamic

### Phase 2 — High Priority
6. Fix ThemeToggleIcon (rename, fix behavior, or remove)
7. Add `prefers-reduced-motion` support to Framer Motion animations
8. Add `Content-Security-Policy` header
9. Add authentication to internal routes
10. Add skip navigation link
11. Add focus trap to mobile menu
12. Code-split home page with `dynamic()` imports
13. Consolidate Google Fonts into single import or use `next/font`

### Phase 3 — Medium Priority
14. Fix missing `"use client"` directives on 6 components
15. Fix missing image assets (PNG references for SVG files)
16. Fix contact form error display (field mismatch)
17. Add `box-sizing: border-box` reset
18. Extract shared constants (nav config, social links, footer props)
19. Fix hardcoded colors → CSS custom properties
20. Add error states to article page

### Phase 4 — Low Priority / Cleanup
21. Delete empty files (`RootLayoutClient.tsx`, empty service components)
22. Remove unused variables and imports
23. Fix filename typo (`ConatctUs.tsx` → `ContactUs.tsx`)
24. Remove build artifacts from git
25. Fix spaces in public filenames
26. Remove orphaned CSS module files
27. Fix all remaining low-severity items
