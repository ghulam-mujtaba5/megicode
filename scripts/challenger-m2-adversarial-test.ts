import * as fs from 'fs';
import * as path from 'path';
import servicePageCopy, { defaultComparisonMetrics } from '../app/services/servicePageCopy';

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
    console.log(`  ✅ [PASS] ${suite} -> ${name}`);
  } else {
    results.push({ suite, name, passed: false, details, error: 'Assertion failed' });
    console.error(`  ❌ [FAIL] ${suite} -> ${name}`, details || '');
  }
}

const REQUIRED_SERVICE_SLUGS = [
  'ai-automation-agents',
  'ai-saas-mvp-development',
  'custom-web-development',
  'ui-ux-design',
  'cloud-devops',
  'mobile-app-development',
  'data-analytics',
  'growth-marketing-seo',
  'technical-consulting',
];

console.log('\n======================================================');
console.log('CHALLENGER MILESTONE 2 EMPIRICAL & ADVERSARIAL TEST HARNESS');
console.log('======================================================\n');

// ----------------------------------------------------
// SUITE 1: 40-60 WORD DEFINITION CAPSULES EMPIRICAL VERIFICATION
// ----------------------------------------------------
console.log('>>> SUITE 1: Definition Block & Answer Capsule Word Counts (40-60 Words)');
for (const slug of REQUIRED_SERVICE_SLUGS) {
  const copy = (servicePageCopy as any)[slug];
  assert(!!copy, 'Definition Capsule', `Service copy exists for "${slug}"`);
  if (!copy) continue;

  // Check definitionBlock
  const defBlock = copy.definitionBlock;
  assert(typeof defBlock === 'string' && defBlock.trim().length > 0, 'Definition Capsule', `definitionBlock present for "${slug}"`);

  // Calculate word count
  const wordsDefBlock = defBlock.trim().split(/\s+/);
  const countDefBlock = wordsDefBlock.length;
  const inRangeDefBlock = countDefBlock >= 40 && countDefBlock <= 60;

  assert(
    inRangeDefBlock,
    'Definition Capsule',
    `Word count for definitionBlock on "${slug}" is between 40-60 words (Actual: ${countDefBlock} words)`,
    { slug, count: countDefBlock, text: defBlock }
  );

  // Check answerCapsule structure
  const ac = copy.answerCapsule;
  assert(!!ac, 'Answer Capsule Structure', `answerCapsule object present for "${slug}"`);
  if (ac) {
    const wordsAcDef = ac.definition?.trim().split(/\s+/) || [];
    const countAcDef = wordsAcDef.length;
    const inRangeAcDef = countAcDef >= 40 && countAcDef <= 60;

    assert(
      inRangeAcDef,
      'Answer Capsule Structure',
      `Word count for answerCapsule.definition on "${slug}" is between 40-60 words (Actual: ${countAcDef} words)`,
      { slug, count: countAcDef }
    );

    assert(typeof ac.targetAudience === 'string' && ac.targetAudience.trim().length > 0, 'Answer Capsule Structure', `targetAudience defined for "${slug}"`);
    assert(typeof ac.deliveryScope === 'string' && ac.deliveryScope.trim().length > 0, 'Answer Capsule Structure', `deliveryScope defined for "${slug}"`);
    assert(typeof ac.roiBenchmark === 'string' && ac.roiBenchmark.trim().length > 0, 'Answer Capsule Structure', `roiBenchmark defined for "${slug}"`);
    assert(typeof ac.turnaround === 'string' && ac.turnaround.trim().length > 0, 'Answer Capsule Structure', `turnaround defined for "${slug}"`);
    assert(typeof ac.ownership === 'string' && ac.ownership.trim().length > 0, 'Answer Capsule Structure', `ownership defined for "${slug}"`);

    // Adversarial: Check for placeholder / dummy text
    const hasForbidden = /lorem|ipsum|todo|placeholder|dummy|xxx/i.test(
      `${defBlock} ${ac.targetAudience} ${ac.deliveryScope} ${ac.roiBenchmark} ${ac.turnaround} ${ac.ownership}`
    );
    assert(!hasForbidden, 'Answer Capsule Quality', `No placeholder/dummy text found for "${slug}"`);
  }
}

// ----------------------------------------------------
// SUITE 2: PRICING & TIMELINE BENCHMARKS
// ----------------------------------------------------
console.log('\n>>> SUITE 2: Pricing & Timeline Benchmarks ($400 - $12,000+ USD)');
const allPrices: number[] = [];

