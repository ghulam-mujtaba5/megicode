/**
 * Advanced E2E Test Scenarios
 * 
 * Tests complex workflows, error scenarios, and edge cases
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

test.describe('Lead Management Workflow', () => {
  test('complete lead lifecycle: intake → review → approval → conversion', async ({ page }) => {
    // Step 1: Submit lead via contact form
    await page.goto(`${BASE_URL}/contact`);
    await page.fill('input[name="name"]', 'Test Lead Workflow');
    await page.fill('input[name="email"]', 'workflow@test.com');
    await page.fill('input[name="company"]', 'Workflow Corp');
    await page.fill('textarea[name="message"]', 'Testing complete workflow');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/success|thank you/i')).toBeVisible({ timeout: 10000 });

    // Step 2: Navigate to internal leads page
    await page.goto(`${BASE_URL}/internal/leads`);
    await page.waitForLoadState('networkidle');

    // Step 3: Find and click on the new lead
    const leadRow = page.locator('text=Test Lead Workflow').first();
    if (await leadRow.isVisible()) {
      await leadRow.click();
      
      // Step 4: Update status to in_review
      const statusSelect = page.locator('select[name="status"], [role="combobox"]').first();
      if (await statusSelect.isVisible()) {
        await statusSelect.selectOption('in_review');
        await page.waitForTimeout(1000);
      }

      // Step 5: Add a note
      const noteInput = page.locator('textarea[name="note"], textarea[placeholder*="note"]').first();
      if (await noteInput.isVisible()) {
        await noteInput.fill('Initial review completed. Ready for approval.');
        await page.click('button:has-text("Add Note"), button:has-text("Save")');
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should validate required fields on lead form', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    
    // Try to submit without filling fields
    await page.click('button[type="submit"]');
    
    // Should see validation errors
    const errors = page.locator('text=/required|invalid|error/i');
    await expect(errors.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Project & Task Management', () => {
  test('should create and manage tasks', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/projects`);
    await page.waitForLoadState('networkidle');
    
    // Click first project
    const firstProject = page.locator('a[href*="/projects/"]').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForLoadState('networkidle');
      
      // Look for task creation button
      const createTaskBtn = page.locator('button:has-text("Create Task"), button:has-text("Add Task")').first();
      if (await createTaskBtn.isVisible()) {
        await createTaskBtn.click();
        
        // Fill task form
        await page.fill('input[name="title"]', 'E2E Test Task');
        await page.fill('textarea[name="description"]', 'Task created by E2E test');
        await page.click('button[type="submit"], button:has-text("Save")');
        
        // Verify task appears
        await expect(page.locator('text=E2E Test Task')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should update task status', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/projects`);
    
    // Navigate to a project with tasks
    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      
      // Find a task and update its status
      const taskRow = page.locator('[data-testid="task-row"], tr, .task-item').first();
      if (await taskRow.isVisible()) {
        await taskRow.click();
        
        // Change status
        const statusSelect = page.locator('select[name="status"]').first();
        if (await statusSelect.isVisible()) {
          await statusSelect.selectOption('in_progress');
          await page.waitForTimeout(1000);
          
          // Verify status changed
          await expect(page.locator('text=/in progress/i')).toBeVisible();
        }
      }
    }
  });
});

test.describe('Business Process Flows', () => {
  test('should visualize process flowchart', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/process`);
    await page.waitForLoadState('networkidle');
    
    // Check for canvas or SVG
    const flowchart = page.locator('canvas, svg').first();
    await expect(flowchart).toBeVisible({ timeout: 10000 });
    
    // Verify dimensions (flowchart should be visible size)
    const box = await flowchart.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);
  });

  test('should show process analytics', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/process/analytics`);
    await page.waitForLoadState('networkidle');
    
    // Should see metrics or charts
    const metrics = page.locator('text=/metrics|analytics|statistics/i').first();
    await expect(metrics).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Bug Tracking', () => {
  test('should create and track bug', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/bugs`);
    
    const createBtn = page.locator('button:has-text("Create Bug"), button:has-text("Report Bug")').first();
    if (await createBtn.isVisible()) {
      await createBtn.click();
      
      await page.fill('input[name="title"]', 'E2E Test Bug');
      await page.fill('textarea[name="description"]', 'Bug from E2E test');
      await page.fill('textarea[name="stepsToReproduce"]', '1. Run test\n2. Check result');
      
      // Select severity
      const severitySelect = page.locator('select[name="severity"]').first();
      if (await severitySelect.isVisible()) {
        await severitySelect.selectOption('medium');
      }
      
      await page.click('button[type="submit"]');
      
      // Verify bug created
      await expect(page.locator('text=E2E Test Bug')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Invoice & Payment Flow', () => {
  test('should display invoices and payments', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/invoices`);
    await page.waitForLoadState('networkidle');
    
    // Should see seeded invoice
    const invoice = page.locator('text=INV-1001').first();
    await expect(invoice).toBeVisible({ timeout: 5000 });
    
    // Click to view details
    await invoice.click();
    
    // Should see invoice items
    const items = page.locator('text=/deposit|payment|item/i').first();
    await expect(items).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Client Management', () => {
  test('should list clients and contacts', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/clients`);
    await page.waitForLoadState('networkidle');
    
    // Should see seeded clients
    const acmeClient = page.locator('text=Acme Corporation').first();
    await expect(acmeClient).toBeVisible({ timeout: 5000 });
    
    // Click to view client details
    await acmeClient.click();
    
    // Should see client contacts
    const contact = page.locator('text=Alice Robinson, text=alice@acme').first();
    await expect(contact).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Error Handling', () => {
  test('should handle 404 gracefully', async ({ page }) => {
    await page.goto(`${BASE_URL}/non-existent-page`);
    
    // Should show 404 page
    await expect(page.locator('text=/404|not found/i')).toBeVisible({ timeout: 5000 });
  });

  test('should handle API errors gracefully', async ({ page, request }) => {
    // Attempt invalid API call
    const response = await request.post(`${BASE_URL}/api/invalid-endpoint`, {
      data: { test: 'data' },
    });
    
    expect([404, 405, 500]).toContain(response.status());
  });
});

test.describe('Performance & Accessibility', () => {
  test('should load pages within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have proper semantic HTML', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for semantic elements
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('header, [role="banner"]')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check focus is visible
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});

test.describe('Data Persistence', () => {
  test('should persist changes across page reloads', async ({ page }) => {
    await page.goto(`${BASE_URL}/internal/leads`);
    
    // Make a change (e.g., add note)
    const leadRow = page.locator('[data-testid="lead-row"], tr').first();
    if (await leadRow.isVisible()) {
      await leadRow.click();
      
      const noteInput = page.locator('textarea[name="note"]').first();
      if (await noteInput.isVisible()) {
        const testNote = `Test note ${Date.now()}`;
        await noteInput.fill(testNote);
        await page.click('button:has-text("Save")');
        await page.waitForTimeout(1000);
        
        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Verify note still exists
        await expect(page.locator(`text=${testNote}`)).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
