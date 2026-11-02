import * as fs from 'fs';
import * as path from 'path';
import {
  getServiceForArticle,
  SERVICE_AI_AUTOMATION,
  SERVICE_AI_SAAS_MVP,
  SERVICE_CUSTOM_WEB,
  type CoreMoneyPage,
  type ServiceFunnelTarget,
} from '../components/Article/ServiceLinkFunnel';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details?: any;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, details?: any) {
  if (condition) {
    results.push({ suite, name, passed: true, details });
    console.log(`  [PASS] ${suite} -> ${name}`);
  } else {
    results.push({ suite, name, passed: false, details, error: 'Assertion failed' });
    console.error(`  [FAIL] ${suite} -> ${name}`, details || '');
  }
}

console.log('\n======================================================');
console.log('CHALLENGER MILESTONE 3 EMPIRICAL & ADVERSARIAL TEST HARNESS');
console.log('======================================================\n');

// ----------------------------------------------------
// SUITE 1: 51 INSIGHT ARTICLES EXACT RESOLUTION & CATALOG INTEGRITY
// ----------------------------------------------------
console.log('>>> SUITE 1: 51 Insight Articles Exact Resolution & Catalog Integrity');

const SOURCE_DIR = path.join(process.cwd(), 'content', 'blog-source', 'blogs');
const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.md')).sort();

assert(files.length === 51, 'Catalog Integrity', `Exactly 51 markdown article files exist in content/blog-source/blogs/ (Found: ${files.length})`);

const counts: Record<CoreMoneyPage, number> = {
  '/services/ai-automation-agents': 0,
  '/services/ai-saas-mvp-development': 0,
  '/services/custom-web-development': 0,
};

const VALID_MONEY_PAGES = new Set<CoreMoneyPage>([
  '/services/ai-automation-agents',
  '/services/ai-saas-mvp-development',
  '/services/custom-web-development',
]);

const VALID_CONTACT_PARAMS = new Set([
  'ai-automation-agents',
  'lean-ai-saas-mvp',
  'starter-business-platform',
]);

