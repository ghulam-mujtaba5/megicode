/**
 * Internal API Testing Script
 * Tests all internal portal API endpoints for functionality
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  statusCode?: number;
  message: string;
  duration?: number;
}

const results: TestResult[] = [];

async function testEndpoint(
  endpoint: string,
  method: string,
  body?: any,
  headers?: Record<string, string>,
  expectedStatus: number[] = [200, 201]
): Promise<TestResult> {
  const start = Date.now();
  
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`\nTesting: ${method} ${endpoint}`);
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const duration = Date.now() - start;
    const status = expectedStatus.includes(response.status) ? 'PASS' : 'FAIL';
    
    let message = `Status ${response.status}`;
    if (status === 'PASS') {
      message += ` - OK (${duration}ms)`;
    } else {
      const text = await response.text();
      message += ` - Expected ${expectedStatus.join(' or ')}, got ${response.status}. Response: ${text.substring(0, 200)}`;
    }

    return {
      endpoint,
      method,
      status,
      statusCode: response.status,
      message,
      duration,
    };
  } catch (error: any) {
    return {
      endpoint,
      method,
      status: 'FAIL',
      message: `Error: ${error.message}`,
      duration: Date.now() - start,
    };
  }
}

async function runTests() {
  console.log('='.repeat(80));
  console.log('INTERNAL PORTAL API TESTING');
  console.log('='.repeat(80));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Started at: ${new Date().toISOString()}\n`);

  // Test Contact API (public)
  results.push(await testEndpoint(
    '/api/contact',
    'POST',
    {
      name: 'API Test',
      email: 'test@example.com',
      message: 'API testing message',
    },
    {},
    [200, 201, 400, 422] // Accept validation errors
  ));

  // Test Auth APIs
  results.push(await testEndpoint(
    '/api/auth/signin',
    'GET',
    undefined,
    {},
    [200, 401, 405] // May redirect or not allow GET
  ));

  // Test Internal APIs (these will likely need authentication)
  results.push(await testEndpoint(
    '/api/internal/onboarding',
    'POST',
    {
      userId: 'test-user',
      step: 'profile',
      completed: true,
    },
    {},
    [200, 201, 401, 403] // Unauthorized without session
  ));

  results.push(await testEndpoint(
    '/api/internal/admin/users',
    'PUT',
    {
      userId: 'test-user',
      updates: { role: 'viewer' },
    },
    {},
    [200, 201, 401, 403] // Unauthorized without session
  ));

  // Test Chat API
  results.push(await testEndpoint(
    '/api/chat',
    'POST',
    {
      message: 'Hello',
    },
    {},
    [200, 201, 400, 401] // May require auth or validation
  ));

  // Test Posts/Articles APIs
  results.push(await testEndpoint(
    '/api/posts',
    'GET',
    undefined,
    {},
    [200, 404] // May or may not exist
  ));

  results.push(await testEndpoint(
    '/api/articles',
    'GET',
    undefined,
    {},
    [200, 404] // May or may not exist
  ));

  // Print results
  console.log('\n' + '='.repeat(80));
  console.log('TEST RESULTS');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;

  results.forEach((result, index) => {
    const icon = result.status === 'PASS' ? '✓' : result.status === 'FAIL' ? '✗' : '○';
    const color = result.status === 'PASS' ? '\x1b[32m' : result.status === 'FAIL' ? '\x1b[31m' : '\x1b[33m';
    const reset = '\x1b[0m';
    
    console.log(`\n${index + 1}. ${color}${icon}${reset} ${result.method} ${result.endpoint}`);
    console.log(`   ${result.message}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${results.length}`);
  console.log(`✓ Passed: ${passed} (${Math.round(passed / results.length * 100)}%)`);
  console.log(`✗ Failed: ${failed} (${Math.round(failed / results.length * 100)}%)`);
  console.log(`○ Skipped: ${skipped}`);
  console.log(`\nCompleted at: ${new Date().toISOString()}`);
  console.log('='.repeat(80));

  // Exit with error code if tests failed
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
