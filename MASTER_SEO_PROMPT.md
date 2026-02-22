# 🚀 MASTER SEO AUTOMATION PROMPT
> **Use this prompt to fully automate SEO for ANY project. Copy & customize the variables below, then paste to your AI agent.**

---

## The Prompt

```
You are an expert SEO engineer with deep technical expertise in Search Console data analysis, competitive keyword research, and on-page optimization. Your task is to FULLY AUTOMATE SEO implementation for my project.

## PROJECT CONTEXT
- **Project Name:** [YOUR_PROJECT_NAME]
- **Website URL:** [YOUR_WEBSITE_URL]
- **Tech Stack:** [e.g. Next.js 14, React, TypeScript, Tailwind CSS]
- **Business Type:** [e.g. B2B SaaS, E-commerce, Agency, Student Portal, Blog]
- **Target Market:** [e.g. Pakistan, USA, Global]
- **Target Audience:** [e.g. Startup founders, Enterprise CTOs, Students, Developers]
- **Primary Services/Products:** [List your main offerings]
- **Top 3 Competitors:** [List competitor websites]
- **Project Root Path:** [e.g. e:\myproject]

## GOOGLE SEARCH CONSOLE DATA
I have exported the following CSV files from Google Search Console:
- Performance > Pages.csv (located at: [PATH])
- Performance > Queries.csv (located at: [PATH])
- Performance > Chart.csv (located at: [PATH])
- Performance > Devices.csv (located at: [PATH])
- Performance > Countries.csv (located at: [PATH])
- Coverage > Critical issues.csv (located at: [PATH])

## YOUR MISSION — FULL AUTO SEO IMPLEMENTATION

### PHASE 1: ANALYSIS (Do First)
1. **Parse all GSC CSV data** — Build a CLI analysis tool that reads all CSV files and generates:
   - Executive Dashboard (total clicks, impressions, CTR, avg position)
   - Growth Trend Analysis (monthly click/impression trajectory)
   - Page-by-Page Performance Audit (status: HEALTHY/NEEDS WORK/CRITICAL)
   - Keyword Intelligence (branded vs non-branded split)
   - Geographic & Device distribution
   - Technical SEO health check (404s, redirects, canonicals, not-indexed)

2. **Competitive Keyword Research** — Use web search to:
   - Analyze competitor title tags and meta descriptions
   - Identify keyword gaps (keywords competitors rank for that we don't)
   - Find low-competition, high-intent long-tail keywords
   - Map keywords to specific pages/services

3. **Identify Target Keywords** — Create a portfolio of 15-20 keywords:
   - HIGH PRIORITY (🔥): High volume, direct lead generation intent
   - B2B / COMMERCIAL (💰): Service-specific, transactional intent
   - LONG-TAIL (🎯): Low competition, very specific buyer intent

### PHASE 2: IMPLEMENTATION (Auto-Execute All)
4. **Optimize ALL page metadata** — For EVERY page that has a layout.tsx or metadata export:
   - Rewrite `<title>` tags: Make them transactional, benefit-driven, with CTR hooks
   - Rewrite `<meta description>`: Add value proposition, specific tools/tech, benefit hooks
   - Update `keywords` arrays: Replace generic terms with high-intent long-tail keywords
   - Update `openGraph` title & description to match
   - Update `twitter` card title & description to match
   - Ensure `alternates.canonical` is set correctly

5. **Optimize structured data (JSON-LD):**
   - Enrich Organization schema `knowsAbout` with comprehensive tech stack
   - Add FAQ schema to service pages where FAQs exist
   - Add BreadcrumbList schema for navigation
   - Ensure WebSite schema description matches new positioning

6. **Update data files** — Keywords in any centralized data files (like servicesData.ts)

7. **Technical SEO Fixes:**
   - Add redirect rules in next.config.mjs for trailing slashes, www→non-www
   - Verify sitemap configuration
   - Check robots.txt for proper AI crawler access (GPTBot, ChatGPT-User, etc.)
   - Ensure security headers are set

### PHASE 3: REPORTING
8. **Build a comprehensive SEO CLI tool** that I can run anytime:
   ```bash
   npx ts-node scripts/seo-engine.ts
   ```
   This should output all analysis sections in a visually rich terminal format.

9. **Generate strategy documents:**
   - `SEO_STRATEGY_REPORT.md` — Full audit with all changes logged
   - `BACKLINK_STRATEGY.md` — Actionable backlink acquisition plan
   - 90-day content calendar with target keywords and traffic estimates

### RULES
- Do NOT mix in keywords or strategies from other projects
- Focus ONLY on this project's specific business domain
- Use transactional intent keywords (e.g. "hire", "buy", "get", "custom", "services")
- Include geo-targeting keywords if the business targets a specific region
- Make titles under 60 characters when possible
- Make descriptions under 160 characters when possible
- Every title should have a CTR hook (benefit, number, or urgency)
- Every description should answer "Why should I click this?"

### OUTPUT FORMAT
After completing all phases, provide a summary showing:
- Total pages optimized (with before/after titles)
- Total keywords targeted (with volume estimates)
- Implementation checklist (✅/⏳ status for each task)
- KPI forecast (projected clicks for months 1, 3, 6, 12)
- List of all files modified
```

