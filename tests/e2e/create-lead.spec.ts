import { test, expect } from '@playwright/test';

test.describe('Lead Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Admin
    await page.goto('/internal/login');
    const quickLoginBtn = page.getByRole('button', { name: '⚡ Quick Login' });
    if (await quickLoginBtn.isVisible()) {
      await quickLoginBtn.click();
      await page.getByRole('button', { name: '👤 Admin' }).click();
      await page.waitForURL(/\/internal/);
    }
  });

  test('should create a new lead successfully', async ({ page }) => {
    // Navigate to Leads page
    await page.goto('/internal/leads');
    
    // Fill in the form
    await page.fill('input[name="name"]', 'Test Lead');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('textarea[name="message"]', 'This is a test lead created via Playwright.');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect to the lead detail page
    await expect(page).toHaveURL(/\/internal\/leads\/[a-z0-9-]+/);
    await expect(page.getByText('Test Lead')).toBeVisible();
    await expect(page.getByText('Test Company')).toBeVisible();
  });
});
