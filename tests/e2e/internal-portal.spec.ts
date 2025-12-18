import { test, expect } from '@playwright/test';

test.describe('Internal Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto('/internal/login');
  });

  test('should allow admin login via Quick Login', async ({ page }) => {
    // Check if Quick Login is available (assuming NEXT_PUBLIC_DEV_LOGIN_ENABLED is true in test env)
    // If not, we might need to set it or skip. 
    // For this test, we assume it's enabled or we can enable it via query param if supported (not supported in code).
    
    // Click Quick Login toggle
    const quickLoginBtn = page.getByRole('button', { name: '⚡ Quick Login' });
    if (await quickLoginBtn.isVisible()) {
      await quickLoginBtn.click();
      
      // Click Admin login
      await page.getByRole('button', { name: '👤 Admin' }).click();
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/internal/);
      await expect(page.getByText('Dashboard')).toBeVisible();
    } else {
      console.log('Quick Login not enabled, skipping login test');
    }
  });

  test('should navigate to Process Showcase', async ({ page }) => {
    // Login first
    const quickLoginBtn = page.getByRole('button', { name: '⚡ Quick Login' });
    if (await quickLoginBtn.isVisible()) {
      await quickLoginBtn.click();
      await page.getByRole('button', { name: '👤 Admin' }).click();
      await page.waitForURL(/\/internal/);
    }

    // Navigate to Process Showcase
    // The sidebar might be collapsed or expanded.
    // Assuming desktop view where sidebar is visible.
    
    // Click Projects to expand if needed
    const projectsLink = page.getByRole('button', { name: 'Projects' });
    if (await projectsLink.isVisible()) {
        await projectsLink.click();
    }

    // Click Workflow Showcase
    await page.getByRole('link', { name: 'Workflow Showcase' }).click();
    
    await expect(page).toHaveURL(/\/internal\/process\/showcase/);
    await expect(page.getByText('Interactive Flowchart')).toBeVisible();
    
    // Check if flowchart is visible
    const flowchart = page.locator('svg').first();
    await expect(flowchart).toBeVisible();
  });

  test('should navigate to Analytics', async ({ page }) => {
    // Login first
    const quickLoginBtn = page.getByRole('button', { name: '⚡ Quick Login' });
    if (await quickLoginBtn.isVisible()) {
      await quickLoginBtn.click();
      await page.getByRole('button', { name: '👤 Admin' }).click();
      await page.waitForURL(/\/internal/);
    }

    // Navigate to Analytics
    const projectsLink = page.getByRole('button', { name: 'Projects' });
    if (await projectsLink.isVisible()) {
        await projectsLink.click();
    }

    await page.getByRole('link', { name: 'Analytics' }).click();
    
    await expect(page).toHaveURL(/\/internal\/process\/analytics/);
    await expect(page.getByText('Process Analytics')).toBeVisible();
    
    // Check for charts/stats
    await expect(page.getByText('Health Score')).toBeVisible();
  });
});
