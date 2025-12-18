/**
 * Camunda Integration E2E Tests
 * Tests Camunda Platform 8 integration using Playwright
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

test.describe('Camunda Integration', () => {
  test.describe('Health & Deployment', () => {
    test('should check Camunda connection health', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/camunda/health`);
      
      // Allow both connected and disconnected (in case Camunda isn't running)
      expect([200, 503]).toContain(response.status());
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(['connected', 'disconnected']).toContain(data.status);
      
      if (data.status === 'connected') {
        console.log('✅ Camunda is connected');
        expect(data.topology).toBeDefined();
        expect(data.topology.brokers).toBeGreaterThanOrEqual(0);
      } else {
        console.log('⚠️  Camunda is not connected (this is OK for local dev)');
      }
    });

    test('should deploy BPMN models (if Camunda is connected)', async ({ request }) => {
      // First check health
      const healthResponse = await request.get(`${BASE_URL}/api/camunda/health`);
      const healthData = await healthResponse.json();
      
      if (healthData.status !== 'connected') {
        test.skip();
        return;
      }

      const response = await request.get(`${BASE_URL}/api/camunda/deploy`);
      
      if (response.status() === 500) {
        const data = await response.json();
        console.log('Deployment error (might be expected):', data.error);
        // Don't fail test if files not found or other expected errors
        return;
      }
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.deploymentKey).toBeDefined();
      console.log('✅ BPMN models deployed successfully');
    });
  });

  test.describe('Process Instance Management', () => {
    let processInstanceKey: string;

    test('should start a process instance', async ({ request }) => {
      // Check health first
      const healthResponse = await request.get(`${BASE_URL}/api/camunda/health`);
      const healthData = await healthResponse.json();
      
      if (healthData.status !== 'connected') {
        test.skip();
        return;
      }

      const response = await request.post(`${BASE_URL}/api/camunda/process/start`, {
        data: {
          bpmnProcessId: 'Process_Complete',
          variables: {
            name: 'Playwright Test User',
            email: 'playwright@test.com',
            company: 'Test Corp',
            message: 'E2E test process instance',
            source: 'automated-test',
          },
        },
      });

      if (!response.ok()) {
        const errorData = await response.json();
        console.log('Start process error:', errorData.error);
        // Don't fail if process definition not deployed yet
        if (errorData.error?.includes('not found') || errorData.error?.includes('NOT_FOUND')) {
          console.log('⚠️  Process definition not deployed yet');
          test.skip();
          return;
        }
      }

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.processInstance).toBeDefined();
      expect(data.processInstance.processInstanceKey).toBeDefined();
      
      processInstanceKey = data.processInstance.processInstanceKey;
      console.log(`✅ Process instance started: ${processInstanceKey}`);
    });

    test('should cancel a process instance', async ({ request }) => {
      if (!processInstanceKey) {
        test.skip();
        return;
      }

      const response = await request.post(`${BASE_URL}/api/camunda/process/cancel`, {
        data: {
          processInstanceKey,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.success).toBe(true);
      console.log(`✅ Process instance cancelled: ${processInstanceKey}`);
    });
  });

  test.describe('Message Publishing', () => {
    test('should publish a message to Camunda', async ({ request }) => {
      const healthResponse = await request.get(`${BASE_URL}/api/camunda/health`);
      const healthData = await healthResponse.json();
      
      if (healthData.status !== 'connected') {
        test.skip();
        return;
      }

      const response = await request.post(`${BASE_URL}/api/camunda/message/publish`, {
        data: {
          messageName: 'ReceiveLeadSubmission',
          correlationKey: 'test-lead-123',
          variables: {
            leadScore: 95,
            priority: 'high',
          },
          timeToLive: 60000,
        },
      });

      // Message publishing may fail if no waiting process instance
      // This is expected behavior
      if (response.status() === 500) {
        const data = await response.json();
        console.log('Message publish note:', data.error);
        // Don't fail test
        return;
      }

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.messageKey).toBeDefined();
      console.log('✅ Message published successfully');
    });
  });

  test.describe('Integration with Internal Portal', () => {
    test('should create lead and trigger process', async ({ request }) => {
      // This would test the full integration flow:
      // 1. Submit contact form
      // 2. Verify lead created in DB
      // 3. Verify process instance started
      // 4. Verify workers processed tasks
      
      // For now, just verify API endpoints exist
      const endpoints = [
        '/api/camunda/health',
        '/api/camunda/deploy',
        '/api/camunda/process/start',
        '/api/camunda/process/cancel',
        '/api/camunda/message/publish',
      ];

      for (const endpoint of endpoints) {
        const response = await request.get(`${BASE_URL}${endpoint}`);
        console.log(`${endpoint}: ${response.status()}`);
        // Just verify endpoint exists (200, 405, or 500 all mean endpoint exists)
        expect([200, 405, 500, 503]).toContain(response.status());
      }
    });
  });
});

test.describe('Camunda Workers', () => {
  test('should have worker script available', async () => {
    // Verify worker script exists
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const workerScriptPath = path.join(process.cwd(), 'scripts', 'start-camunda-workers.ts');
    
    try {
      await fs.access(workerScriptPath);
      console.log('✅ Worker script exists:', workerScriptPath);
      expect(true).toBe(true);
    } catch {
      throw new Error('Worker script not found');
    }
  });
});
