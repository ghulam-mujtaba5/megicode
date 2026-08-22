import fs from 'fs';
import path from 'path';
import { runGscIngest } from './gsc-ingest';
import { runSiteAudit } from './audit-crawler';

/**
 * ════════════════════════════════════════════════════════════════
 *  MEGICODE AI SEO OPERATING SYSTEM — LOOKER STUDIO EXPORTER
 * ════════════════════════════════════════════════════════════════
 */

const EXPORT_DIR = path.join(process.cwd(), 'scripts', 'seo-engine', 'exports');

if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

export function exportForLookerStudio() {
  console.log('📊 [Looker Exporter] Generating normalized feeds for Looker Studio dashboards...');

  const gsc = runGscIngest();
  const audit = runSiteAudit();

  // 1. Export Keyword Opportunities CSV
  const keywordHeaders = 'Category,Query,Impressions,Clicks,CTR,Position,Strategic_Action\n';
  const keywordRows = [
    ...gsc.quickWins.map(
      (q) =>
        `"Quick Win","${q.query.replace(/"/g, '""')}",${q.impressions},${q.clicks},"${q.ctr}",${q.position},"${q.action.replace(/"/g, '""')}"`
    ),
    ...gsc.moneyKeywords.map(
      (m) =>
        `"Money Keyword","${m.query.replace(/"/g, '""')}",${m.impressions},${m.clicks},"${m.ctr}",${m.position},"${m.action.replace(/"/g, '""')}"`
    ),
  ].join('\n');

  fs.writeFileSync(path.join(EXPORT_DIR, 'looker-keyword-opportunities.csv'), keywordHeaders + keywordRows, 'utf-8');

  // 2. Export Page Health & Audit CSV
  const pageHeaders = 'Route,Health_Score,Title,Title_Length,Canonical_Status,Schema_Markup\n';
  const pageRows = audit.routes
    .map(
      (r) =>
        `"${r.path}",${r.healthScore},"${r.title.replace(/"/g, '""')}",${r.titleLength},"${r.canonicalStatus}","${r.schemaTypes.join('; ')}"`
    )
    .join('\n');

  fs.writeFileSync(path.join(EXPORT_DIR, 'looker-page-health.csv'), pageHeaders + pageRows, 'utf-8');

  // 3. Export Executive Metrics JSON
  const executiveMetrics = {
    timestamp: new Date().toISOString(),
    overallHealthScore: audit.overallHealthScore,
    totalTrackedPages: gsc.summary.totalTrackedPages,
    totalTrackedQueries: gsc.summary.totalQueries,
    totalImpressions: gsc.summary.totalImpressions,
    totalClicks: gsc.summary.totalClicks,
    averagePosition: gsc.summary.avgPosition,
    averageCtr: gsc.summary.overallCtr,
    quickWinsCount: gsc.quickWins.length,
    moneyKeywordsCount: gsc.moneyKeywords.length,
  };

  fs.writeFileSync(
    path.join(EXPORT_DIR, 'looker-executive-summary.json'),
    JSON.stringify(executiveMetrics, null, 2),
    'utf-8'
  );

  console.log('✅ [Looker Exporter] Successfully exported datasets to:');
  console.log(`   - ${path.join(EXPORT_DIR, 'looker-keyword-opportunities.csv')}`);
  console.log(`   - ${path.join(EXPORT_DIR, 'looker-page-health.csv')}`);
  console.log(`   - ${path.join(EXPORT_DIR, 'looker-executive-summary.json')}`);
}

if (require.main === module) {
  exportForLookerStudio();
}
