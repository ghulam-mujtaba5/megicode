import fs from 'fs';
import path from 'path';
import {
  getServiceForArticle,
  SERVICE_AI_AUTOMATION,
  SERVICE_AI_SAAS_MVP,
  SERVICE_CUSTOM_WEB,
  type CoreMoneyPage,
  type ServiceFunnelTarget,
} from '../components/Article/ServiceLinkFunnel';

console.log('════════════════════════════════════════════════════════════════');
console.log('  MILESTONE 3: REVERSE-SILO INTERNAL LINK EQUITY TEST SUITE');
console.log('════════════════════════════════════════════════════════════════\n');

const SOURCE_DIR = path.join(process.cwd(), 'content', 'blog-source', 'blogs');
const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.md')).sort();

if (files.length !== 51) {
  console.error(`❌ Expected 51 markdown files, found ${files.length}`);
  process.exit(1);
}

console.log(`✅ Discovered exactly ${files.length} insight articles in content/blog-source/blogs/\n`);

const counts: Record<CoreMoneyPage, number> = {
  '/services/ai-automation-agents': 0,
  '/services/ai-saas-mvp-development': 0,
  '/services/custom-web-development': 0,
};

const mappedArticles: Array<{
  index: number;
  slug: string;
  targetHref: CoreMoneyPage;
  targetTitle: string;
  badge: string;
  contactParam: string;
}> = [];

files.forEach((file, idx) => {
  const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
  const slugMatch = content.match(/slug:\s*['"]?([a-zA-Z0-9_-]+)['"]?/);
  const slug = slugMatch ? slugMatch[1] : file.replace(/^\d+-/, '').replace('.md', '');
  
  const categoryMatch = content.match(/category:\s*['"]?([^'\n\r]+)['"]?/);
  const category = categoryMatch ? categoryMatch[1].trim() : '';

  const target = getServiceForArticle(slug, category);

  // Assert target properties exist and are well-formed
  if (!target.href || !target.title || !target.tagline || !target.description || !target.cta || !target.badge || !target.contactServiceParam) {
    console.error(`❌ Incomplete ServiceFunnelTarget object for slug: ${slug}`, target);
    process.exit(1);
  }

  // Assert target is strictly one of the 3 core money pages
  if (!['/services/ai-automation-agents', '/services/ai-saas-mvp-development', '/services/custom-web-development'].includes(target.href)) {
    console.error(`❌ Invalid target href "${target.href}" for slug: ${slug}`);
    process.exit(1);
  }

  counts[target.href]++;
  mappedArticles.push({
    index: idx + 1,
    slug,
    targetHref: target.href,
    targetTitle: target.title,
    badge: target.badge,
    contactParam: target.contactServiceParam,
  });
});

console.log('─── Category Distribution ──────────────────────────────────────');
console.log(`1. /services/ai-automation-agents:   ${counts['/services/ai-automation-agents']} articles (Expected: 17)`);
console.log(`2. /services/ai-saas-mvp-development: ${counts['/services/ai-saas-mvp-development']} articles (Expected: 18)`);
console.log(`3. /services/custom-web-development:  ${counts['/services/custom-web-development']} articles (Expected: 16)`);
console.log('────────────────────────────────────────────────────────────────\n');

let failed = false;

if (counts['/services/ai-automation-agents'] !== 17) {
  console.error(`❌ Count mismatch for ai-automation-agents: got ${counts['/services/ai-automation-agents']}, expected 17`);
  failed = true;
}
if (counts['/services/ai-saas-mvp-development'] !== 18) {
  console.error(`❌ Count mismatch for ai-saas-mvp-development: got ${counts['/services/ai-saas-mvp-development']}, expected 18`);
  failed = true;
}
if (counts['/services/custom-web-development'] !== 16) {
  console.error(`❌ Count mismatch for custom-web-development: got ${counts['/services/custom-web-development']}, expected 16`);
  failed = true;
}

// Test Fallback Resolution Heuristic
console.log('─── Testing Fallback Resolution Heuristics ─────────────────────');
const testCases = [
  { input: 'unknown-n8n-workflow-guide', cat: 'Automation & Integration', expected: '/services/ai-automation-agents' },
  { input: 'how-to-launch-saas-fast', cat: 'SaaS & Web Platforms', expected: '/services/ai-saas-mvp-development' },
  { input: 'enterprise-custom-database-scaling', cat: 'Engineering', expected: '/services/custom-web-development' },
];

testCases.forEach((tc) => {
  const res = getServiceForArticle(tc.input, tc.cat);
  if (res.href === tc.expected) {
    console.log(`✅ Fallback for "${tc.input}" -> ${res.href} (PASS)`);
  } else {
    console.error(`❌ Fallback for "${tc.input}" failed: got ${res.href}, expected ${tc.expected}`);
    failed = true;
  }
});

if (failed) {
  console.error('\n❌ Milestone 3 test suite encountered failures.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL 51 ARTICLES & FALLBACK HEURISTICS VERIFIED CLEANLY (100% PASS)');
}
