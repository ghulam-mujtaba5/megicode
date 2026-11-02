import fs from 'fs';
import path from 'path';
import {
  canonicalUrl,
  founderPersonJsonLd,
  breadcrumbJsonLd,
  serviceJsonLd,
  faqJsonLd,
  professionalServiceJsonLd,
  reviewJsonLd,
  caseStudyJsonLd
} from '../lib/metadata';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

function expect(condition: boolean, suite: string, name: string, details?: any) {
  if (!condition) {
    results.push({ suite, name, passed: false, error: `Assertion failed: ${name}`, details });
    console.error(`❌ [${suite}] FAIL: ${name}`);
  } else {
    results.push({ suite, name, passed: true, details });
    console.log(`✅ [${suite}] PASS: ${name}`);
  }
}

console.log('======================================================================');
console.log('CHALLENGER EMPIRICAL VERIFICATION HARNESS — MILESTONE 1 SCHEMA GRAPH');
console.log('======================================================================\n');

// ─── SUITE 1: Metadata Generators & Schema Entity Contracts ─────────────────
const SUITE_1 = 'Generator Contracts';

// Canonical URLs
expect(canonicalUrl('/') === 'https://www.megicode.com', SUITE_1, 'Root canonicalUrl is https://www.megicode.com');
expect(canonicalUrl('/services/ai-automation-agents') === 'https://www.megicode.com/services/ai-automation-agents', SUITE_1, 'Service canonicalUrl is exact (no trailing slash)');
expect(canonicalUrl('/services/ai-automation-agents/') === 'https://www.megicode.com/services/ai-automation-agents', SUITE_1, 'Trailing slashes stripped');

// Organization & WebSite from app/layout.tsx
// Let's verify root layout source
const rootLayoutPath = path.join(__dirname, '../app/layout.tsx');
const rootLayoutCode = fs.readFileSync(rootLayoutPath, 'utf8');

expect(rootLayoutCode.includes("'@id': 'https://www.megicode.com#organization'"), SUITE_1, 'Root layout defines Organization @id: https://www.megicode.com#organization');
expect(rootLayoutCode.includes("'@id': 'https://www.megicode.com#website'"), SUITE_1, 'Root layout defines WebSite @id: https://www.megicode.com#website');
expect(rootLayoutCode.includes("'@id': 'https://www.megicode.com/about#founder'"), SUITE_1, 'Root layout Organization links founder @id: https://www.megicode.com/about#founder');
expect(rootLayoutCode.includes('professionalServiceJsonLd()'), SUITE_1, 'Root layout invokes professionalServiceJsonLd()');
expect(rootLayoutCode.includes("urlTemplate: 'https://www.megicode.com/insights?q={search_term_string}'"), SUITE_1, 'Root layout WebSite defines SearchAction URL template');
expect(rootLayoutCode.includes("'@type': 'SiteNavigationElement'"), SUITE_1, 'Root layout defines SiteNavigationElement ItemList');

// ProfessionalService Generator
const profService = professionalServiceJsonLd() as any;
expect(profService['@context'] === 'https://schema.org', SUITE_1, 'ProfessionalService @context valid');
expect(profService['@type'] === 'ProfessionalService', SUITE_1, 'ProfessionalService @type is ProfessionalService');
expect(profService['@id'] === 'https://www.megicode.com#professional-service', SUITE_1, 'ProfessionalService @id is https://www.megicode.com#professional-service');
expect(profService.founder?.['@id'] === 'https://www.megicode.com/about#founder', SUITE_1, 'ProfessionalService founder @id is https://www.megicode.com/about#founder');
expect(profService.parentOrganization?.['@id'] === 'https://www.megicode.com#organization', SUITE_1, 'ProfessionalService parentOrganization @id is https://www.megicode.com#organization');
expect(Array.isArray(profService.makesOffer) && profService.makesOffer.length === 3, SUITE_1, 'ProfessionalService makesOffer includes 3 core money pages');

// Founder Person Generator
const founder = founderPersonJsonLd() as any;
expect(founder['@context'] === 'https://schema.org', SUITE_1, 'Founder @context valid');
expect(founder['@type'] === 'Person', SUITE_1, 'Founder @type is Person');
expect(founder['@id'] === 'https://www.megicode.com/about#founder', SUITE_1, 'Founder @id is https://www.megicode.com/about#founder');
expect(founder.name === 'Ghulam Mujtaba', SUITE_1, 'Founder name is Ghulam Mujtaba');
expect(founder.worksFor?.['@id'] === 'https://www.megicode.com#organization', SUITE_1, 'Founder worksFor @id is https://www.megicode.com#organization');

