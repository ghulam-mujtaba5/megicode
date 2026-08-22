import fs from 'fs';
import path from 'path';

/**
 * ════════════════════════════════════════════════════════════════
 *  MEGICODE AI SEO OPERATING SYSTEM — GSC DATA INGESTION ENGINE
 * ════════════════════════════════════════════════════════════════
 */

const PERFORMANCE_DIR = path.join(process.cwd(), 'temp_gsc_performance_aug2026');
const COVERAGE_DIR = path.join(process.cwd(), 'temp_gsc_coverage_aug2026');
const REPORT_DIR = path.join(process.cwd(), 'scripts', 'seo-engine', 'reports');

if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function parseCSV(filePath: string): Record<string, string>[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter((l) => l.trim());
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (values[i] || '').trim().replace(/^"|"$/g, '');
    });
    return obj;
  });
}

export interface GscAnalysisReport {
  timestamp: string;
  summary: {
    totalQueries: number;
    totalTrackedPages: number;
    totalClicks: number;
    totalImpressions: number;
    overallCtr: string;
    avgPosition: number;
  };
  quickWins: Array<{
    query: string;
    impressions: number;
    clicks: number;
    ctr: string;
    position: number;
    action: string;
  }>;
  moneyKeywords: Array<{
    query: string;
    impressions: number;
    clicks: number;
    ctr: string;
    position: number;
    priority: string;
    action: string;
  }>;
  coverageIssues: Array<{
    reason: string;
    pages: number;
    source: string;
    status: string;
  }>;
  pagePerformance: Array<{
    url: string;
    clicks: number;
    impressions: number;
    ctr: string;
    position: number;
  }>;
}

export function runGscIngest(): GscAnalysisReport {
  console.log('🔄 [GSC Ingest] Parsing Google Search Console export datasets...');

  const queriesRaw = parseCSV(path.join(PERFORMANCE_DIR, 'Queries.csv'));
  const pagesRaw = parseCSV(path.join(PERFORMANCE_DIR, 'Pages.csv'));
  const criticalRaw = parseCSV(path.join(COVERAGE_DIR, 'Critical issues.csv'));

  let totalClicks = 0;
  let totalImpressions = 0;
  let posSum = 0;

  const validQueries = queriesRaw
    .map((q) => {
      const clicks = parseInt(q.Clicks || '0', 10);
      const impressions = parseInt(q.Impressions || '0', 10);
      const position = parseFloat(q.Position || '0');
      const ctr = q.CTR || '0%';
      totalClicks += clicks;
      totalImpressions += impressions;
      posSum += position;

      return {
        query: q['Top queries'] || '',
        clicks,
        impressions,
        ctr,
        position,
      };
    })
    .filter((q) => q.query.length > 0);

  const avgPosition = validQueries.length > 0 ? parseFloat((posSum / validQueries.length).toFixed(2)) : 0;
  const overallCtr =
    totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : '0%';

  // 1. Quick Wins (Position 4 - 20) -> Push to Top 3
  const quickWins = validQueries
    .filter((q) => q.position >= 4.0 && q.position <= 20.0 && !q.query.toLowerCase().includes('megicode'))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20)
    .map((q) => ({
      ...q,
      action: `Boost content depth, add FAQ schema & internal links to push from #${q.position.toFixed(1)} into Top 3`,
    }));

  // 2. Money Keywords (High Impressions + Low Clicks/CTR) -> Priority Landing Optimization
  const moneyKeywords = validQueries
    .filter((q) => q.impressions >= 10 && q.clicks === 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25)
    .map((q) => ({
      ...q,
      priority: q.impressions > 50 ? 'P0 CRITICAL' : 'P1 HIGH',
      action: `Align H1/H2 headings, enhance commercial CTA & build supporting contextual links for "${q.query}"`,
    }));

  // 3. Coverage Analysis
  const coverageIssues = criticalRaw.map((c) => ({
    reason: c.Reason || 'Unknown Issue',
    pages: parseInt(c.Pages || '0', 10),
    source: c.Source || 'Google Systems',
    status: c.Validation || 'Pending',
  }));

  // 4. Page Performance
  const pagePerformance = pagesRaw
    .map((p) => ({
      url: p['Top pages'] || '',
      clicks: parseInt(p.Clicks || '0', 10),
      impressions: parseInt(p.Impressions || '0', 10),
      ctr: p.CTR || '0%',
      position: parseFloat(p.Position || '0'),
    }))
    .filter((p) => p.url.length > 0)
    .sort((a, b) => b.impressions - a.impressions);

  const report: GscAnalysisReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalQueries: validQueries.length,
      totalTrackedPages: pagePerformance.length,
      totalClicks,
      totalImpressions,
      overallCtr,
      avgPosition,
    },
    quickWins,
    moneyKeywords,
    coverageIssues,
    pagePerformance: pagePerformance.slice(0, 30),
  };

  // Write JSON report
  fs.writeFileSync(
    path.join(REPORT_DIR, 'gsc-analysis-latest.json'),
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  // Write Markdown summary
  let md = `# 📊 Megicode GSC Performance & Opportunity Report\n\n`;
  md += `*Generated: ${new Date().toLocaleString()}*\n\n`;
  md += `## 📈 Executive Overview\n`;
  md += `- **Active Tracked Queries**: ${report.summary.totalQueries}\n`;
  md += `- **Indexed / Tracked Pages**: ${report.summary.totalTrackedPages}\n`;
  md += `- **Total Search Impressions**: ${report.summary.totalImpressions.toLocaleString()}\n`;
  md += `- **Total Search Clicks**: ${report.summary.totalClicks.toLocaleString()}\n`;
  md += `- **Average Search Position**: ${report.summary.avgPosition}\n`;
  md += `- **Search Click-Through Rate**: ${report.summary.overallCtr}\n\n`;

  md += `## 🎯 Top Quick-Win Opportunities (Positions 4–20)\n`;
  md += `| Query | Position | Impressions | Clicks | CTR | Action Plan |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  quickWins.slice(0, 10).forEach((q) => {
    md += `| **${q.query}** | #${q.position.toFixed(1)} | ${q.impressions} | ${q.clicks} | ${q.ctr} | ${q.action} |\n`;
  });

  md += `\n## 💰 High-Intent Money Keywords (High Impressions, Zero Clicks)\n`;
  md += `| Priority | Keyword | Impressions | Position | Strategic Recommendation |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;
  moneyKeywords.slice(0, 10).forEach((m) => {
    md += `| **${m.priority}** | **${m.query}** | ${m.impressions} | #${m.position.toFixed(1)} | ${m.action} |\n`;
  });

  md += `\n## 🛠️ Google Indexing Coverage Status\n`;
  coverageIssues.forEach((c) => {
    md += `- **${c.reason}**: ${c.pages} pages affected (${c.status})\n`;
  });

  fs.writeFileSync(path.join(REPORT_DIR, 'gsc-analysis-latest.md'), md, 'utf-8');

  console.log(`✅ [GSC Ingest] Successfully processed ${validQueries.length} queries & ${coverageIssues.length} coverage issues.`);
  console.log(`📁 Report saved to: ${path.join(REPORT_DIR, 'gsc-analysis-latest.json')}`);

  return report;
}

// Allow direct CLI execution
if (require.main === module) {
  runGscIngest();
}
