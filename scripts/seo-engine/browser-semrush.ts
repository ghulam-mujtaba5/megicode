import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function main() {
  const screenshotDir = path.join(process.cwd(), 'scripts', 'seo-engine', 'screenshots');
  const reportDir = path.join(process.cwd(), 'scripts', 'seo-engine', 'reports');

  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

  const loginUrl = 'https://app.primeedutools.com/login';
  const username = 'CampusAxis';
  const password = 'PLSc98pGf22Q.Db';

  console.log(`🚀 Launching Playwright browser for Semrush access...`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : undefined;
  const uniqueUserDataDir = path.join(
    process.env.TEMP || 'C:\\Temp',
    `playwright_semrush_${Date.now()}`
  );

  const context = await chromium.launchPersistentContext(uniqueUserDataDir, {
    headless: false,
    executablePath,
    viewport: { width: 1440, height: 900 },
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    console.log(`1. Navigating to login: ${loginUrl}...`);
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const loginInput = page.locator('input[name="amember_login"]');
    if (await loginInput.isVisible()) {
      console.log('2. Filling in login credentials...');
      await loginInput.fill(username);
      await page.locator('input[name="amember_pass"]').fill(password);
      await page.waitForTimeout(500);

      console.log('3. Submitting login form...');
      await Promise.all([
        page.waitForNavigation({ timeout: 30000 }).catch(() => {}),
        page.locator('button[type="submit"], input[type="submit"]').first().click(),
      ]);
      await page.waitForTimeout(3000);
    }

    console.log(`4. Logged in. Navigating directly to cloud gateway: https://app.primeedutools.com/cloud/semrush/access.php...`);
    await page.goto('https://app.primeedutools.com/cloud/semrush/access.php', {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });
    await page.waitForTimeout(8000);

    console.log(`5. Cloud Gateway landed on: ${page.url()}`);
    console.log(`   Page Title: ${await page.title()}`);

    await page.screenshot({
      path: path.join(screenshotDir, 'semrush-cloud-entry.png'),
      fullPage: true,
    });

    const currentOrigin = new URL(page.url()).origin;
    console.log(`   Active Semrush Host: ${currentOrigin}`);

    // Target keywords to research
    const targetKeywords = [
      'AI automation company',
      'AI automation agency',
      'SaaS MVP development company',
      'custom software development company',
      'AI agents for business',
      'business process automation',
    ];

    interface ExtractedKeywordReport {
      keyword: string;
      title: string;
      url: string;
      screenshot: string;
      metricsPreview: string;
    }

    const keywordReports: ExtractedKeywordReport[] = [];

    for (const kw of targetKeywords) {
      console.log(`\n🔍 [Semrush Keyword Overview] Analyzing: "${kw}"...`);
      const targetUrl = `${currentOrigin}/analytics/keywordoverview/?q=${encodeURIComponent(kw)}&db=us`;
      
      try {
        console.log(`   Navigating to: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(6000);

        const pageTitle = await page.title();
        const pageScreenshot = path.join(
          screenshotDir,
          `semrush-${kw.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`
        );
        await page.screenshot({ path: pageScreenshot, fullPage: false });

        const bodyText = await page.locator('body').innerText();
        const cleanLines = bodyText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

        console.log(`   Title: ${pageTitle}`);
        console.log(`   Captured: ${pageScreenshot}`);

        keywordReports.push({
          keyword: kw,
          title: pageTitle,
          url: page.url(),
          screenshot: pageScreenshot,
          metricsPreview: cleanLines.slice(0, 30).join(' | '),
        });
      } catch (err: unknown) {
        console.error(`   Error analyzing "${kw}":`, err instanceof Error ? err.message : String(err));
      }
    }

    // Domain Overview for megicode.com
    console.log(`\n🌐 [Semrush Domain Overview] Analyzing megicode.com...`);
    const domainUrl = `${currentOrigin}/analytics/overview/?q=megicode.com&searchType=domain`;
    try {
      await page.goto(domainUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(6000);

      const domainTitle = await page.title();
      const domainScreenshot = path.join(screenshotDir, 'semrush-domain-overview-megicode.png');
      await page.screenshot({ path: domainScreenshot, fullPage: false });
      console.log(`   Domain Overview Title: ${domainTitle}`);
      console.log(`   Captured: ${domainScreenshot}`);
    } catch (err: unknown) {
      console.error('   Error checking domain overview:', err instanceof Error ? err.message : String(err));
    }

    fs.writeFileSync(
      path.join(reportDir, 'semrush-live-extracted.json'),
      JSON.stringify(keywordReports, null, 2),
      'utf-8'
    );
    console.log(`\n🎉 Live Semrush Pro data collection finished! Saved to scripts/seo-engine/reports/semrush-live-extracted.json`);
  } catch (err: unknown) {
    console.error('Fatal error during Semrush extraction:', err instanceof Error ? err.message : String(err));
  } finally {
    await page.waitForTimeout(4000);
    await context.close();
  }
}

main().catch(console.error);