// ─── SUITE 2: 9 Service Landing Pages Layout Verification ───────────────────
const SUITE_2 = '9 Service Detail Schemas';

const serviceRoutes = [
  { slug: 'ai-automation-agents', name: 'AI Automation for Businesses', path: '/services/ai-automation-agents' },
  { slug: 'ai-saas-mvp-development', name: 'AI-Powered Product Development', path: '/services/ai-saas-mvp-development' },
  { slug: 'custom-web-development', name: 'SaaS & Web Platform Development', path: '/services/custom-web-development' },
  { slug: 'cloud-devops', name: 'Cloud Infrastructure & DevOps', path: '/services/cloud-devops' },
  { slug: 'data-analytics', name: 'AI Integration & Data Intelligence', path: '/services/data-analytics' },
  { slug: 'growth-marketing-seo', name: 'Growth Marketing & SEO for Startups', path: '/services/growth-marketing-seo' },
  { slug: 'mobile-app-development', name: 'Mobile App Development', path: '/services/mobile-app-development' },
  { slug: 'technical-consulting', name: 'Technical Co-Founder as a Service', path: '/services/technical-consulting' },
  { slug: 'ui-ux-design', name: 'Product Design & UX Strategy', path: '/services/ui-ux-design' },
];

for (const s of serviceRoutes) {
  const layoutPath = path.join(__dirname, `../app/services/${s.slug}/layout.tsx`);
  const pagePath = path.join(__dirname, `../app/services/${s.slug}/page.tsx`);

  expect(fs.existsSync(layoutPath), SUITE_2, `Layout exists for ${s.slug}`);
  expect(fs.existsSync(pagePath), SUITE_2, `Page exists for ${s.slug}`);

  const layoutCode = fs.readFileSync(layoutPath, 'utf8');
  const pageCode = fs.readFileSync(pagePath, 'utf8');

  // Check layout schema calls
  expect(layoutCode.includes('breadcrumbJsonLd('), SUITE_2, `${s.slug} layout calls breadcrumbJsonLd`);
  expect(layoutCode.includes('serviceJsonLd('), SUITE_2, `${s.slug} layout calls serviceJsonLd`);
  expect(layoutCode.includes('faqJsonLd('), SUITE_2, `${s.slug} layout calls faqJsonLd`);

  // Verify offers & pricing in layout
  expect(layoutCode.includes('offers: ['), SUITE_2, `${s.slug} layout defines structured offers array`);
  expect(layoutCode.includes('price:'), SUITE_2, `${s.slug} layout defines price in offers`);
  expect(layoutCode.includes("priceCurrency: 'USD'"), SUITE_2, `${s.slug} layout defines priceCurrency USD`);
  expect(layoutCode.includes('deliveryTime:'), SUITE_2, `${s.slug} layout defines deliveryTime`);

  // Verify canonical URL and @id in layout
  expect(layoutCode.includes(`path: '${s.path}'`), SUITE_2, `${s.slug} layout passes correct path to serviceJsonLd`);

  // Adversarial Check: Ensure page.tsx does NOT render or import ServiceSchema
  expect(!pageCode.includes('ServiceSchema'), SUITE_2, `${s.slug} page.tsx contains NO ServiceSchema references`);
  expect(!pageCode.includes('import ServiceSchema'), SUITE_2, `${s.slug} page.tsx has NO ServiceSchema import`);
  expect(!pageCode.includes('<ServiceSchema'), SUITE_2, `${s.slug} page.tsx has NO <ServiceSchema /> tag`);
}

// ─── SUITE 3: Hub Isolation & Bleed Prevention ──────────────────────────────
const SUITE_3 = 'Layout Isolation';

const hubLayoutPath = path.join(__dirname, '../app/services/layout.tsx');
const hubLayoutCode = fs.readFileSync(hubLayoutPath, 'utf8');
expect(!hubLayoutCode.includes('breadcrumbJsonLd'), SUITE_3, 'app/services/layout.tsx does NOT emit breadcrumbJsonLd (passthrough only)');
expect(!hubLayoutCode.includes('serviceJsonLd'), SUITE_3, 'app/services/layout.tsx does NOT emit serviceJsonLd (passthrough only)');
expect(!hubLayoutCode.includes('services.map'), SUITE_3, 'app/services/layout.tsx does NOT map or emit services schema');

const hubPagePath = path.join(__dirname, '../app/services/page.tsx');
const hubPageCode = fs.readFileSync(hubPagePath, 'utf8');
expect(hubPageCode.includes('breadcrumbJsonLd'), SUITE_3, 'app/services/page.tsx correctly emits hub breadcrumb');
expect(hubPageCode.includes('serviceJsonLd'), SUITE_3, 'app/services/page.tsx correctly emits hub core services');

