/*
 * Capture full Playwright trace for the running app.
 *
 * Usage:
 * 1. Install Playwright: `npm i -D playwright`
 * 2. Install browsers: `npx playwright install chromium`
 * 3. Run app locally: `npm run dev`
 * 4. Run this script: `npx ts-node scripts/capture-devtools-trace.ts`
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

export {};

async function run() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const outDir = path.join(process.cwd(), 'traces');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const tracePath = path.join(outDir, `trace-${timestamp}.zip`);

  console.log(`Starting Chromium and recording trace for ${baseUrl}...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Start tracing with full data: screenshots, snapshots, and sources
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  const page = await context.newPage();
  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    // Basic interactions to exercise navigation
    await page.waitForTimeout(1000);
    // Try opening main nav if exists
    try {
      await page.click('button[aria-label="Open navigation"]', { timeout: 2000 });
    } catch (e) {
      // ignore if not present
    }
    // Wait for a bit to capture network and console
    await page.waitForTimeout(3000);

    // Stop tracing and save to file
    await context.tracing.stop({ path: tracePath });
    console.log(`Trace saved to ${tracePath}`);
  } catch (err) {
    console.error('Error during trace capture:', err);
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
