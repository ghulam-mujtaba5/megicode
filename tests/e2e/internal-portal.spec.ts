import { test, expect } from '@playwright/test';

test.describe('Internal Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto('/internal/login', { waitUntil: 'domcontentloaded' });
  });

  test('should allow admin login via Quick Login', async ({ page }) => {
    // Click Quick Login toggle
    const quickLoginBtn = page.getByRole('button', { name: '⚡ Quick Login' });
    await quickLoginBtn.waitFor({ state: 'visible', timeout: 15000 });
    await quickLoginBtn.click();
    
    // Click Admin login - wait for it to be visible
    const adminBtn = page.getByRole('button', { name: '👤 Admin' });
    await adminBtn.waitFor({ state: 'visible', timeout: 10000 });
    await adminBtn.click();
    
    // Should redirect to dashboard
    await page.waitForURL(/\/internal/, { timeout: 15000 });
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('should navigate to Process Showcase', async ({ page }) => {
    // Login first
    const quickLoginBtn = page.getByRole('button', { name: '⚡ Quick Login' });
    await quickLoginBtn.waitFor({ state: 'visible', timeout: 15000 });
    await quickLoginBtn.click();
    
    const adminBtn = page.getByRole('button', { name: '👤 Admin' });
    await adminBtn.waitFor({ state: 'visible', timeout: 10000 });
    await adminBtn.click();
    
    await page.waitForURL(/\/internal/, { timeout: 15000 });

    // Navigate to Process Showcase
    const projectsLink = page.getByRole('button', { name: 'Projects' });
    await projectsLink.waitFor({ state: 'visible', timeout: 10000 });
    await projectsLink.click();

    // Click Workflow Showcase
    const showcaseLink = page.getByRole('link', { name: 'Workflow Showcase' });
    await showcaseLink.waitFor({ state: 'visible', timeout: 10000 });
    await showcaseLink.click();
    
    await page.waitForURL(/\/internal\/process\/showcase/, { timeout: 15000 });
    await expect(page.getByText('Interactive Flowchart')).toBeVisible();
  });

  test('should navigate to Analytics', async ({ page }) => {
    // Login first
    const quickLoginBtn = page.getByRole('button', { name: '⚡ Quick Login' });
    await quickLoginBtn.waitFor({ state: 'visible', timeout: 15000 });
    await quickLoginBtn.click();
    
    const adminBtn = page.getByRole('button', { name: '👤 Admin' });
    await adminBtn.waitFor({ state: 'visible', timeout: 10000 });
    await adminBtn.click();
    
    await page.waitForURL(/\/internal/, { timeout: 15000 });

    // Navigate to Analytics
    const projectsLink = page.getByRole('button', { name: 'Projects' });
    await projectsLink.waitFor({ state: 'visible', timeout: 10000 });
    await projectsLink.click();

    const analyticsLink = page.getByRole('link', { name: 'Analytics' });
    await analyticsLink.waitFor({ state: 'visible', timeout: 10000 });
    await analyticsLink.click();
    
    await page.waitForURL(/\/internal\/process\/analytics/, { timeout: 15000 });
    await expect(page.getByText('Process Analytics')).toBeVisible();
  });
});
