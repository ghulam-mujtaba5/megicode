# Project: Megicode Technical SEO, GEO & CRO Overhaul

## Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript + CSS Modules / Tailwind.
- **Core Modules**:
  - `lib/metadata.ts`: Centralized canonical URL formatting, OpenGraph metadata, and JSON-LD schema generators (Organization, WebSite, ProfessionalService, Service, FAQPage, BreadcrumbList, Founder Person, AggregateRating, CreativeWork).
  - `app/layout.tsx`: Root layout injecting global JSON-LD graph (`Organization`, `WebSite` with `SearchAction`, `ProfessionalService`, `ItemList`).
  - `app/services/`: 9 Service landing pages (including 3 Core Money Pages) with shared sections in `ServiceDetailSections.tsx`, copy in `servicePageCopy.ts`, and individual server `layout.tsx` / client `page.tsx`.
  - `app/insights/`: 51 Insight articles with dynamic SSG/ISR rendering, TOC, reading progress, FAQ accordion, author card, and `ServiceLinkFunnel.tsx`.
  - `components/StickyCta/`: Universal sticky strategy consultation bar triggering `CalendlyModal`.
  - `app/contact/`: Lead capture form with dynamic URL query parameter binding (`?service=`).
  - `scripts/seo-engine/`: Audit crawler (`audit-crawler.ts`), GSC ingest (`gsc-ingest.ts`), task sprint generator (`task-generator.ts`), Looker exporter (`export-looker.ts`).

---

## Feature Inventory

Every requirement from ORIGINAL_REQUEST.md is inventoried and assigned to a milestone:

| #   | Feature                                       | Description                                                                                                                                                    | Milestone | Source                                |
| --- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------- |
| F1  | Canonical & Redirect Health                   | Normalize all URLs to `https://www.megicode.com` without trailing slash; fix `/results` redirect discrepancy; 0 redirect chains                                | M1        | ORIGINAL_REQUEST §R2                  |
| F2  | Schema Graph Unification                      | Unify `@id` URIs across `Organization`, `WebSite`, `ProfessionalService`, and `ArticleSchema`; add founder `Person` schema to `/about` and root `Organization` | M1        | ORIGINAL_REQUEST §R2                  |
| F3  | Service Schema & FAQPage Consolidation        | Remove duplicate `ServiceSchema` on all 9 service pages; inject validated `faqJsonLd()` in all service layouts; add BreadcrumbList on `/privacy-policy`        | M1        | ORIGINAL_REQUEST §R2                  |
| F4  | Comprehensive SEO Audit Suite                 | Expand `audit-crawler.ts` to audit all public routes and enforce 100% health score in `npm run seo:audit`                                                      | M1        | ORIGINAL_REQUEST §Acceptance Criteria |
| F5  | 40-60 Word Direct Definition Capsules         | Embed high-density entity definition blocks answering exact service scope, target audience, and ROI metrics on all 9 service pages                             | M2        | ORIGINAL_REQUEST §R1                  |
| F6  | Transparent Pricing & Timeline Benchmarks     | Render interactive USD pricing cards ($400 - $12,000+) and turnaround benchmarks (1-2 wks, 4-8 wks, 6-10 wks) on all service landing pages                     | M2        | ORIGINAL_REQUEST §R1                  |
| F7  | Structured Comparison Matrices                | Embed responsive comparison matrices (Megicode vs Agency vs Freelancers vs In-House) across all service landing pages                                          | M2        | ORIGINAL_REQUEST §R1                  |
| F8  | Deterministic 51-Article Reverse-Silo Matrix  | Refactor `ServiceLinkFunnel.tsx` to deterministically channel 100% of 51 insight articles into the 3 core money pages                                          | M3        | ORIGINAL_REQUEST §R3                  |
| F9  | Dynamic Sidebar & Mid-Article Funnel Callouts | Inject category-matched money page recommendation cards in article sidebar and mid-article contextual callout banners                                          | M3        | ORIGINAL_REQUEST §R3                  |
| F10 | Universal High-Ticket Sticky Strategy Bar     | Upgrade `StickyCta` into a universal desktop & mobile strategy consultation bar triggering `CalendlyModal`                                                     | M4        | ORIGINAL_REQUEST §R4                  |
| F11 | Inbound Lead Form Query Parameter Binding     | Add `useSearchParams` hook on `/contact` to automatically pre-select services from inbound funnel links                                                        | M4        | ORIGINAL_REQUEST §R4                  |
| F12 | Full Build & E2E Validation                   | Verify `npm run seo:audit` (100% score), `npm run build` (110 static routes, exit code 0), and 0 broken links/redirects                                        | M5        | ORIGINAL_REQUEST §Acceptance Criteria |