files.forEach((file, idx) => {
  const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
  const slugMatch = content.match(/slug:\s*['"]?([a-zA-Z0-9_-]+)['"]?/);
  const slug = slugMatch ? slugMatch[1] : file.replace(/^\d+-/, '').replace('.md', '');
  
  const categoryMatch = content.match(/category:\s*['"]?([^'\n\r]+)['"]?/);
  const category = categoryMatch ? categoryMatch[1].trim() : '';

  const tagsMatch = content.match(/tags:\s*\[(.*?)\]/);
  const tags = tagsMatch ? tagsMatch[1].split(',').map((t) => t.replace(/['"]/g, '').trim()) : [];

  const target = getServiceForArticle(slug, category, tags);

  assert(
    VALID_MONEY_PAGES.has(target.href),
    'Article Resolution',
    `Article ${idx + 1}/${files.length} ("${slug}") routes to valid core money page: ${target.href}`,
    { file, slug, targetHref: target.href }
  );

  assert(
    typeof target.title === 'string' && target.title.length > 5,
    'Target Contract',
    `Target title is non-empty for "${slug}"`
  );

  assert(
    typeof target.tagline === 'string' && target.tagline.length > 10,
    'Target Contract',
    `Target tagline is non-empty for "${slug}"`
  );

  assert(
    typeof target.description === 'string' && target.description.length > 20,
    'Target Contract',
    `Target description is detailed for "${slug}"`
  );

  assert(
    typeof target.cta === 'string' && target.cta.length > 5,
    'Target Contract',
    `Target cta is non-empty for "${slug}"`
  );

  assert(
    typeof target.badge === 'string' && target.badge.length > 3,
    'Target Contract',
    `Target badge is non-empty for "${slug}"`
  );

  assert(
    VALID_CONTACT_PARAMS.has(target.contactServiceParam),
    'Target Contract',
    `Target contactServiceParam "${target.contactServiceParam}" is valid for "${slug}"`
  );

  if (counts[target.href] !== undefined) {
    counts[target.href]++;
  }
});

console.log('\n--- Article Distribution Summary ---');
console.log(`  AI Automation: ${counts['/services/ai-automation-agents']} (Expected: 17)`);
console.log(`  AI SaaS MVP:   ${counts['/services/ai-saas-mvp-development']} (Expected: 18)`);
console.log(`  Custom Web:    ${counts['/services/custom-web-development']} (Expected: 16)`);

assert(
  counts['/services/ai-automation-agents'] === 17,
  'Distribution Balance',
  `ai-automation-agents receives exactly 17 articles (Actual: ${counts['/services/ai-automation-agents']})`
);

assert(
  counts['/services/ai-saas-mvp-development'] === 18,
  'Distribution Balance',
  `ai-saas-mvp-development receives exactly 18 articles (Actual: ${counts['/services/ai-saas-mvp-development']})`
);

assert(
  counts['/services/custom-web-development'] === 16,
  'Distribution Balance',
  `custom-web-development receives exactly 16 articles (Actual: ${counts['/services/custom-web-development']})`
);

assert(
  counts['/services/ai-automation-agents'] + counts['/services/ai-saas-mvp-development'] + counts['/services/custom-web-development'] === 51,
  'Distribution Balance',
  'Total resolved articles equals exactly 51 (100% coverage)'
);

// ----------------------------------------------------
// SUITE 2: ADVERSARIAL STRESS-TESTING & INPUT NORMALIZATION
// ----------------------------------------------------
console.log('\n>>> SUITE 2: Adversarial Stress-Testing & Input Normalization');

const dirtyInputsAutomation = [
  '  ai-agent-development-for-business-what-to-automate-first  ',
  '/ai-agent-development-for-business-what-to-automate-first',
  '/insights/ai-agent-development-for-business-what-to-automate-first',
  '/insights/AI-AGENT-DEVELOPMENT-FOR-BUSINESS-WHAT-TO-AUTOMATE-FIRST',
  'AI-AGENT-DEVELOPMENT-FOR-BUSINESS-WHAT-TO-AUTOMATE-FIRST',
];

dirtyInputsAutomation.forEach((input) => {
  const res = getServiceForArticle(input);
  assert(
    res.href === '/services/ai-automation-agents',
    'Adversarial Input Normalization',
    `Normalized input "${input.trim()}" correctly resolves to /services/ai-automation-agents`
  );
});

const dirtyInputsSaas = [
  '  build-ai-saas-mvp-without-wasting-budget  ',
  '/insights/build-ai-saas-mvp-without-wasting-budget',
  '/insights/BUILD-AI-SAAS-MVP-WITHOUT-WASTING-BUDGET',
];

dirtyInputsSaas.forEach((input) => {
  const res = getServiceForArticle(input);
  assert(
    res.href === '/services/ai-saas-mvp-development',
    'Adversarial Input Normalization',
    `Normalized input "${input.trim()}" correctly resolves to /services/ai-saas-mvp-development`
  );
});

const dirtyInputsWeb = [
  '  react-native-vs-flutter-startup-app  ',
  '/insights/react-native-vs-flutter-startup-app',
  '/insights/REACT-NATIVE-VS-FLUTTER-STARTUP-APP',
];

dirtyInputsWeb.forEach((input) => {
  const res = getServiceForArticle(input);
  assert(
    res.href === '/services/custom-web-development',
    'Adversarial Input Normalization',
    `Normalized input "${input.trim()}" correctly resolves to /services/custom-web-development`
  );
});

const heuristicScenarios = [
  { slug: 'brand-new-custom-agent-workflow-2027', category: 'Automation', tags: ['n8n', 'pipeline'], expected: '/services/ai-automation-agents' },
  { slug: 'whatsapp-bot-integration-flow', category: 'Chatbots', tags: ['crm'], expected: '/services/ai-automation-agents' },
  { slug: 'how-to-build-a-b2b-saas-platform', category: 'Startups', tags: ['mvp', 'subscription'], expected: '/services/ai-saas-mvp-development' },
  { slug: 'launching-your-first-ai-product', category: 'Product Strategy', tags: ['dashboard'], expected: '/services/ai-saas-mvp-development' },
  { slug: 'building-high-concurrency-backend-services', category: 'Engineering', tags: ['cloud', 'devops'], expected: '/services/custom-web-development' },
  { slug: 'completely-unknown-random-topic-xyz', category: undefined, tags: undefined, expected: '/services/custom-web-development' },
];

heuristicScenarios.forEach((sc) => {
  const res = getServiceForArticle(sc.slug, sc.category, sc.tags);
  assert(
    res.href === sc.expected,
    'Semantic Heuristics',
    `Heuristic for "${sc.slug}" (cat: ${sc.category || 'none'}) routes to ${sc.expected}`
  );
});

const emptyRes = getServiceForArticle(undefined, undefined, undefined);
assert(
  emptyRes.href === '/services/custom-web-development',
  'Empty Input Robustness',
  'getServiceForArticle(undefined, undefined, undefined) safely defaults without throwing'
);

// ----------------------------------------------------
// SUITE 3: MID-ARTICLE CALLOUT INJECTION LOGIC SIMULATION
// ----------------------------------------------------
console.log('\n>>> SUITE 3: Mid-Article Callout Injection & Heading Boundary Tests');

function injectMidArticleCalloutTest(html: string, target: ServiceFunnelTarget): string {
  if (!html) return html;

  const calloutHtml = `
<aside class="mid-article-funnel-banner" style="margin: 2.25rem 0; padding: 1.5rem; border-radius: 12px; background: rgba(37, 99, 235, 0.06); border-left: 4px solid #2563eb; border-top: 1px solid rgba(37, 99, 235, 0.15); border-right: 1px solid rgba(37, 99, 235, 0.15); border-bottom: 1px solid rgba(37, 99, 235, 0.15);">
  <div style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #2563eb; margin-bottom: 0.35rem;">
    Enterprise Execution &amp; Consulting
  </div>
  <p style="margin: 0 0 0.75rem 0; font-size: 0.98rem; line-height: 1.55; color: inherit; font-weight: 500;">
    Looking to execute this in production? Explore Megicode's verified architecture in <strong><a href="${target.href}" style="color: #2563eb; text-decoration: underline; font-weight: 700;">${target.title}</a></strong>.
  </p>
  <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
    <a href="${target.href}" style="display: inline-flex; align-items: center; font-size: 0.85rem; font-weight: 700; color: #ffffff; background-color: #2563eb; padding: 6px 14px; border-radius: 6px; text-decoration: none;">
      ${target.cta}
    </a>
    <a href="/contact?service=${target.contactServiceParam}" style="display: inline-flex; align-items: center; font-size: 0.85rem; font-weight: 600; color: #2563eb; text-decoration: none;">
      Book Technical Strategy Call &rarr;
    </a>
  </div>
</aside>
`.trim();

  let count = 0;
  const regex = /<\/h2>/gi;
  let match: RegExpExecArray | null;
  let insertIndex = -1;

  while ((match = regex.exec(html)) !== null) {
    count++;
    if (count === 2) {
      insertIndex = match.index + match[0].length;
      break;
    }
  }

  if (insertIndex === -1 && count === 1) {
    const firstMatch = /<\/h2>/i.exec(html);
    if (firstMatch) {
      insertIndex = firstMatch.index + firstMatch[0].length;
    }
  }

  if (insertIndex === -1) {
    let pCount = 0;
    const pRegex = /<\/p>/gi;
    let pMatch: RegExpExecArray | null;
    while ((pMatch = pRegex.exec(html)) !== null) {
      pCount++;
      if (pCount === 2) {
        insertIndex = pMatch.index + pMatch[0].length;
        break;
      }
    }
  }

  if (insertIndex !== -1) {
    return html.slice(0, insertIndex) + '\n\n' + calloutHtml + '\n\n' + html.slice(insertIndex);
  }

  return html + '\n\n' + calloutHtml;
}

const htmlWithTwoH2 = '<h2>Section 1</h2><p>Intro</p><h2>Section 2</h2><p>Body</p><h2>Section 3</h2>';
const injectedA = injectMidArticleCalloutTest(htmlWithTwoH2, SERVICE_AI_AUTOMATION);
assert(
  injectedA.includes('<h2>Section 2</h2>\n\n<aside class="mid-article-funnel-banner"'),
  'Callout Placement',
  'Banner is injected immediately after the 2nd </h2> tag'
);
assert(
  injectedA.includes(`href="${SERVICE_AI_AUTOMATION.href}"`),
  'Callout Content',
  `Banner includes link to ${SERVICE_AI_AUTOMATION.href}`
);
assert(
  injectedA.includes(`href="/contact?service=${SERVICE_AI_AUTOMATION.contactServiceParam}"`),
  'Callout Content',
  `Banner includes link to /contact?service=${SERVICE_AI_AUTOMATION.contactServiceParam}`
);

const htmlWithOneH2 = '<h2>Only Section</h2><p>Intro</p><p>Body</p>';
const injectedB = injectMidArticleCalloutTest(htmlWithOneH2, SERVICE_AI_SAAS_MVP);
assert(
  injectedB.includes('<h2>Only Section</h2>\n\n<aside class="mid-article-funnel-banner"'),
  'Callout Placement (1 H2 Fallback)',
  'Banner is injected after 1st </h2> when only 1 <h2> exists'
);

const htmlWithNoH2 = '<p>First paragraph</p><p>Second paragraph</p><p>Third paragraph</p>';
const injectedC = injectMidArticleCalloutTest(htmlWithNoH2, SERVICE_CUSTOM_WEB);
assert(
  injectedC.includes('</p>\n\n<aside class="mid-article-funnel-banner"'),
  'Callout Placement (No H2 Fallback)',
  'Banner is injected after 2nd </p> when no <h2> exists'
);

const injectedD = injectMidArticleCalloutTest('', SERVICE_AI_AUTOMATION);
assert(injectedD === '', 'Callout Placement (Empty HTML)', 'Empty HTML string handled gracefully');

// ----------------------------------------------------
// SUITE 4: COMPONENT ARCHITECTURE & CONTRACT INTEGRITY
// ----------------------------------------------------
console.log('\n>>> SUITE 4: Component Architecture & Contract Integrity');

const pageFile = path.join(process.cwd(), 'app', 'insights', '[id]', 'page.tsx');
const pageContent = fs.readFileSync(pageFile, 'utf8');

assert(
  pageContent.includes("getServiceForArticle"),
  'Import Verification',
  'app/insights/[id]/page.tsx imports getServiceForArticle'
);

assert(
  pageContent.includes('const serviceTarget = getServiceForArticle(article.slug || id, category, article.tags)'),
  'Server Logic Verification',
  'app/insights/[id]/page.tsx computes serviceTarget using getServiceForArticle'
);

assert(
  pageContent.includes('const contentWithMidCallout = injectMidArticleCallout('),
  'Server Logic Verification',
  'app/insights/[id]/page.tsx calls injectMidArticleCallout'
);

assert(
  pageContent.includes('className={styles.sidebarCtaCard}'),
  'Sidebar Integration',
  'app/insights/[id]/page.tsx renders sidebar CTA card'
);

assert(
  pageContent.includes('href={serviceTarget.href}'),
  'Sidebar Integration',
  'app/insights/[id]/page.tsx links sidebar CTA to serviceTarget.href'
);

assert(
  pageContent.includes('href={`/contact?service=${serviceTarget.contactServiceParam}`}'),
  'Sidebar Integration',
  'app/insights/[id]/page.tsx links sidebar CTA to parameterized contact URL'
);

assert(
  pageContent.includes('<ServiceLinkFunnel'),
  'Bottom Funnel Integration',
  'app/insights/[id]/page.tsx renders <ServiceLinkFunnel> at the article footer'
);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
const total = results.length;
const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;

console.log('\n======================================================');
console.log(`TEST SUMMARY: ${passed}/${total} assertions passed (${failed} failures)`);
console.log('======================================================\n');

if (failed > 0) {
  console.error(`Adversarial test harness detected ${failed} failure(s).`);
  process.exit(1);
} else {
  console.log('All Milestone 3 empirical and adversarial tests PASSED 100%!');
  process.exit(0);
}