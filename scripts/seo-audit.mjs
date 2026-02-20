#!/usr/bin/env node
/**
 * SEO Audit Script for Megicode
 * Validates metadata, structured data, sitemaps, and canonical URLs.
 * Run: node scripts/seo-audit.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const SITE_URL = 'https://megicode.com';
const ROOT = process.cwd();
const issues = [];
const warnings = [];
const passes = [];

function log(type, msg) {
  if (type === 'error') issues.push(msg);
  else if (type === 'warn') warnings.push(msg);
  else passes.push(msg);
}

// ─── 1. Check required files exist ─────────────────────────
function checkRequiredFiles() {
  const required = [
    'public/robots.txt',
    'public/sitemap.xml',
    'public/favicon.ico',
    'public/favicon.svg',
    'public/meta/og-image.png',
    'public/meta/site.webmanifest',
    'public/meta/apple-touch-icon.png',
    'public/.well-known/security.txt',
    'next-sitemap.config.js',
  ];

  for (const file of required) {
    if (existsSync(join(ROOT, file))) {
      log('pass', `✅ ${file} exists`);
    } else {
      log('error', `❌ Missing required file: ${file}`);
    }
  }
}

// ─── 2. Validate robots.txt ────────────────────────────────
function checkRobots() {
  const robotsPath = join(ROOT, 'public/robots.txt');
  if (!existsSync(robotsPath)) return;

  const content = readFileSync(robotsPath, 'utf-8');

  if (content.includes('Sitemap:')) {
    log('pass', '✅ robots.txt contains Sitemap directive');
  } else {
    log('error', '❌ robots.txt missing Sitemap directive');
  }

  if (content.includes('Disallow: /internal/')) {
    log('pass', '✅ robots.txt blocks /internal/');
  } else {
    log('warn', '⚠️ robots.txt does not block /internal/');
  }

  if (content.includes('Disallow: /api/')) {
    log('pass', '✅ robots.txt blocks /api/');
  } else {
    log('warn', '⚠️ robots.txt does not block /api/');
  }
}

// ─── 3. Check sitemap.xml ──────────────────────────────────
function checkSitemap() {
  const sitemapPath = join(ROOT, 'public/sitemap.xml');
  if (!existsSync(sitemapPath)) return;

  const content = readFileSync(sitemapPath, 'utf-8');

  if (content.includes('<sitemapindex') || content.includes('<urlset')) {
    log('pass', '✅ sitemap.xml is valid XML structure');
  } else {
    log('error', '❌ sitemap.xml has invalid structure');
  }

  // Check sitemap-0.xml too
  const sitemap0 = join(ROOT, 'public/sitemap-0.xml');
  if (existsSync(sitemap0)) {
    const s0 = readFileSync(sitemap0, 'utf-8');
    const urlCount = (s0.match(/<url>/g) || []).length;
    log('pass', `✅ sitemap-0.xml contains ${urlCount} URLs`);

    // Check important pages are in sitemap
    const requiredUrls = ['/', '/about', '/services', '/projects', '/contact', '/reviews', '/careers'];
    for (const url of requiredUrls) {
      if (s0.includes(`<loc>${SITE_URL}${url}</loc>`) || s0.includes(`<loc>${SITE_URL}${url}/</loc>`)) {
        log('pass', `✅ ${url} found in sitemap`);
      } else {
        log('warn', `⚠️ ${url} NOT found in sitemap`);
      }
    }
  }
}

// ─── 4. Scan page metadata ─────────────────────────────────
function findPageFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      // Skip internal/megicode/api directories
      if (['internal', 'megicode', 'api', 'node_modules'].includes(entry)) continue;
      findPageFiles(fullPath, files);
    } else if (entry === 'page.tsx' || entry === 'page.ts') {
      files.push(fullPath);
    }
  }
  return files;
}

function checkPageMetadata() {
  const appDir = join(ROOT, 'app');
  const pages = findPageFiles(appDir);

  for (const page of pages) {
    const rel = relative(ROOT, page);
    const content = readFileSync(page, 'utf-8');
    const dir = join(page, '..');

    // Check if page has metadata (either directly, via layout, or via metadata.ts)
    const hasMetadataExport = content.includes('export const metadata') || content.includes('export async function generateMetadata');
    const hasLayoutMetadata = existsSync(join(dir, 'layout.tsx')) || existsSync(join(dir, 'metadata.ts'));

    if (hasMetadataExport || hasLayoutMetadata) {
      log('pass', `✅ ${rel} has metadata`);
    } else {
      log('warn', `⚠️ ${rel} may be missing page-specific metadata`);
    }

    // Check for "use client" pages that can't export metadata
    if (content.includes('"use client"') && !hasMetadataExport && !hasLayoutMetadata) {
      log('error', `❌ ${rel} is "use client" with no layout/metadata.ts for SEO`);
    }
  }
}

// ─── 5. Check JSON-LD structured data ──────────────────────
function checkStructuredData() {
  const layoutPath = join(ROOT, 'app/layout.tsx');
  if (!existsSync(layoutPath)) return;

  const content = readFileSync(layoutPath, 'utf-8');

  const schemas = ['Organization', 'WebSite', 'ProfessionalService', 'SiteNavigationElement'];
  for (const schema of schemas) {
    if (content.includes(`"@type": "${schema}"`)) {
      log('pass', `✅ Root layout has ${schema} JSON-LD`);
    } else {
      log('warn', `⚠️ Root layout missing ${schema} JSON-LD`);
    }
  }
}

// ─── 6. Validate web manifest ──────────────────────────────
function checkManifest() {
  const manifestPath = join(ROOT, 'public/meta/site.webmanifest');
  if (!existsSync(manifestPath)) return;

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    const required = ['name', 'short_name', 'icons', 'theme_color', 'background_color', 'display'];
    for (const key of required) {
      if (manifest[key]) {
        log('pass', `✅ Manifest has ${key}`);
      } else {
        log('warn', `⚠️ Manifest missing ${key}`);
      }
    }
  } catch {
    log('error', '❌ Manifest is not valid JSON');
  }
}

// ─── 7. Check OG image files ───────────────────────────────
function checkOGImages() {
  const ogImages = [
    'public/meta/og-image.png',
    'public/meta/twitter-card.png',
    'public/meta/services-og.png',
  ];

  for (const img of ogImages) {
    if (existsSync(join(ROOT, img))) {
      log('pass', `✅ ${img} exists`);
    } else {
      log('warn', `⚠️ ${img} missing (dynamic fallback may be in use)`);
    }
  }
}

// ─── Run All Checks ────────────────────────────────────────
console.log('\n🔍 Megicode SEO Audit\n' + '='.repeat(50) + '\n');

checkRequiredFiles();
checkRobots();
checkSitemap();
checkPageMetadata();
checkStructuredData();
checkManifest();
checkOGImages();

// ─── Report ────────────────────────────────────────────────
console.log('\n📊 Results\n' + '-'.repeat(50));
console.log(`\n✅ Passed: ${passes.length}`);
passes.forEach(p => console.log(`   ${p}`));

if (warnings.length > 0) {
  console.log(`\n⚠️  Warnings: ${warnings.length}`);
  warnings.forEach(w => console.log(`   ${w}`));
}

if (issues.length > 0) {
  console.log(`\n❌ Issues: ${issues.length}`);
  issues.forEach(i => console.log(`   ${i}`));
}

const score = Math.round((passes.length / (passes.length + issues.length + warnings.length * 0.5)) * 100);
console.log(`\n🏆 SEO Health Score: ${score}/100\n`);

process.exit(issues.length > 0 ? 1 : 0);