for (const slug of REQUIRED_SERVICE_SLUGS) {
  const copy = (servicePageCopy as any)[slug];
  if (!copy) continue;

  const tiers = copy.pricingTiers;
  assert(Array.isArray(tiers) && tiers.length >= 3, 'Pricing Benchmarks', `Has at least 3 pricing tiers for "${slug}" (Found: ${tiers?.length})`);

  let popularCount = 0;
  tiers.forEach((tier: any, index: number) => {
    assert(typeof tier.name === 'string' && tier.name.length > 0, 'Pricing Benchmarks', `Tier ${index + 1} has valid name for "${slug}"`);
    assert(typeof tier.price === 'string' && tier.price.startsWith('$'), 'Pricing Benchmarks', `Tier ${index + 1} has valid USD price string "${tier.price}" for "${slug}"`);
    assert(typeof tier.timeline === 'string' && tier.timeline.length > 0, 'Pricing Benchmarks', `Tier ${index + 1} has timeline "${tier.timeline}" for "${slug}"`);
    assert(typeof tier.description === 'string' && tier.description.length > 0, 'Pricing Benchmarks', `Tier ${index + 1} has description for "${slug}"`);
    assert(Array.isArray(tier.deliverables) && tier.deliverables.length >= 3, 'Pricing Benchmarks', `Tier ${index + 1} has >= 3 deliverables for "${slug}" (Found: ${tier.deliverables?.length})`);

    // Parse numeric price
    const numPrice = parseInt(tier.price.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numPrice)) {
      allPrices.push(numPrice);
    }

    if (tier.isPopular) popularCount++;
  });

  assert(popularCount >= 1, 'Pricing Benchmarks', `At least one popular tier designated for "${slug}" (Found: ${popularCount})`);
}

const minPrice = Math.min(...allPrices);
const maxPrice = Math.max(...allPrices);
console.log(`\nOverall Price Spectrum: Min = $${minPrice}, Max = $${maxPrice}`);
assert(minPrice <= 800, 'Pricing Benchmarks Range', `Min price covers entry sidetasks ($400-$800, actual: $${minPrice})`);
assert(maxPrice >= 5000, 'Pricing Benchmarks Range', `Max price covers high-ticket enterprise builds ($5,000+, actual: $${maxPrice})`);

// ----------------------------------------------------
// SUITE 3: STRUCTURED COMPARISON MATRICES
// ----------------------------------------------------
console.log('\n>>> SUITE 3: Structured 6-Dimension Comparison Matrix');
for (const slug of REQUIRED_SERVICE_SLUGS) {
  const copy = (servicePageCopy as any)[slug];
  if (!copy) continue;

  const metrics = copy.comparisonMetrics || defaultComparisonMetrics;
  assert(Array.isArray(metrics) && metrics.length >= 6, 'Comparison Matrix', `Matrix has at least 6 evaluation dimensions for "${slug}" (Found: ${metrics?.length})`);

  metrics.forEach((row: any, i: number) => {
    assert(typeof row.dimension === 'string' && row.dimension.length > 0, 'Comparison Matrix', `Row ${i + 1} dimension is non-empty for "${slug}"`);
    assert(typeof row.megicode === 'string' && row.megicode.length > 0, 'Comparison Matrix', `Row ${i + 1} megicode value is non-empty for "${slug}"`);
    assert(typeof row.agency === 'string' && row.agency.length > 0, 'Comparison Matrix', `Row ${i + 1} agency value is non-empty for "${slug}"`);
    assert(typeof row.freelancer === 'string' && row.freelancer.length > 0, 'Comparison Matrix', `Row ${i + 1} freelancer value is non-empty for "${slug}"`);
    assert(typeof row.inHouse === 'string' && row.inHouse.length > 0, 'Comparison Matrix', `Row ${i + 1} inHouse value is non-empty for "${slug}"`);
  });
}

// ----------------------------------------------------
// SUITE 4: ALL 9 SERVICE PAGE FILES RENDER GEO COMPONENTS
// ----------------------------------------------------
console.log('\n>>> SUITE 4: Service Landing Page Files Integration');
const servicesDir = path.join(process.cwd(), 'app', 'services');

