# E2E Testing & DevTools Tracing Guide

## Overview
Complete guide for running end-to-end tests, capturing full browser traces, and validating all user flows.

---

## Prerequisites

### 1. Install Dependencies
```bash
npm install
npm i -D playwright @playwright/test
npx playwright install chromium
```

### 2. Configure Environment
Ensure `.env.local` has required variables:
```bash
TURSO_DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_auth_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional for auth flows
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Seed Database
```bash
npm run db:migrate  # Run migrations
npm run db:seed     # Populate test data
```

---

## Running E2E Tests

### Standard Test Run
```bash
# Runs all tests in headless mode
npm run test:e2e
```

### Interactive UI Mode
```bash
# Opens Playwright UI for debugging
npm run test:e2e:ui
```

### Debug Mode
```bash
# Runs tests with debugger
npm run test:e2e:debug
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/flows.spec.ts
```

### Run Specific Test
```bash
npx playwright test -g "should submit contact form"
```

---

## Capturing Full DevTools Traces

### Method 1: Playwright Trace (Recommended)
Playwright automatically captures traces on test failure. To force trace capture:

```bash
npx playwright test --trace on
```

View trace:
```bash
npx playwright show-report
```

### Method 2: Custom Trace Script
Capture a full Chromium trace with screenshots, snapshots, and network data:

```bash
# Ensure dev server is running
npm run dev

# In another terminal, run trace capture
npm run test:trace
```

Trace files are saved to `./traces/trace-<timestamp>.zip`

View trace:
```bash
npx playwright show-trace ./traces/trace-<timestamp>.zip
```

---

## Test Coverage Matrix

See [docs/TEST_COVERAGE_MATRIX.md](../docs/TEST_COVERAGE_MATRIX.md) for complete flow coverage.

### Key Flows Covered
1. ✅ Lead intake via contact form
2. ✅ Internal portal navigation
3. ✅ Lead to project conversion
4. ✅ Task management
5. ✅ Bug tracking
6. ✅ Invoice generation
7. ✅ Business process automation
8. ✅ Responsive design
9. ✅ Performance checks

---

## Using MCP Chrome DevTools

### Activate Browser Tools (VS Code)
If you have MCP Chrome tools activated in VS Code:

1. Start dev server: `npm run dev`
2. Use MCP commands to:
   - Navigate to pages
   - Click elements
   - Fill forms
   - Capture screenshots
   - Capture full snapshots
   - Monitor network requests
   - Read console logs
   - Measure performance

### Available MCP Chrome Tools
- `mcp_microsoft_pla_browser_navigate` - Navigate to URL
- `mcp_microsoft_pla_browser_evaluate` - Run JavaScript
- `mcp_microsoft_pla_browser_console_messages` - Get console logs
- `mcp_microsoft_pla_browser_network_requests` - View network activity
- `mcp_microsoft_pla_browser_run_code` - Execute Playwright code

### Example: Capture Full Page State
```typescript
// Using MCP browser tools (via Copilot or direct invocation)
// 1. Navigate to page
await page.goto('http://localhost:3000/internal/projects');

// 2. Get console messages
const logs = await page.evaluate(() => {
  return window.console.history; // if logged
});

// 3. Get network requests
const requests = await page.context().route('**/*', route => {
  console.log(route.request().url());
  route.continue();
});

// 4. Take snapshot
await page.screenshot({ path: 'snapshot.png', fullPage: true });
```

---

## Verifying Database State

### After Running Seeds
```bash
# Connect to Turso DB (or local SQLite)
turso db shell <your-db-name>

# Check data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM leads;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM tasks;
SELECT COUNT(*) FROM proposals;
SELECT COUNT(*) FROM invoices;
```

### After Test Execution
Verify expected state changes:
- Lead status updated
- Project created
- Tasks assigned
- Invoices generated
- Process instances running

---

## Debugging Test Failures

### 1. View Test Report
```bash
npx playwright show-report
```

### 2. Check Screenshots
Failed tests automatically capture screenshots:
```
test-results/<test-name>/test-failed-1.png
```

### 3. View Trace
```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

### 4. Run in Headed Mode
```bash
npx playwright test --headed --workers=1
```

### 5. Slow Motion
```bash
npx playwright test --headed --slow-mo=1000
```

---

## Performance Testing

### Lighthouse Audits
```bash
# Install lighthouse CLI
npm i -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

### Load Testing
For load/stress testing, use tools like:
- k6
- Apache JMeter
- Artillery

Example k6 script:
```javascript
// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000');
  check(res, { 'status 200': (r) => r.status === 200 });
}
```

Run:
```bash
k6 run load-test.js
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run db:migrate
      - run: npm run db:seed
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Troubleshooting

### Test Timeout
Increase timeout in `playwright.config.json`:
```json
{
  "timeout": 60000
}
```

### Browser Not Found
```bash
npx playwright install chromium
```

### Port Already in Use
Change port in `.env.local`:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

And update Playwright config.

### Database Connection Issues
- Verify `.env.local` credentials
- Check Turso DB status
- Ensure migrations are up to date

### Auth Issues
If tests fail due to auth:
- Add auth bypass for test environment
- Use test user credentials
- Mock auth in Playwright config

---

## Advanced Scenarios

### Testing with Different User Roles
```typescript
test.describe('Admin Role', () => {
  test.use({ storageState: 'auth/admin.json' });
  
  test('admin can create project', async ({ page }) => {
    // Test admin-specific features
  });
});
```

### API Testing
```typescript
test('API: Create Lead', async ({ request }) => {
  const response = await request.post('/api/leads', {
    data: {
      name: 'Test Lead',
      email: 'test@example.com',
    },
  });
  expect(response.status()).toBe(200);
});
```

### Visual Regression Testing
```typescript
test('Homepage visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

---

## Best Practices

1. **Keep tests independent** - Each test should set up and tear down its own data
2. **Use meaningful selectors** - Prefer `data-testid` over CSS selectors
3. **Wait for stability** - Use `waitForLoadState('networkidle')` when needed
4. **Capture evidence** - Screenshots and traces for failed tests
5. **Test happy and error paths** - Both success and failure scenarios
6. **Mock external services** - Don't rely on third-party APIs in tests
7. **Run tests in CI/CD** - Automate test execution on every commit

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Coverage Matrix](../docs/TEST_COVERAGE_MATRIX.md)
- [Database Schema](../lib/db/schema.ts)
- [Seed Script](../scripts/db-seed.ts)
