# Camunda Platform 8 Integration Guide

Complete integration of **Camunda Platform 8 (Zeebe)** workflow engine with Megicode's Next.js internal portal.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Setup Instructions](#setup-instructions)
5. [Deployment](#deployment)
6. [Usage](#usage)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This integration orchestrates **end-to-end business processes** across:

- **Client Acquisition & Onboarding** (`Megicode Client Acquisition _ Onboarding.bpmn`)
- **Project Delivery Workflow** (`megicode_delivery_process.bpmn`)

### Benefits

✅ **Automated workflow execution** – No manual step tracking  
✅ **Real-time visibility** – Monitor process instances at `/internal/instances`  
✅ **External task workers** – Microservices handle business logic outside the engine  
✅ **Scalability** – Zeebe handles high-throughput, distributed workflows  
✅ **Auditability** – Full history of process execution for compliance

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                    Camunda Platform 8 (Zeebe)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Process Inst │  │   Workflow   │  │  External    │        │
│  │   Storage    │──│    Engine    │──│  Task Queue  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────┬─────────────────────────────┘
                                  │ gRPC / REST
                                  │
┌─────────────────────────────────┴─────────────────────────────┐
│              Megicode Next.js App (localhost:3000)            │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  API Routes (/api/camunda/*)                         │    │
│  │  • /process/start   • /process/cancel                │    │
│  │  • /message/publish • /deploy                        │    │
│  │  • /health                                           │    │
│  └──────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  External Task Workers (lib/camunda/workers.ts)      │    │
│  │  • ServiceTask_CaptureRequest                        │    │
│  │  • ServiceTask_CreateProjectInstance                 │    │
│  │  • ServiceTask_LinkClient                            │    │
│  │  • GenerateFollowUpEmail                             │    │
│  │  • SendFollowUpEmail / SendWelcomeEmail              │    │
│  │  • ServiceTask_TrackMetrics                          │    │
│  │  • ServiceTask_SendDeliveryEmail                     │    │
│  └──────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Database (Turso / LibSQL)                           │    │
│  │  • process_instances (track running workflows)       │    │
│  │  • leads, projects, tasks, clients                   │    │
│  └──────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

---

## ✅ Prerequisites

### 1. Camunda Account (Choose One)

#### **Option A: Camunda Cloud (Recommended for Production)**

1. Go to [https://camunda.com/get-started/](https://camunda.com/get-started/)
2. Sign up for a **free trial** (no credit card required)
3. Create a **Cluster** (takes ~2 minutes)
4. Create **API Client Credentials**:
   - Navigate to **Console** → **Clusters** → Your Cluster → **API**
   - Click **Create** → Select **Zeebe** scope
   - **Save** the credentials:
     - `ZEEBE_CLIENT_ID`
     - `ZEEBE_CLIENT_SECRET`
     - `ZEEBE_CLUSTER_ID`

#### **Option B: Local Development (Docker)**

```bash
# Run Zeebe locally with Docker
docker run -d --name zeebe \
  -p 26500:26500 \
  -p 8080:8080 \
  camunda/zeebe:latest
```

### 2. Install Dependencies

```bash
npm install
```

This installs `zeebe-node` (already added to `package.json`).

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

**For Camunda Cloud**, add your credentials:

```env
ZEEBE_CLIENT_ID=your-client-id
ZEEBE_CLIENT_SECRET=your-client-secret
ZEEBE_CLUSTER_ID=your-cluster-id
ZEEBE_REGION=bru-2
```

**For Local Docker**, use:

```env
ZEEBE_ADDRESS=localhost:26500
```

---

## 🚀 Setup Instructions

### Step 1: Deploy BPMN Models

Deploy your BPMN files to Camunda:

```bash
# Option 1: Deploy via API (Next.js must be running)
npm run dev  # In terminal 1
npm run camunda:deploy  # In terminal 2
```

**Or** use the Camunda Modeler:

1. Download [Camunda Modeler](https://camunda.com/download/modeler/)
2. Open `Megicode Client Acquisition _ Onboarding.bpmn` and `megicode_delivery_process.bpmn`
3. Click **Deploy** → Configure endpoint → Deploy

### Step 2: Start External Task Workers

Workers poll Camunda for tasks and execute business logic:

```bash
npm run camunda:workers
```

**Output:**

```
============================================================
Camunda External Task Workers
============================================================
[Camunda] Connected to Zeebe at xxx-yyy-zzz.bru-2.zeebe.camunda.io:443
[Worker] Started worker for task type: ServiceTask_CaptureRequest
[Worker] Started worker for task type: ServiceTask_CreateProjectInstance
[Worker] Started worker for task type: ServiceTask_LinkClient
[Worker] Started worker for task type: GenerateFollowUpEmail
[Worker] Started worker for task type: SendFollowUpEmail
[Worker] Started worker for task type: SendWelcomeEmail
[Worker] Started worker for task type: ServiceTask_SendDeliveryEmail
[Worker] Started worker for task type: ServiceTask_TrackMetrics

Running 8 workers...
Press Ctrl+C to stop
```

### Step 3: Verify Health

Check connection to Camunda:

```bash
npm run camunda:health
```

**Expected Response:**

```json
{
  "success": true,
  "status": "connected",
  "topology": {
    "brokers": 3,
    "clusterSize": 3,
    "partitionsCount": 1,
    "replicationFactor": 1,
    "gatewayVersion": "8.6.3"
  }
}
```

---

## 📦 Deployment

### Deploy to Production

1. **Set environment variables** on your hosting platform (Vercel, Railway, etc.):

   ```env
   ZEEBE_CLIENT_ID=<production-client-id>
   ZEEBE_CLIENT_SECRET=<production-client-secret>
   ZEEBE_CLUSTER_ID=<production-cluster-id>
   ZEEBE_REGION=bru-2
   ```

2. **Run workers as a separate service** (e.g., Railway background worker):

   ```json
   // package.json
   {
     "scripts": {
       "worker": "ts-node scripts/start-camunda-workers.ts"
     }
   }
   ```

3. **Deploy BPMN models** (one-time setup):

   ```bash
   curl https://your-app.com/api/camunda/deploy
   ```

---

## 🔧 Usage

### Start a Process Instance

**From Code:**

```typescript
import { startProcessInstance } from '@/lib/camunda';

const instance = await startProcessInstance({
  bpmnProcessId: 'Process_Complete', // From megicode_delivery_process.bpmn
  variables: {
    leadId: 'lead-123',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    message: 'Need a web app built',
    source: 'website',
  },
});

console.log('Process started:', instance.processInstanceKey);
```

**Via API:**

```bash
curl -X POST http://localhost:3000/api/camunda/process/start \
  -H "Content-Type: application/json" \
  -d '{
    "bpmnProcessId": "Process_Complete",
    "variables": {
      "leadId": "lead-123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }'
```

### Cancel a Process Instance

```bash
curl -X POST http://localhost:3000/api/camunda/process/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "processInstanceKey": "2251799813687218"
  }'
```

### Publish a Message (Trigger Waiting Process)

```bash
curl -X POST http://localhost:3000/api/camunda/message/publish \
  -H "Content-Type: application/json" \
  -d '{
    "messageName": "ReceiveLeadSubmission",
    "correlationKey": "lead-123",
    "variables": {
      "leadScore": 85
    }
  }'
```

---

## 🧪 Testing

### Manual Testing with Camunda Operate

1. Go to **Camunda Operate** (Cloud: Console → Operate)
2. Navigate to **Instances**
3. Find your running process instance
4. Click to view:
   - Current active step
   - Variables
   - Audit log
   - Incidents (errors)

### Automated Testing with Playwright MCP

Run end-to-end tests (see next section).

---

## 🎭 Playwright MCP Testing

### Install Playwright

```bash
npm install @playwright/test --save-dev
```

### Test Script: `tests/camunda-integration.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Camunda Integration', () => {
  test('should deploy BPMN models', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/camunda/deploy');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.deploymentKey).toBeDefined();
  });

  test('should check Camunda health', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/camunda/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('connected');
  });

  test('should start process instance', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/camunda/process/start', {
      data: {
        bpmnProcessId: 'Process_Complete',
        variables: {
          name: 'Test User',
          email: 'test@example.com',
          source: 'automated-test',
        },
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.processInstance.processInstanceKey).toBeDefined();
  });
});
```

### Run Tests

```bash
npm run test:e2e
```

---

## 🐛 Troubleshooting

### Issue: Workers not receiving tasks

**Cause:** Workers not polling or incorrect task type names.

**Fix:**

1. Ensure BPMN task IDs match worker task types (e.g., `ServiceTask_CaptureRequest`)
2. Check workers are running: `npm run camunda:workers`
3. Verify Camunda connection: `npm run camunda:health`

### Issue: "Unauthorized" error

**Cause:** Invalid Camunda credentials.

**Fix:**

1. Verify `.env` has correct `ZEEBE_CLIENT_ID`, `ZEEBE_CLIENT_SECRET`, `ZEEBE_CLUSTER_ID`
2. Re-create API credentials in Camunda Console
3. Ensure credentials have **Zeebe** scope

### Issue: Process instance stuck

**Cause:** Worker crashed or task type mismatch.

**Fix:**

1. Go to **Camunda Operate** → **Instances** → Find stuck instance
2. Check **Incidents** tab for error details
3. Restart workers: `npm run camunda:workers`
4. Retry failed tasks in Operate

### Issue: Local Docker Zeebe not accessible

**Cause:** Port conflict or container not running.

**Fix:**

```bash
docker ps  # Check if Zeebe is running
docker logs zeebe  # View container logs
docker restart zeebe  # Restart container
```

---

## 📚 Additional Resources

- [Camunda Platform 8 Docs](https://docs.camunda.io/)
- [Zeebe Node.js Client](https://github.com/camunda-community-hub/zeebe-client-node-js)
- [BPMN 2.0 Reference](https://camunda.com/bpmn/)
- [Camunda Modeler Download](https://camunda.com/download/modeler/)

---

## 🎉 Quick Start Checklist

- [ ] Sign up for Camunda Cloud or run local Docker Zeebe
- [ ] Add credentials to `.env`
- [ ] Install dependencies: `npm install`
- [ ] Deploy BPMN models: `npm run camunda:deploy`
- [ ] Start workers: `npm run camunda:workers`
- [ ] Verify health: `npm run camunda:health`
- [ ] Start a process instance via API or code
- [ ] Monitor in Camunda Operate

---

## 📞 Support

For issues or questions:

- Check [Troubleshooting](#troubleshooting) section
- Review Camunda logs: `docker logs zeebe` (local) or Operate > Incidents (cloud)
- Contact Megicode DevOps team

---

**Last Updated:** December 18, 2025  
**Version:** 1.0.0
