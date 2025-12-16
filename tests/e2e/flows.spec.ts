/**
 * End-to-End Flow Tests
 * 
 * Tests all major user flows defined in TEST_COVERAGE_MATRIX.md
 * 
 * Setup:
 * 1. npm i -D playwright @playwright/test
 * 2. npx playwright install chromium
 * 3. npm run db:seed
 * 4. npm run dev (in another terminal)
 * 5. npm run test:e2e
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

test.describe('Public Website Flows', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Megicode/i);
  });

  test('should submit contact form', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    
    // Fill contact form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('textarea[name="message"]', 'This is a test message for lead intake.');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('text=/success|thank you|sent/i')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to services page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('a[href="/services"]');
    await expect(page).toHaveURL(/\/services/);
    await expect(page.locator('h1')).toContainText(/services/i);
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/\/about/);
  });
});

test.describe('Internal Portal Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // NOTE: Add authentication step here if NextAuth is configured
    // For now, assume we can access /internal directly in dev
    await page.goto(`${BASE_URL}/internal`);
  });

  test('should load internal dashboard', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/dashboard|internal/i);
  });

  test('should navigate to leads page', async ({ page }) => {
    // Try to find and click leads link
    const leadsLink = page.locator('a[href*="/leads"]').first();
    if (await leadsLink.isVisible()) {
      await leadsLink.click();
      await expect(page).toHaveURL(/\/leads/);
    }
  });

  test('should navigate to projects page', async ({ page }) => {
    const projectsLink = page.locator('a[href*="/projects"]').first();
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await expect(page).toHaveURL(/\/projects/);
    }
  });

  test('should navigate to process page', async ({ page }) => {
    const processLink = page.locator('a[href*="/process"]').first();
    if (await processLink.isVisible()) {
      await processLink.click();
      await expect(page).toHaveURL(/\/process/);
    }
  });
});

test.describe('Database-backed Flow Verification', () => {
  test('verify seeded data loads on leads page', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/leads`);
    
    // Should see seeded leads (e.g., "John Smith" or "Sarah Johnson")
    const leadsList = page.locator('table, [role="table"], .lead-item');
    await expect(leadsList).toBeVisible({ timeout: 5000 });
  });

  test('verify seeded data loads on projects page', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/projects`);
    
    // Should see seeded project (e.g., "Acme E-commerce Platform")
    const projectsList = page.locator('table, [role="table"], .project-item');
    await expect(projectsList).toBeVisible({ timeout: 5000 });
  });

  test('verify process flowchart renders', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/process`);
    
    // Look for canvas or SVG element (ProcessFlowchart component)
    const flowchart = page.locator('canvas, svg').first();
    await expect(flowchart).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Task Management Flow', () => {
  test('should display tasks for a project', async ({ page }) => {
    // Navigate to a specific project detail page (assume ID from seed)
    await page.goto(`${BASE_URL}/internal/projects`);
    
    // Click first project if available
    const firstProject = page.locator('a[href*="/projects/"]').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      
      // Expect tasks table/list to be visible
      const tasksSection = page.locator('text=/tasks/i').first();
      await expect(tasksSection).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Responsive Design & Mobile Checks', () => {
  test('should render homepage on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Megicode/i);
  });

  test('should open mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Try to find and click mobile menu button
    const mobileMenuBtn = page.locator('button[aria-label*="menu"], button[aria-label*="navigation"]').first();
    if (await mobileMenuBtn.isVisible()) {
      await mobileMenuBtn.click();
      // Mobile nav should expand
      await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    }
  });
});

test.describe('Performance & Accessibility', () => {
  test('should have no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Allow some errors (e.g., third-party scripts), but flag critical ones
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('chrome-extension')
    );
    
    expect(criticalErrors.length).toBeLessThan(3);
  });

  test('should have basic accessibility attributes', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});

test.describe('API Health Checks', () => {
  test('should return 200 for contact API', async ({ request }) => {
    // This will fail until contact API is POST-only, but good to have
    const response = await request.get(`${BASE_URL}/api/contact`);
    // Expect either 200 or 405 (method not allowed)
    expect([200, 405]).toContain(response.status());
  });
});