// ─── SUITE 4: About & Privacy Policy Schemas ────────────────────────────────
const SUITE_4 = 'About & Privacy-Policy';

const aboutLayoutPath = path.join(__dirname, '../app/about/layout.tsx');
const aboutLayoutCode = fs.readFileSync(aboutLayoutPath, 'utf8');
expect(aboutLayoutCode.includes('breadcrumbJsonLd'), SUITE_4, 'app/about/layout.tsx emits breadcrumbJsonLd');
expect(aboutLayoutCode.includes('founderPersonJsonLd'), SUITE_4, 'app/about/layout.tsx emits founderPersonJsonLd');

const privacyLayoutPath = path.join(__dirname, '../app/privacy-policy/layout.tsx');
const privacyLayoutCode = fs.readFileSync(privacyLayoutPath, 'utf8');
expect(privacyLayoutCode.includes('breadcrumbJsonLd'), SUITE_4, 'app/privacy-policy/layout.tsx emits breadcrumbJsonLd');
expect(privacyLayoutCode.includes('title: \'Privacy Policy — Megicode Data Protection & Privacy Terms\''), SUITE_4, 'app/privacy-policy/layout.tsx has optimized title');

// ─── SUITE 5: Global Codebase ServiceSchema Grep ────────────────────────────
const SUITE_5 = 'Codebase Hygiene';

function searchDirectory(dir: string, needle: string): string[] {
  const matches: string[] = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (f.name !== 'node_modules' && f.name !== '.next' && f.name !== '.git' && f.name !== '.agents') {
        matches.push(...searchDirectory(fullPath, needle));
      }
    } else if (f.name.endsWith('.tsx') || f.name.endsWith('.ts')) {
      if (f.name !== 'ServiceSchema.tsx') {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(needle)) {
          matches.push(fullPath);
        }
      }
    }
  }
  return matches;
}

const lingeringServiceSchemaMatches = searchDirectory(path.join(__dirname, '../app'), 'ServiceSchema');
expect(lingeringServiceSchemaMatches.length === 0, SUITE_5, `0 lingering ServiceSchema in app/ (found: ${lingeringServiceSchemaMatches.length})`, lingeringServiceSchemaMatches);

// ─── SUITE 6: Schema Graph Runtime Output Simulation ────────────────────────
const SUITE_6 = 'Runtime Schema Simulation';

for (const s of serviceRoutes) {
  const serviceObj = serviceJsonLd({
    name: s.name,
    description: 'Test description',
    path: s.path,
    offers: [
      { name: 'Tier 1', description: 'Tier 1 desc', price: '1000', priceCurrency: 'USD', deliveryTime: '2 weeks' }
    ]
  }) as any;

  const breadcrumbObj = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: s.name, path: s.path }
  ]) as any;

  const faqObj = faqJsonLd([
    { q: 'Question 1', a: 'Answer 1' }
  ]) as any;

  // Verify @id uniqueness
  const expectedServiceId = `https://www.megicode.com${s.path}#service`;
  expect(serviceObj['@id'] === expectedServiceId, SUITE_6, `${s.slug} Service @id is ${expectedServiceId}`);
  expect(serviceObj.provider?.['@id'] === 'https://www.megicode.com#organization', SUITE_6, `${s.slug} provider links to https://www.megicode.com#organization`);
  expect(serviceObj.hasOfferCatalog?.itemListElement?.[0]?.seller?.['@id'] === 'https://www.megicode.com#organization', SUITE_6, `${s.slug} offer seller links to #organization`);
  expect(breadcrumbObj['@type'] === 'BreadcrumbList' && breadcrumbObj.itemListElement.length === 3, SUITE_6, `${s.slug} breadcrumb has 3 levels`);
  expect(faqObj['@type'] === 'FAQPage' && faqObj.mainEntity.length === 1, SUITE_6, `${s.slug} faq mainEntity valid`);
}

// ─── Final Summary ──────────────────────────────────────────────────────────
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

console.log('\n======================================================================');
console.log(`CHALLENGER HARNESS VERIFICATION SUMMARY`);
console.log(`Total Checks: ${results.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log('======================================================================\n');

if (failed > 0) {
  console.error('FAILURES DETECTED:');
  results.filter(r => !r.passed).forEach(r => console.error(` - [${r.suite}] ${r.name}: ${r.error}`));
  process.exit(1);
} else {
  console.log('ALL ADVERSARIAL SCHEMA TESTS PASSED SUCCESSFULLY (0 DEFECTS DETECTED).');
  process.exit(0);
}