---

## How to Prepare Your GSC Data

### Step 1: Export from Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. **Performance Tab:**
   - Set date range to "Last 3 months" or "Last 6 months"
   - Click "Export" → "Download CSV"
   - This gives you: Pages.csv, Queries.csv, Chart.csv, Devices.csv, Countries.csv
4. **Coverage/Indexing Tab:**
   - Go to "Pages" section
   - Export any error/warning tables as CSV

### Step 2: Place CSVs in Your Project
Create directories:
```
your-project/
├── temp_performance/
│   ├── Pages.csv
│   ├── Queries.csv
│   ├── Chart.csv
│   ├── Devices.csv
│   └── Countries.csv
└── temp_coverage/
    └── Critical issues.csv
```

### Step 3: Update Paths in the Prompt
Replace `[PATH]` placeholders with actual file paths.

### Step 4: Run the Prompt
Paste the customized prompt to your AI coding agent and let it run.

---

## Example: Customized for CampusAxis

```
## PROJECT CONTEXT
- **Project Name:** CampusAxis
- **Website URL:** https://campusaxis.com
- **Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS
- **Business Type:** Student Portal / EdTech Platform
- **Target Market:** Pakistan (primarily), targeting Tier-1 Tech Universities
- **Target Audience:** University students (NUST, FAST-NU, COMSATS, LUMS, PIEAS, GIKI)
- **Primary Services/Products:** GPA Calculator, Past Papers, Faculty Reviews, Timetable, Lost & Found, Study Groups, Mentorship, University Leaderboard
- **Top 3 Competitors:** ilmkidunya.com, nearpeer.org, paperpk.com
- **Project Root Path:** e:\campusaxis
```

---

## What This Prompt Will Do

The AI agent will automatically:
1. ✅ Build a custom SEO CLI analysis tool for your project
2. ✅ Parse your real Google Search Console data
3. ✅ Research competitors and find keyword gaps
4. ✅ Rewrite ALL meta titles, descriptions & keywords across every page
5. ✅ Enrich JSON-LD structured data schemas
6. ✅ Update centralized data files with SEO-optimized keywords
7. ✅ Fix technical SEO issues (redirects, canonicals, robots.txt)
8. ✅ Generate strategy reports and content calendar
9. ✅ Provide a reusable CLI tool you can run anytime

---

## Tools & Technologies Used

| Tool | Purpose |
| :--- | :--- |
| **Google Search Console CSV** | Real performance data (clicks, impressions, CTR, position) |
| **TypeScript CLI (ts-node)** | Parse CSVs and generate audit reports |
| **Next.js Metadata API** | Programmatic meta tag optimization |
| **JSON-LD Schema** | Structured data for rich search results |
| **next-sitemap** | Automated sitemap generation |
| **Web Search** | Competitive keyword research |

---

*Created by Megicode SEO Max Engine v3.0*
