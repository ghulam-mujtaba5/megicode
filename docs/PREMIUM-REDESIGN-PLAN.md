# Megicode.com — Premium Redesign & Upgrade Plan

**Scope:** Public marketing site only (`app/` excluding `app/internal/`).
**Rule:** Preserve the business structure — offers, pricing logic, proof, lead-gen flow. Upgrade the visual system, motion, and conversion polish.
**Actual stack:** Next.js 16 (App Router) · React 19 · CSS Modules + design tokens · framer-motion 12. **No Tailwind** — and none should be added; retrofitting it across ~90 component folders would be the "redesign from zero" this plan forbids.

---

## 0. Audit Summary — what's holding the site back today

The strategy (buyer-situation cards, transparent pricing, GA-screenshot proof, fit-review form) is already better than most agency sites. The gap is **execution consistency**:

| #   | Finding                                                                                                                         | Where                                                | Why it hurts                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Body font is **Open Sans**, loaded via 4 render-blocking `@import`s; Poppins/Manrope/Inter are partially loaded but barely used | `styles/global.css:1-4`                              | Reads "2018 template," slows FCP, causes FOUT                                                   |
| 2   | `font-weight: 900` used widely but Open Sans is only loaded at 400/600/700                                                      | e.g. `HomePricingPreview.tsx` styled-jsx             | Browser synthesizes fake-bold → smudged, cheap-looking headings                                 |
| 3   | Every component ships **3 CSS files** (Common/Light/Dark) + runtime theme-class switching                                       | all `components/*`                                   | 3× maintenance, drift between modes, inconsistent dark polish                                   |
| 4   | **Orange on every hover** (pricing buttons, section buttons all flip to #FF9800)                                                | `HomePricingPreview.tsx`                             | Violates "don't overuse orange"; orange stops meaning "primary action"                          |
| 5   | Off-palette **teal #0f9f8c** accent on the 4th buyer-situation card                                                             | `ServicesFrame.tsx:257`                              | Dilutes brand; brief says 3 core services must dominate                                         |
| 6   | Hero primary CTA animates in at **2.0s delay**                                                                                  | `welcomeCompany/welcome.tsx:101`                     | The conversion element is invisible for 2 seconds                                               |
| 7   | Hero is **brand-name-centric** ("Megi/code" + shimmer) rather than buyer-outcome-centric                                        | `welcome.tsx`                                        | First screen sells the logo, not the outcome                                                    |
| 8   | Proof stats use raster **PNG icons** (72px)                                                                                     | `HomeProof.tsx:15-31`                                | Clashes with the inline-SVG icon system that already exists (`IconSystem/ServiceIllustrations`) |
| 9   | CampusAxis proof image is `/Screenshot (1527).png` (space in URL, unoptimized)                                                  | `HomeShippedPlatforms.tsx:38`                        | Slow, fragile URL, looks accidental in devtools/SEO audits                                      |
| 10  | Decorative background zoo: PlexusCanvas, ParticleBackground, NeuralNetBackground, ThreeBackground                               | `components/Backgrounds`, `Contact/ContactUs.tsx:20` | Exactly the "cluttered animated backgrounds / random AI visuals" the brand should avoid         |
| 11  | `HomePricingPreview` duplicates ~250 lines of CSS in `<style jsx>` **and** `<style jsx global>`                                 | `HomePricingPreview.tsx:72-478`                      | Bundle bloat, two sources of truth                                                              |
| 12  | Theme toggle is a `div role="button"` floating over content                                                                     | `HomePageClient.tsx:58-72`                           | Should be a real `<button>`; also collides with content on small screens                        |
| 13  | Homepage flow: Hero → Proof → **About → Tagline** → Services → Pricing → Case studies → Testimonials → Contact                  | `HomePageClient.tsx`                                 | About + Tagline interrupt the buyer journey before service selection                            |
| 14  | Repo hygiene: `New folder (5)/`, `temp_coverage/`, `temp_performance/` at root                                                  | repo root                                            | Signals rush; also ships risk of accidental imports                                             |

Everything below is designed to fix these without touching the business model.

---

## 1. Design North Star & Signature Element

**Thesis:** Megicode's proof _is_ the product UI it ships. So the site's visual language is **"the system, running"** — real product surfaces (booking card, agent handoff, analytics panel) connected by a schematic pipeline, not abstract AI decoration.

**Signature element — the Pipeline:**
One continuous visual motif: a thin 1.5px blueprint-blue line with a slow traveling pulse (a 6px dot of #4573DF) that:

- animates through the hero's product-card cluster (lead → AI agent → booking → dashboard),
- reappears as the **section divider** between homepage sections (replacing the current ad-hoc `connector-dot` / `divider-node` inline styles in `ServicesFrame.tsx:341-356` — formalize those into one `<PipelineDivider />` component),
- terminates at the contact section, where the pulse "arrives" at the form.

This encodes the actual promise — _we connect your operations end to end_ — and it is the **one** place the site spends its boldness. Everything else stays quiet: white cards, generous space, disciplined type. All other animated backgrounds (Plexus, Particles, NeuralNet, Three) are removed from the public site.

**Feel targets:** Linear's restraint + Stripe's diagram clarity, with Megicode blue instead of their palettes. Never: robots, brains, floating icon confetti, heavy gradients.

---

## 2. Design System Upgrades (do this first — everything else consumes it)

### 2.1 Color tokens (extend `styles/global.css` `:root`)

```css
:root {
  /* Brand (unchanged) */
  --brand-blue: #4573df;

  --brand-orange: #ff9800;

  /* Surfaces */
  --surface-page: #f5f7fa;
  --surface-card: #ffffff;
  --surface-raised: #fbfcfe;
  --ink: #23272f;
  --ink-soft: #526070;

  /* NEW: schematic/blueprint tint — for pipeline lines, card borders, dividers */
  --line-blueprint: #dce5f6;
  --line-blueprint-strong: #b8c9ee;

  /* Semantic */
  --cta-bg: var(--brand-orange); /* orange = conversion CTA ONLY */
  --action: var(--brand-blue); /* blue = links, hovers, focus, pulse */
  --shadow-card: 0 1px 2px rgba(35, 39, 47, 0.05), 0 12px 32px rgba(45, 79, 162, 0.08);
  --shadow-card-hover: 0 2px 4px rgba(35, 39, 47, 0.06), 0 20px 48px rgba(45, 79, 162, 0.14);
}
[data-theme='dark'] {
  --surface-page: #15181e;
  --surface-card: #1d222b;
  --surface-raised: #232936;
  --ink: #f2f5fa;
  --ink-soft: #a7b4c6;
  --line-blueprint: #2c3648;
  --line-blueprint-strong: #3a4763;
  /* orange & blue stay identical — brand does not change per theme */
}
```

**Orange discipline rule (enforce in review):** #FF9800 appears at most **twice per viewport** — the primary CTA and one highlight (e.g. "Most booked" pricing badge). All hover states move to blue/navy. Remove teal `#0f9f8c` from `ServicesFrame.tsx` — the consulting card uses navy.

### 2.2 Theming: kill the triple-CSS-file pattern (progressively)

Replace `Common/Light/Dark.module.css` triples with **one module per component consuming the tokens above**, themed by `[data-theme]` on `<html>` (set in `ThemeContext`). Migration order: every component this plan touches gets migrated as it's touched; don't do a big-bang rewrite. End state: `useTheme()` is only needed for the toggle itself, not for style selection — which also removes the theme-flash risk and halves CSS shipped.

### 2.3 Typography (via `next/font/google` — delete all four `@import`s in `global.css:1-4`)

| Role    | Face               | Weights       | Usage                                                                             |
| ------- | ------------------ | ------------- | --------------------------------------------------------------------------------- |
| Display | **Manrope**        | 600, 700, 800 | h1–h3, section titles, prices. 800 for h1/h2 only. Tracking −0.02em ≥32px         |
| Body    | **Inter**          | 400, 500, 600 | paragraphs, UI, forms. 1.65 line-height, max 62ch                                 |
| Data    | **JetBrains Mono** | 500           | metrics ("15+", "13K"), prices ("from $4,500"), stack chips, form microcopy chips |

The mono-for-data role is the characterful move: it says "engineering partner" through typesetting instead of robot clip-art, and it makes every number on the site (proof stats, prices, GA figures) read as _measured_, not marketed.

Type scale (clamp-based): h1 `clamp(2.4rem, 5vw, 3.6rem)`, h2 `clamp(1.9rem, 3.2vw, 2.6rem)`, h3 `1.25rem`, body `1.0625rem`, caption `0.8125rem`. **Delete every `font-weight: 900`** (grep: `font-weight: 900` → replace with 700/800 in the loaded faces).

### 2.4 Spacing & radius rhythm

Section padding token `--section-y: clamp(4.5rem, 9vw, 7.5rem)` applied to every homepage section (they currently each pick their own). Radii: cards 20px, inner cards 14px, buttons 12px (**retire the 999px pill for primary CTAs** — pills read "template"; keep pills only for chips/badges). One card style everywhere: `--surface-card` + 1px `--line-blueprint` border + `--shadow-card`.

### 2.5 Icon & illustration system

- One source: the existing inline SVG `IconSystem/ServiceIllustrations` + `react-icons` (Hi2 for UI, Si for tech brands).
- Delete PNG usage: `HomeProof` stat icons (§4), `ServicesFrame` situation icons (`/service-icons/*.png` → line-style SVG glyphs, 1.5px stroke, `--brand-blue` on `--line-blueprint` tile).
- Every decorative SVG: `aria-hidden="true"`, no alt text.

---

## 3. Homepage — Section-by-Section

New order (edit `app/HomePageClient.tsx`):

```
Hero (rebuilt) → Proof strip → Service paths (3 dominant + secondary row)
→ Case studies → Pricing preview → Reviews → Founder/About (condensed, merged with Tagline)
→ Contact → Footer
```

About moves **below** proof-heavy sections: buyers self-select first, then meet the team. `Tagline` merges into the About block ("If you can imagine it, we can build it" becomes its closing line) — one section instead of two.

### 3.1 Hero (`components/welcomeCompany/welcome.tsx` + `MegicodeHeroAnimationAdvanced`)

**Layout:** two-column ≥1024px (58/42), stacked on mobile (copy first).

Left column:

1. Eyebrow chip (mono, `--line-blueprint` bg): `AI PRODUCT STUDIO — LAHORE → GLOBAL`
2. **H1 (the outcome, not the brand name):** `AI software, automation & SaaS MVPs built for real business growth` — the "Megi/code" brand-line treatment with shimmer moves out of the h1 (the navbar logo already establishes the brand). SEO h1 = the value proposition.
3. Sub: `Megicode helps founders, clinics, agencies, and growing businesses turn ideas, workflows, and operations into launch-ready AI products, automation systems, and custom platforms.`
4. CTAs: primary **Book a Free Fit Call** (orange, 12px radius, subtle glow on hover only), secondary **View Case Studies** (ghost, blue border).
5. Beneath CTAs, a mono micro-proof line: `15+ products shipped · 5+ countries · replies within 24h`

Right column — **the Pipeline diagram** (rebuild of `MegicodeHeroAnimationAdvanced`, currently 31KB):
Four small product cards connected by the signature line: **Lead card** (name + WhatsApp icon) → **AI Agent node** (routes it) → **Booking card** (calendar slot fills) → **Analytics card** (bar ticks up). The pulse travels the path on a 6s loop. Cards float ±4px on offset sine loops. Built as one SVG + 4 absolutely-positioned card divs animated with framer-motion — no canvas, no particles. Under `prefers-reduced-motion`: static diagram, pulse hidden.

**Timing fix:** compress the entrance so the primary CTA is interactive by **≤1.0s** (currently 2.0s). Sequence: eyebrow 0.05s → h1 0.15s → sub 0.3s → CTAs 0.45s → diagram cards stagger 0.5–0.9s.

### 3.2 Proof strip (`components/HomeProof/HomeProof.tsx`)

Keep the 3 metrics + notes (good copy). Redesign as a single **horizontal rail** sitting on the pipeline line — one bordered strip, metrics separated by vertical `--line-blueprint` rules, not three floating cards.

- Numbers in JetBrains Mono, `--brand-navy`, count-up once on first view (400ms, framer-motion `useInView` + `animate`; skip under reduced motion).
- Replace PNG icons with 20px line-SVG glyphs — or drop icons entirely; the mono numbers carry it.
- Keep the "See the work behind these numbers →" evidence link (it's good).
- Optionally add 4th metric `15K+ active users across platforms` (mono, with note "tracked via Google Analytics").

### 3.3 Service paths (`components/About-page-Services/ServicesFrame.tsx`)

Currently: 4 buyer-situation cards + an 8-card bento where everything competes. Restructure to enforce the 3-core hierarchy:

**Tier 1 — three dominant path cards** (full-width row, equal, large):

1. **Automate My Workflow** — pain: "Leads slip and hours vanish into manual follow-up." Outcome: "AI agents handle capture, replies, bookings, reminders." Mini-visual: 3-node workflow snippet (WhatsApp → agent → CRM). Bullets ×3. CTA `See automation packages →`. Stack chips: OpenAI · Python · Zapier · Node.
2. **Plan My AI MVP** — pain: "You have the AI product idea, not the build path." Outcome: "Roadmap, architecture, LLM features, launch-ready MVP." Mini-visual: mini dashboard + roadmap ticks. CTA `Plan my MVP →`. Chips: Next.js · OpenAI · TypeScript.
3. **Build My Platform** — pain: "Your operations live in spreadsheets and WhatsApp threads." Outcome: "Dashboards, portals, CRMs, booking systems that fit how you work." Mini-visual: admin table + role badge. CTA `Scope my platform →`. Chips: Next.js · React · TypeScript.

Card anatomy: white card, blueprint border, pain line (ink-soft, italic-free), outcome (h3, Manrope 700), 3 bullets with blue check glyphs, mini-visual top-right (inline SVG, reveals fully on hover — keep the existing `cardIllus` hover pattern, it's good), CTA row pinned bottom. Hover: −4px lift + `--shadow-card-hover` + border → `--line-blueprint-strong`. **No orange anywhere in these cards.**

**Tier 2 — secondary capabilities** as one compact row of 6 text-first chips/mini-cards (UI/UX, Mobile, Cloud & DevOps, Data & BI, Consulting, SEO/Growth): icon + name + one line + arrow. Half the height of Tier 1, no illustrations, no tech chips. Label the row: `Supporting capabilities — usually part of a bigger build`.

The 4 buyer-situation cards and the bento **merge** into this two-tier structure (the situation copy becomes the pain lines of Tier 1 + consulting moves to Tier 2). One section, one job. Keep the "What do you need help with? Choose by business outcome." heading — it's the right frame.

### 3.4 Case studies (`components/HomeShippedPlatforms/HomeShippedPlatforms.tsx`)

Keep the three cases and the zoomable GA proof (genuinely differentiating). Upgrade card anatomy to a **Problem → Solution → Outcome** ledger:

- Header row: client name (Manrope 700) + type badge + index in mono.
- Three labeled micro-rows, labels in mono caps 11px `--ink-soft`: `PROBLEM` / `BUILT` / `OUTCOME`, each one sentence.
- Stats row: existing chips but mono type on blueprint-tint pills.
- CampusAxis card keeps the analytics screenshot with the zoom modal — but **rename the asset** to `/projects/campusaxis-analytics-proof.webp` (convert, ~80% quality) and update the reference. Add a mono caption under it: `Source: Google Analytics — 90-day view`.
- The Aesthetics Place + Wajdan cards get product-frame images too (browser-chrome mockup around a real screenshot) so all three show evidence, not just claims.
- Footer CTA per card: `Read the full case →` to the existing `/projects/[slug]` pages.
- Reveal: stagger-in (existing pattern is fine), hover lift −6px (already there).

Section heading stays outcome-framed; keep "Real platforms shipped" eyebrow.

### 3.5 Pricing preview (`components/Pricing/HomePricingPreview.tsx`)

Content (5 entry points, `data/pricing.ts`) is right. Fix presentation:

- **Rewrite as a CSS module consuming tokens** — delete the ~500 lines of duplicated styled-jsx.
- Layout: 5 cards in a horizontally-scrollable rail on mobile (scroll-snap), 5-up ≥1200px, 3+2 in between.
- Card: package name (Manrope 600) → price in **JetBrains Mono, `--brand-navy`** (`from $4,500`) → best-for line → CTA.
- One card gets the single orange accent of the section: a `Most booked` badge (pick from real data; default: AI Automation).
- Under the grid, a reassurance line of 4 mono chips: `Start small when scope is unclear` · `Fixed-scope entry packages` · `Milestone-based larger builds` · `Third-party tools billed separately`.
- Buttons: primary `Compare packages` (blue solid), secondary `Book a fit call` (ghost). **Hovers go navy, not orange.**

### 3.6 Reviews (`components/HomeTestimonials/`)

Upgrade to credibility cards: quote (Inter 400, 1.05rem) → attribution row (name, **client type**: "Clinic owner", "SaaS founder", "Agency director") → **outcome label** as mono chip (`BOOKING AUTOMATION`, `MVP LAUNCH`, `PLATFORM BUILD`) linking the review to a service path. Stars stay but small (14px, navy — not gold, avoids the cheap-testimonial look). 3-up desktop / swipe rail mobile. No avatars unless real photos exist — initials tile on blueprint tint.

### 3.7 Contact (`components/Contact/ContactUs.tsx` + `app/contact/page.tsx`)

Two surfaces, two jobs:

- **Homepage section** = low-friction handoff, not the full form. Keep name/email/message but reframe: left column headline `Tell us what you're trying to build` + trust chips (mono pills): `24h response` · `Free intro call` · `NDA available` · `Remote-first` · `Lahore-based, global clients`, plus a link `Prefer the full project brief? Use the fit-review form →` to `/contact`. **Remove the PlexusCanvas background** — the pipeline pulse terminating at the form is the only motion here.
- **/contact fit-review form** (already strong: budget/timeline/stage/NDA): group into 3 labeled clusters — `About you` (name, email, company) / `About the project` (service, budget, timeline, stage) / `Details` (message, NDA) — with mono group labels and 8px more inter-group spacing. Two-column desktop: form left, right rail with microcopy ("What happens after you send this" — 3 numbered steps: reply in 24h → 30-min fit call → fixed-scope proposal) + the trust chips. Field focus: 2px blue ring + label color shift (150ms). Submit: **Send project details** (orange — this is a conversion CTA). Keep floating labels; keep validation copy tone direct ("Please select a budget range" is good).

### 3.8 Navbar & Footer

- **Navbar** (`NavBar_Desktop_Company/NewNavBar`): height 64px, blur backdrop after 24px scroll (`background: color-mix(in srgb, var(--surface-page) 85%, transparent)`), active-link underline in blue. Right side: theme toggle (moved here as a real `<button>` — delete the floating div in `HomePageClient.tsx:58-72`) + one orange **Book Fit Call** button. Services dropdown: 3 core paths large at top, 6 supporting small below — same hierarchy as the homepage.
- **Footer** (recently rebuilt — keep it): verify it consumes the new tokens, columns: Services (3 core first) / Company / Proof (case links) / Contact + trust chips. Mono for the legal line.
- **Mobile menu**: full-height sheet, 3 core paths as cards at top, links below, Book Fit Call pinned at bottom.

---

## 4. Motion System (framer-motion, tokenized)

Create `lib/motion.ts` — single source for all variants (ServicesFrame's `EASE_OUT [0.22,1,0.36,1]` is the right curve; make it the site-wide standard):

```ts
export const EASE = [0.22, 1, 0.36, 1] as const;
export const DUR = { fast: 0.25, base: 0.5, slow: 0.7 };
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};
export const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});
export const cardHover = { y: -4, transition: { duration: DUR.fast, ease: EASE } };
```

**Motion budget per section — one entrance + one hover + (optionally) one ambient:**

| Section      | Entrance                  | Ambient                                  | Interaction                    |
| ------------ | ------------------------- | ---------------------------------------- | ------------------------------ |
| Hero         | Orchestrated ≤1.0s to CTA | Pipeline pulse 6s loop, cards ±4px float | CTA hover: lift + glow         |
| Proof        | fadeUp + count-up once    | —                                        | —                              |
| Services     | stagger(0.08) cards       | —                                        | lift −4px, illustration reveal |
| Case studies | stagger reveal            | —                                        | lift −6px, image zoom cursor   |
| Pricing      | fadeUp row                | —                                        | lift, border-color shift       |
| Reviews      | stagger                   | —                                        | subtle lift                    |
| Contact      | fadeUp                    | pulse "arrives" once                     | field focus ring 150ms         |

**Hard rules:** all scroll reveals `viewport={{ once: true }}`; nothing animates `width/height/top/left` (transform/opacity only); no parallax on mobile; global reduced-motion guard in `global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

…plus `useReducedMotion()` from framer-motion in the hero to swap to static variants. Delete: shimmer sweep on brand name, PlexusCanvas, ParticleBackground, NeuralNetBackground, ThreeBackground from all public pages (keep files only if `app/internal` uses them).

---

## 5. Service Page Upgrades (`app/services/*`)

Shared template fixes for all three core pages (each `page.tsx` is ~22KB with a 48KB common CSS module — expect duplicated section labels; dedupe while migrating to tokens):

1. **Hero:** same two-column pattern as homepage but with the service-specific diagram; eyebrow = service category; h1 = outcome; sub = who it's for; primary CTA Book Fit Call, secondary `See pricing` (anchor to the page's pricing entry section).
2. **Process section:** convert step lists into a **pipeline-styled vertical timeline** (the signature line with numbered nodes — here numbering is honest: it's a real sequence).
3. **Good fit / Not a fit:** two-column card pair — blue-check column vs. neutral-x column (never red; "not a fit" is a qualification tool, not a warning).
4. **Proof:** embed the one matching case-study card (Aesthetics → automation & platform pages; CampusAxis → SaaS/MVP page; Wajdan → platform/web page).
5. **Pricing entry point:** the matching package card from `data/pricing.ts` inline + `Compare all packages →`.
6. **Final CTA band:** navy surface, white Manrope headline, orange CTA — the one dark band per page.

Page-specific hero diagrams (all inline SVG + motion, same visual grammar as homepage hero):

- **AI Automation & Agents** (`ai-automation-agents`): workflow map — form/WhatsApp/email intake nodes → AI agent (with a visible **human-review node**) → CRM/booking/reminder outputs; a small `LOG` ticker card underneath. Copy emphasizes: workflow mapping first, human checkpoints, logs & fallbacks — reliability over bot hype.
- **AI SaaS & MVP** (`ai-saas-mvp-development`): product frame — dashboard with auth badge, role chips, an "AI layer" panel overlaying a feature, mini roadmap with 2 ticks done + launch flag. Copy: one core product job, AI where it improves decisions, launch-ready.
- **Custom Platforms** (`custom-web-development`): admin surface — data table, booking calendar, role-based access badges, analytics panel; a faint spreadsheet fading out behind it (the "replace spreadsheets" story told visually).

Supporting-service pages (UI/UX, mobile, cloud, data, consulting, SEO) get the token/type/motion migration only — no custom diagrams; they must remain visually secondary.

---

## 6. Mobile Plan

- **Hero:** copy stacks first; diagram becomes a **single compact card strip** (3 mini cards + line, max 220px tall) below the CTAs — never a squeezed desktop diagram. CTAs full-width, 52px tall, 12px gap.
- **Sticky CTA:** after the user scrolls past the hero, a compact bottom bar (56px): `Book a free fit call` (orange) + price anchor text `Projects from $400`. Hide when the contact section or footer is in view. This is the highest-leverage mobile conversion change.
- **Service paths:** Tier 1 cards stack full-width; Tier 2 becomes a 2-column chip grid.
- **Pricing:** scroll-snap horizontal rail with 88%-width cards + edge-peek of the next card (signals scrollability); dots or `1/5` mono indicator.
- **Case studies:** stack; proof screenshot stays tappable to full-screen modal.
- **Forms:** all inputs ≥48px tall, 16px font (prevents iOS zoom), `inputmode`/`autocomplete` attributes, grouped clusters collapse to single column.
- **Touch targets** ≥44px everywhere (footer links currently need checking); section padding drops to the clamp minimum automatically via `--section-y`.

---

## 7. Accessibility & Technical Cleanliness

- Theme toggle → real `<button aria-pressed>` in the navbar; remove the `div role="button"` + duplicate keydown handling.
- One `<h1>` per page (hero); homepage sections use `<h2>` (already mostly correct via `aria-labelledby` — keep).
- All pipeline/diagram SVGs `aria-hidden="true"` with a visually-hidden one-line description where the diagram carries meaning (hero: `<span class="sr-only">Diagram: a lead flows through an AI agent into a booking and analytics dashboard.</span>`).
- Decorative stat/tech icons: empty `alt=""` (already done in most places — keep pattern).
- Contrast: `--ink-soft #526070` on white = 5.9:1 ✓; verify orange CTA text is **white on #FF9800 fails AA (2.1:1)** — use `#23272F` text on orange buttons, or darken to `#E65100` for white text. Decide once, apply everywhere.
- Focus-visible ring already global (`global.css:39-48`) ✓ — keep, retint to `--action`.
- Fonts via `next/font` = no FOUT, no render-blocking CSS import.
- Rename `Screenshot (1527).png`; sweep `public/` for other space-containing filenames (`mobile%20app%20icon.svg` etc. — rename to kebab-case, update refs).
- Delete `New folder (5)/`, `temp_coverage/`, `temp_performance/` from the repo (or gitignore if genuinely needed locally).
- Run existing `@axe-core/react` + Playwright checks after each section migration (`npm run test:e2e`).

---

## 8. Implementation Checklist (Next.js + CSS Modules tokens + framer-motion)

Ordered so every step ships independently and the site never breaks:

**Phase 1 — Foundations (unblocks everything)**

- [ ] `lib/motion.ts` with EASE/DUR/variants; export `useSitePresence` reduced-motion helper
- [ ] `global.css`: new tokens (§2.1), `[data-theme]` dark block, `--section-y`, reduced-motion guard; delete font `@import`s
- [ ] `app/layout.tsx`: `next/font/google` — Manrope (600/700/800), Inter (400/500/600), JetBrains Mono (500) as CSS variables
- [ ] `ThemeContext`: set `data-theme` on `<html>`; keep existing class for backward compat during migration
- [ ] Grep-and-fix all `font-weight: 900` → 700/800
- [ ] Repo hygiene: delete stray folders, rename `public/` assets to kebab-case, convert GA screenshot to webp

**Phase 2 — Hero + signature (the visible leap)**

- [ ] `PipelineDivider` component (SVG line + pulse, `aria-hidden`, reduced-motion static)
- [ ] Rebuild `welcome.tsx`: outcome h1, compressed timing (CTA ≤1.0s), mono micro-proof line, new CTA styles
- [ ] Rebuild `MegicodeHeroAnimationAdvanced` as the 4-card pipeline diagram (SVG + motion divs; delete canvas/particle code paths)
- [ ] Navbar: 64px, scroll blur, theme toggle moved in as `<button>`, orange Book Fit Call; remove floating toggle from `HomePageClient`

**Phase 3 — Homepage sections (one PR each)**

- [ ] `HomeProof`: rail layout, mono count-up numbers, SVG glyphs, single CSS module on tokens
- [ ] `ServicesFrame`: two-tier restructure (3 dominant + 6 supporting), remove teal, merge buyer-situation copy, formalize divider usage
- [ ] `HomePageClient`: reorder sections; merge Tagline into condensed About block
- [ ] `HomeShippedPlatforms`: ledger card anatomy (PROBLEM/BUILT/OUTCOME), renamed proof asset, product-frame images for all 3
- [ ] `HomePricingPreview`: styled-jsx → CSS module, mono prices, one orange badge, navy hovers, mobile snap rail
- [ ] `HomeTestimonials`: credibility card upgrade (client type + outcome chip)
- [ ] `ContactUs` (home): remove PlexusCanvas, trust chips, link to full form; pulse terminus

**Phase 4 — Pages**

- [ ] `/contact`: grouped fit-review form, right-rail "what happens next," orange submit
- [ ] 3 core service pages: hero diagram + timeline process + fit/not-fit + case embed + pricing entry + navy CTA band
- [ ] `/pricing`, `/projects`, `/reviews`, `/about`: token/type/motion migration to match
- [ ] Supporting service pages: token migration only
- [ ] Mobile sticky CTA bar (site-wide, appears after hero)

**Phase 5 — QA gate (every phase, not just the end)**

- [ ] Lighthouse ≥95 perf / ≥95 a11y on home + 3 core service pages (mobile emulation)
- [ ] Reduced-motion pass: everything readable and static
- [ ] Dark-mode parity screenshot review per section — dark ships only where it matches light polish
- [ ] Playwright e2e green; axe clean; 360px / 768px / 1280px / 1680px visual pass
- [ ] Verify contact + fit-review submissions end-to-end (`/api/contact`)

---

## 9. What deliberately does NOT change

Offer structure and copy logic (buyer-situation framing, "choose by business outcome"), pricing figures and package logic in `data/pricing.ts`, the three case studies and the GA-proof concept, the fit-review qualification fields, the lead flow (`/api/contact`), SEO metadata/sitemap work, the blog/insights system, and everything under `app/internal/`.