---

## Milestones

| #   | Name                                         | Scope                                                                                                                                                                                                        | Dependencies   | Status  |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ------- |
| M1  | Technical SEO & Schema Graph Infrastructure  | Unify JSON-LD graph, fix duplicate service schemas, inject FAQPage on service pages, add Founder Person schema, fix `/privacy-policy` breadcrumbs, resolve redirect discrepancies, expand `audit-crawler.ts` | none           | PLANNED |
| M2  | GEO & AI Answer Capsules on Service Pages    | Add 40-60 word Answer Capsules, Pricing/Timeline Benchmarks ($400-$12k), and Comparison Matrices in `ServiceDetailSections.tsx` and all 9 service pages                                                      | M1             | PLANNED |
| M3  | Reverse-Silo Link Equity & Article Funneling | Refactor `ServiceLinkFunnel.tsx` with deterministic 51-article mapping to 3 core money pages; dynamic sidebar & mid-article callouts in `app/insights/[id]/page.tsx`                                         | M1             | PLANNED |
| M4  | High-Ticket B2B Conversion Optimization      | Upgrade `StickyCta` to Universal Strategy Bar with Calendly integration across routes; URL param binding on `/contact`                                                                                       | M2, M3         | PLANNED |
| M5  | Final E2E Audit, Build & Hardening           | Run automated SEO audit across all routes, verify 110 static routes build with 0 errors, execute adversarial verification                                                                                    | M1, M2, M3, M4 | PLANNED |

---

## Interface Contracts

### Schema & Metadata Contract (`lib/metadata.ts`)

```ts
export function canonicalUrl(path: string): string;
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): object;
export function founderPersonJsonLd(): object;
export function serviceJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  offers?: Array<{
    name: string;
    price: number | string;
    priceCurrency: string;
    description: string;
    deliveryTime?: string;
  }>;
}): object;
export function faqJsonLd(questions: Array<{ q: string; a: string }>): object;
export function professionalServiceJsonLd(): object;
```

### Reverse-Silo Funnel Contract (`components/Article/ServiceLinkFunnel.tsx`)

```ts
export type CoreMoneyPage =
  | '/services/ai-automation-agents'
  | '/services/ai-saas-mvp-development'
  | '/services/custom-web-development';

export interface ServiceFunnelTarget {
  title: string;
  href: CoreMoneyPage;
  tagline: string;
  description: string;
  cta: string;
  badge: string;
  contactServiceParam: 'ai-automation-agents' | 'lean-ai-saas-mvp' | 'starter-business-platform';
}

export function getServiceForArticle(
  slugOrId: string,
  category: string,
  tags?: string[]
): ServiceFunnelTarget;
```

### GEO Service Sections Contract (`app/services/ServiceDetailSections.tsx`)

```ts
export function ServiceAnswerCapsule(props: {
  slug: string;
  copy: any;
  theme?: string;
}): JSX.Element;
export function ServicePricingBenchmarks(props: {
  slug: string;
  theme?: string;
  onConsultationClick?: () => void;
}): JSX.Element;
export function ServiceComparisonMatrix(props: { slug: string; theme?: string }): JSX.Element;
```

---

## Code Layout

- `lib/metadata.ts` — Metadata and Schema Generators
- `app/layout.tsx` — Global root layout and knowledge graph
- `app/about/layout.tsx` — About page schema (BreadcrumbList + Founder Person)
- `app/privacy-policy/layout.tsx` — Privacy Policy layout with BreadcrumbList
- `app/services/ServiceDetailSections.tsx` — Shared GEO sections (Answer Capsule, Pricing, Matrix)
- `app/services/servicePageCopy.ts` — Copy definitions including 40-60 word definition blocks
- `app/services/[slug]/layout.tsx` — Service server layout with BreadcrumbList, Service, and FAQPage JSON-LD
- `app/services/[slug]/page.tsx` — Service client page rendering hero, GEO sections, process, deliverables, FAQs
- `components/Article/ServiceLinkFunnel.tsx` — Deterministic reverse-silo funnel component
- `app/insights/[id]/page.tsx` — Insight article detail page with sidebar & mid-article callouts
- `components/StickyCta/StickyCta.tsx` & `StickyCta.module.css` — Universal B2B strategy bar
- `app/contact/page.tsx` — Contact form with URL query parameter binding
- `scripts/seo-engine/audit-crawler.ts` — Automated SEO audit crawler
