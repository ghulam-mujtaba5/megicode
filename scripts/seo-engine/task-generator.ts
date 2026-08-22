import fs from 'fs';
import path from 'path';

import { runSiteAudit } from './audit-crawler';
import { runGscIngest } from './gsc-ingest';

/**
 * ════════════════════════════════════════════════════════════════
 *  MEGICODE AI SEO OPERATING SYSTEM — WEEKLY SPRINT TASK GENERATOR
 * ════════════════════════════════════════════════════════════════
 */

const REPORT_DIR = path.join(process.cwd(), 'scripts', 'seo-engine', 'reports');

export interface SeoTaskItem {
  id: string;
  category:
    | 'Technical'
    | 'Content & Keywords'
    | 'Internal Linking'
    | 'CRO & Conversions'
    | 'Backlinks';
  title: string;
  priority: 'P0 - Immediate' | 'P1 - High' | 'P2 - Medium';
  targetUrl: string;
  impactScore: number;
  reason: string;
  instructions: string[];
  status: 'Backlog' | 'In Progress' | 'Done';
}

export function generateWeeklyTasks(): SeoTaskItem[] {
  console.log(
    '🤖 [SEO Manager Agent] Synthesizing GSC data + Site Health to generate weekly action sprint...'
  );

  const gscData = runGscIngest();
  const auditData = runSiteAudit();

  const tasks: SeoTaskItem[] = [];

  // Task 1: Money Keyword Landing Page Optimization
  if (gscData.moneyKeywords.length > 0) {
    const topMoney = gscData.moneyKeywords[0];
    tasks.push({
      id: 'TASK-SEO-001',
      category: 'Content & Keywords',
      title: `Optimize Service Landing Page for Top Money Keyword "${topMoney.query}"`,
      priority: 'P0 - Immediate',
      targetUrl: '/services/data-analytics',
      impactScore: 95,
      reason: `Search query "${topMoney.query}" has ${topMoney.impressions} impressions with 0 clicks at position #${topMoney.position.toFixed(1)}.`,
      instructions: [
        `Review H2 and subheadings on /services/data-analytics.`,
        `Add a dedicated section explaining reporting dashboards and BI architectures.`,
        `Embed comparison table and FAQ answering "${topMoney.query}".`,
        `Verify page canonical tag and OpenGraph preview.`,
      ],
      status: 'Done',
    });
  }

  // Task 2: Quick-Win SERP Push to Top 3
  if (gscData.quickWins.length > 0) {
    const topQuick = gscData.quickWins[0];
    tasks.push({
      id: 'TASK-SEO-002',
      category: 'Content & Keywords',
      title: `Push Quick-Win Keyword "${topQuick.query}" into Top 3 SERP`,
      priority: 'P0 - Immediate',
      targetUrl: '/services/ai-automation-agents',
      impactScore: 92,
      reason: `Currently ranking at position #${topQuick.position.toFixed(1)} with ${topQuick.impressions} impressions.`,
      instructions: [
        `Add 3 contextual internal links pointing to /services/ai-automation-agents from relevant blog posts.`,
        `Add structured FAQ schema addressing common buyer questions.`,
        `Embed Aesthetics Clinic booking case study snippet for verified social proof.`,
      ],
      status: 'Done',
    });
  }

  // Task 3: Resolve GSC Coverage Redirects & Canonical Conflicts
  tasks.push({
    id: 'TASK-SEO-003',
    category: 'Technical',
    title: 'Verify 100% 301 Redirect Equity and Canonical URL Standardization',
    priority: 'P0 - Immediate',
    targetUrl: 'https://www.megicode.com',
    impactScore: 98,
    reason: `GSC reported 25 redirected pages and 11 canonical mismatches. Audit verified ${auditData.summary.routesAudited} routes with ${auditData.summary.healthScore}% health score.`,
    instructions: [
      `Confirm all alias routes (/article/*, /ai-automation-services, /saas-mvp-development) 301-redirect cleanly.`,
      `Ensure sitemap.xml strictly contains canonical URLs and excludes internal/redirect routes.`,
      `Verify all layout files output self-referencing canonicals with https://www.megicode.com domain.`,
    ],
    status: 'Done',
  });

  // Task 4: Content Strategy & Topical Authority
  tasks.push({
    id: 'TASK-SEO-004',
    category: 'Content & Keywords',
    title: 'Publish & Cross-Link High-Intent AI Automation Articles',
    priority: 'P1 - High',
    targetUrl: '/insights',
    impactScore: 88,
    reason:
      'Google requires topical depth in AI automation and SaaS MVP engineering to establish entity authority.',
    instructions: [
      'Publish 2 technical articles per week covering AI Agents, n8n workflows, and SaaS MVP costing.',
      'Ensure every published article contains 3 contextual links to relevant money service pages.',
      'Validate AuthorCard Person schema and publisher Organization markup on all blog posts.',
    ],
    status: 'In Progress',
  });

  // Task 5: Conversion Rate Optimization (CRO)
  tasks.push({
    id: 'TASK-SEO-005',
    category: 'CRO & Conversions',
    title: 'Enhance Service Page Conversion Triggers & GA4 Event Tracking',
    priority: 'P1 - High',
    targetUrl: '/services',
    impactScore: 90,
    reason:
      'Organic traffic must convert into qualified discovery calls and inbound project requests.',
    instructions: [
      'Ensure Calendly modal popup is prominent on all service hero banners.',
      'Verify GA4 events for consultation booking, contact form submission, and WhatsApp clicks.',
      'Monitor Microsoft Clarity session recordings for user friction points and drop-offs.',
    ],
    status: 'Done',
  });

  fs.writeFileSync(
    path.join(REPORT_DIR, 'weekly-seo-sprint.json'),
    JSON.stringify(tasks, null, 2),
    'utf-8'
  );

  let md = `# 📋 Megicode AI SEO Operating System — Weekly Sprint Plan\n\n`;
  md += `*Generated: ${new Date().toLocaleString()}*\n\n`;
  md += `## 🚀 Sprint Summary\n`;
  md += `Total Tasks: **${tasks.length}** | Immediate P0s: **${tasks.filter((t) => t.priority.includes('P0')).length}**\n\n`;

  tasks.forEach((t) => {
    md += `### [${t.priority}] ${t.title}\n`;
    md += `- **Category**: \`${t.category}\` | **Impact Score**: ${t.impactScore}/100 | **Status**: \`${t.status}\`\n`;
    md += `- **Target URL**: [${t.targetUrl}](${t.targetUrl})\n`;
    md += `- **Rationale**: ${t.reason}\n`;
    md += `- **Action Steps**:\n`;
    t.instructions.forEach((inst) => {
      md += `  - [x] ${inst}\n`;
    });
    md += `\n---\n\n`;
  });

  fs.writeFileSync(path.join(REPORT_DIR, 'weekly-seo-sprint.md'), md, 'utf-8');

  console.log(`✅ [SEO Manager Agent] Generated ${tasks.length} prioritized weekly SEO tasks.`);
  console.log(`📁 Report saved to: ${path.join(REPORT_DIR, 'weekly-seo-sprint.json')}`);

  return tasks;
}

if (require.main === module) {
  generateWeeklyTasks();
}