for (const slug of REQUIRED_SERVICE_SLUGS) {
  const pagePath = path.join(servicesDir, slug, 'page.tsx');
  const fileExists = fs.existsSync(pagePath);
  assert(fileExists, 'Page File Exists', `page.tsx exists for "${slug}"`);
  if (!fileExists) continue;

  const content = fs.readFileSync(pagePath, 'utf8');

  // Check imports
  const importsAnswerCapsule = content.includes('ServiceAnswerCapsule');
  const importsPricing = content.includes('ServicePricingBenchmarks');
  const importsComparison = content.includes('ServiceComparisonMatrix');

  assert(importsAnswerCapsule, 'Component Import', `ServiceAnswerCapsule imported in "${slug}/page.tsx"`);
  assert(importsPricing, 'Component Import', `ServicePricingBenchmarks imported in "${slug}/page.tsx"`);
  assert(importsComparison, 'Component Import', `ServiceComparisonMatrix imported in "${slug}/page.tsx"`);

  // Check rendering in JSX
  const rendersAnswerCapsule = /<ServiceAnswerCapsule\b[^>]*\/>|<ServiceAnswerCapsule\b[^>]*>[\s\S]*?<\/ServiceAnswerCapsule>/.test(content);
  const rendersPricing = /<ServicePricingBenchmarks\b[^>]*\/>|<ServicePricingBenchmarks\b[^>]*>[\s\S]*?<\/ServicePricingBenchmarks>/.test(content);
  const rendersComparison = /<ServiceComparisonMatrix\b[^>]*\/>|<ServiceComparisonMatrix\b[^>]*>[\s\S]*?<\/ServiceComparisonMatrix>/.test(content);

  assert(rendersAnswerCapsule, 'JSX Rendering', `<ServiceAnswerCapsule> rendered in "${slug}/page.tsx"`);
  assert(rendersPricing, 'JSX Rendering', `<ServicePricingBenchmarks> rendered in "${slug}/page.tsx"`);
  assert(rendersComparison, 'JSX Rendering', `<ServiceComparisonMatrix> rendered in "${slug}/page.tsx"`);

  // Check props passed
  const capsulePassesSlug = content.includes(`slug="${slug}"`) || content.includes(`copy={serviceCopy}`);
  const pricingPassesSlug = content.includes(`slug="${slug}"`);
  const pricingPassesCta = content.includes('onConsultationClick={openCalendly}');
  const comparisonPassesSlug = content.includes(`slug="${slug}"`);

  assert(capsulePassesSlug, 'Props Verification', `ServiceAnswerCapsule receives slug/copy in "${slug}/page.tsx"`);
  assert(pricingPassesSlug, 'Props Verification', `ServicePricingBenchmarks receives slug in "${slug}/page.tsx"`);
  assert(pricingPassesCta, 'Props Verification', `ServicePricingBenchmarks connects consultation handler in "${slug}/page.tsx"`);
  assert(comparisonPassesSlug, 'Props Verification', `ServiceComparisonMatrix receives slug in "${slug}/page.tsx"`);
}

// ----------------------------------------------------
// SUITE 5: COMPONENT BEHAVIOR & ROBUSTNESS TESTS
// ----------------------------------------------------
console.log('\n>>> SUITE 5: Adversarial Fallbacks & Schema Annotations in ServiceDetailSections');
const detailSectionsPath = path.join(servicesDir, 'ServiceDetailSections.tsx');
const detailSectionsContent = fs.readFileSync(detailSectionsPath, 'utf8');

// Check schema.org microdata in ServiceAnswerCapsule
assert(detailSectionsContent.includes('itemScope'), 'Schema Microdata', 'ServiceAnswerCapsule includes itemScope attribute');
assert(detailSectionsContent.includes('itemType="https://schema.org/Service"'), 'Schema Microdata', 'ServiceAnswerCapsule includes https://schema.org/Service');
assert(detailSectionsContent.includes('itemProp="description"'), 'Schema Microdata', 'ServiceAnswerCapsule annotates description with itemProp="description"');

// Check consultation click fallback in ServicePricingBenchmarks
assert(detailSectionsContent.includes('onConsultationClick()'), 'Interactive Handler', 'ServicePricingBenchmarks calls onConsultationClick callback if provided');
assert(detailSectionsContent.includes('/contact?service='), 'Interactive Handler', 'ServicePricingBenchmarks falls back to /contact?service= when callback omitted');
assert(detailSectionsContent.includes('e.stopPropagation()'), 'Interactive Handler', 'ServicePricingBenchmarks stops event propagation on CTA click');

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
  console.error(`💥 Adversarial test harness detected ${failed} failure(s).`);
  process.exit(1);
} else {
  console.log('🎯 All Milestone 2 empirical and adversarial tests PASSED 100%!');
  process.exit(0);
}
