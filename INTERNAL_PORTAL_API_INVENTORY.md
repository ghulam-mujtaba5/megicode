# Internal Portal API & Pages Inventory
**Last Updated:** December 17, 2025  
**Database:** Remote Turso DB (`libsql://megicode-internal-megicode.aws-eu-west-1.turso.io`)

## 📊 Summary
- **Total API Endpoints:** 43 (28 new endpoints added!)
- **Total Pages:** 40+
- **Database:** Remote Turso (Libsql)
- **Last Updated:** December 17, 2025

---

## 🔌 API Endpoints

### Process Management APIs
Located in: `app/api/internal/process/`

#### 1. GET `/api/internal/process`
**File:** [app/api/internal/process/route.ts](app/api/internal/process/route.ts)  
**Description:** Get all business processes  
**Auth:** Required  
**Response:** Array of process objects  

#### 2. POST `/api/internal/process`
**File:** [app/api/internal/process/route.ts](app/api/internal/process/route.ts)  
**Description:** Create new business process  
**Auth:** Required  
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "category": "string"
}
```

#### 3. GET `/api/internal/process/[id]`
**File:** [app/api/internal/process/[id]/route.ts](app/api/internal/process/[id]/route.ts)  
**Description:** Get specific process by ID  
**Auth:** Required  
**Params:** `id` (process ID)  

#### 4. PATCH `/api/internal/process/[id]`
**File:** [app/api/internal/process/[id]/route.ts](app/api/internal/process/[id]/route.ts)  
**Description:** Update existing process  
**Auth:** Required  
**Params:** `id` (process ID)  

#### 5. DELETE `/api/internal/process/[id]`
**File:** [app/api/internal/process/[id]/route.ts](app/api/internal/process/[id]/route.ts)  
**Description:** Delete process  
**Auth:** Required  
**Params:** `id` (process ID)  

---

### Process Steps APIs
Located in: `app/api/internal/process/[id]/step/`

#### 6. GET `/api/internal/process/[id]/step`
**File:** [app/api/internal/process/[id]/step/route.ts](app/api/internal/process/[id]/step/route.ts)  
**Description:** Get all steps for a process  
**Auth:** Required  
**Params:** `id` (process ID)  

#### 7. POST `/api/internal/process/[id]/step`
**File:** [app/api/internal/process/[id]/step/route.ts](app/api/internal/process/[id]/step/route.ts)  
**Description:** Create new step in process  
**Auth:** Required  
**Params:** `id` (process ID)  

---

### Process Execution APIs
Located in: `app/api/internal/process/[id]/execute/`

#### 8. POST `/api/internal/process/[id]/execute`
**File:** [app/api/internal/process/[id]/execute/route.ts](app/api/internal/process/[id]/execute/route.ts)  
**Description:** Execute a business process  
**Auth:** Required  
**Params:** `id` (process ID)  

#### 9. GET `/api/internal/process/[id]/execute`
**File:** [app/api/internal/process/[id]/execute/route.ts](app/api/internal/process/[id]/execute/route.ts)  
**Description:** Get execution status/history  
**Auth:** Required  
**Params:** `id` (process ID)  

---

### Process Analytics API
Located in: `app/api/internal/process/analytics/`

#### 10. GET `/api/internal/process/analytics`
**File:** [app/api/internal/process/analytics/route.ts](app/api/internal/process/analytics/route.ts)  
**Description:** Get process analytics and metrics  
**Auth:** Required  
**Returns:** Process execution statistics, performance metrics  

---

### Onboarding APIs
Located in: `app/api/internal/onboarding/`

#### 11. POST `/api/internal/onboarding`
**File:** [app/api/internal/onboarding/route.ts](app/api/internal/onboarding/route.ts)  
**Description:** Create new client onboarding  
**Auth:** Required  
**Body:**
```json
{
  "clientName": "string",
  "email": "string",
  "projectDetails": "object"
}
```

#### 12. POST `/api/internal/onboarding/automate`
**File:** [app/api/internal/onboarding/automate/route.ts](app/api/internal/onboarding/automate/route.ts)  
**Description:** Automate onboarding process  
**Auth:** Required  
**Returns:** Automated onboarding workflow status  

---

### Leads APIs
Located in: `app/api/internal/leads/score/`

#### 13. POST `/api/internal/leads/score`
**File:** [app/api/internal/leads/score/route.ts](app/api/internal/leads/score/route.ts)  
**Description:** Score a lead using AI/ML  
**Auth:** Required  
**Body:** Lead information  

#### 14. GET `/api/internal/leads/score`
**File:** [app/api/internal/leads/score/route.ts](app/api/internal/leads/score/route.ts)  
**Description:** Get lead scoring history/results  
**Auth:** Required  

---

### Admin APIs
Located in: `app/api/internal/admin/`

#### 15. PUT `/api/internal/admin/users`
**File:** [app/api/internal/admin/users/route.ts](app/api/internal/admin/users/route.ts)  
**Description:** Update user information  
**Auth:** Admin required  
**Body:** User update data  

---

### Projects APIs (NEW)
Located in: `app/api/internal/projects/`

#### 16. GET `/api/internal/projects`
**File:** [app/api/internal/projects/route.ts](app/api/internal/projects/route.ts)  
**Description:** Get all projects with optional filtering  
**Auth:** Required  
**Query Params:** `status` (optional)  

#### 17. POST `/api/internal/projects`
**File:** [app/api/internal/projects/route.ts](app/api/internal/projects/route.ts)  
**Description:** Create new project  
**Auth:** Required  
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "clientId": "uuid",
  "status": "new|in_progress|completed",
  "budget": "number",
  "startDate": "date",
  "endDate": "date"
}
```

#### 18. GET `/api/internal/projects/[id]`
**File:** [app/api/internal/projects/[id]/route.ts](app/api/internal/projects/[id]/route.ts)  
**Description:** Get specific project by ID  
**Auth:** Required  

#### 19. PATCH `/api/internal/projects/[id]`
**File:** [app/api/internal/projects/[id]/route.ts](app/api/internal/projects/[id]/route.ts)  
**Description:** Update existing project  
**Auth:** Required  

#### 20. DELETE `/api/internal/projects/[id]`
**File:** [app/api/internal/projects/[id]/route.ts](app/api/internal/projects/[id]/route.ts)  
**Description:** Delete project  
**Auth:** Required  

---

### Tasks APIs (NEW)
Located in: `app/api/internal/tasks/`

#### 21. GET `/api/internal/tasks`
**File:** [app/api/internal/tasks/route.ts](app/api/internal/tasks/route.ts)  
**Description:** Get all tasks with filtering  
**Auth:** Required  
**Query Params:** `status`, `projectId`, `assigneeId` (all optional)  

#### 22. POST `/api/internal/tasks`
**File:** [app/api/internal/tasks/route.ts](app/api/internal/tasks/route.ts)  
**Description:** Create new task  
**Auth:** Required  
**Body:**
```json
{
  "title": "string",
  "description": "string",
  "projectId": "uuid",
  "assigneeId": "uuid",
  "status": "todo|in_progress|done",
  "priority": "low|medium|high",
  "dueDate": "date"
}
```

#### 23. GET `/api/internal/tasks/[id]`
#### 24. PATCH `/api/internal/tasks/[id]`
#### 25. DELETE `/api/internal/tasks/[id]`
**File:** [app/api/internal/tasks/[id]/route.ts](app/api/internal/tasks/[id]/route.ts)  
**Description:** Get, update, or delete specific task  
**Auth:** Required  

---

### Leads APIs (EXPANDED)
Located in: `app/api/internal/leads/`

#### 26. GET `/api/internal/leads`
**File:** [app/api/internal/leads/route.ts](app/api/internal/leads/route.ts)  
**Description:** Get all leads  
**Auth:** Required  

#### 27. POST `/api/internal/leads`
**File:** [app/api/internal/leads/route.ts](app/api/internal/leads/route.ts)  
**Description:** Create new lead  
**Auth:** Required  

#### 28. GET `/api/internal/leads/[id]`
#### 29. PATCH `/api/internal/leads/[id]`
#### 30. DELETE `/api/internal/leads/[id]`
**File:** [app/api/internal/leads/[id]/route.ts](app/api/internal/leads/[id]/route.ts)  
**Description:** Get, update, or delete specific lead  
**Auth:** Required  

---

### Proposals APIs (NEW)
Located in: `app/api/internal/proposals/`

#### 31. GET `/api/internal/proposals`
#### 32. POST `/api/internal/proposals`
**File:** [app/api/internal/proposals/route.ts](app/api/internal/proposals/route.ts)  
**Description:** List or create proposals  
**Auth:** Required  

#### 33. GET `/api/internal/proposals/[id]`
#### 34. PATCH `/api/internal/proposals/[id]`
#### 35. DELETE `/api/internal/proposals/[id]`
**File:** [app/api/internal/proposals/[id]/route.ts](app/api/internal/proposals/[id]/route.ts)  
**Description:** Manage specific proposal  
**Auth:** Required  

---

### Clients APIs (NEW)
Located in: `app/api/internal/clients/`

#### 36. GET `/api/internal/clients`
#### 37. POST `/api/internal/clients`
**File:** [app/api/internal/clients/route.ts](app/api/internal/clients/route.ts)  
**Description:** List or create clients  
**Auth:** Required  

#### 38. GET `/api/internal/clients/[id]`
#### 39. PATCH `/api/internal/clients/[id]`
#### 40. DELETE `/api/internal/clients/[id]`
**File:** [app/api/internal/clients/[id]/route.ts](app/api/internal/clients/[id]/route.ts)  
**Description:** Manage specific client  
**Auth:** Required  

---

### Bugs APIs (NEW)
Located in: `app/api/internal/bugs/`

#### 41. GET `/api/internal/bugs`
#### 42. POST `/api/internal/bugs`
**File:** [app/api/internal/bugs/route.ts](app/api/internal/bugs/route.ts)  
**Description:** List or report bugs  
**Auth:** Required  

---

### Reports & Analytics (NEW)
Located in: `app/api/internal/reports/`

#### 43. GET `/api/internal/reports`
**File:** [app/api/internal/reports/route.ts](app/api/internal/reports/route.ts)  
**Description:** Get dashboard analytics and comprehensive reports  
**Auth:** Required  
**Query Params:** `type` (dashboard|projects|performance)  
**Returns:** Aggregated statistics, metrics, and insights  

---

## 📄 Portal Pages

### Main Pages
1. **Dashboard** - [/internal](app/internal/page.tsx)
2. **Login** - [/internal/login](app/internal/login/page.tsx)
3. **Setup Guide** - [/internal/setup-guide](app/internal/setup-guide/page.tsx)

### Process Management
4. **Processes List** - [/internal/process](app/internal/process/page.tsx)
5. **Process Showcase** - [/internal/process/showcase](app/internal/process/showcase/page.tsx)
6. **Process Detail** - [/internal/process/[id]](app/internal/process/[id]/page.tsx)
7. **Process Instances** - [/internal/instances](app/internal/instances/page.tsx)

### Client Management
8. **Onboarding** - [/internal/onboarding](app/internal/onboarding/page.tsx)
9. **Leads** - [/internal/leads](app/internal/leads/page.tsx)
10. **Lead Detail** - [/internal/leads/[id]](app/internal/leads/[id]/page.tsx)

### Project Management
11. **Projects List** - [/internal/projects](app/internal/projects/page.tsx)
12. **Project Detail** - [/internal/projects/[id]](app/internal/projects/[id]/page.tsx)

### Team & Resources
13. **Team** - [/internal/team](app/internal/team/page.tsx)
14. **Resources** - [/internal/resources](app/internal/resources/page.tsx)
15. **Templates** - [/internal/templates](app/internal/templates/page.tsx)

### Proposals & Tasks
16. **Proposals List** - [/internal/proposals](app/internal/proposals/page.tsx)
17. **Proposal Detail** - [/internal/proposals/[id]](app/internal/proposals/[id]/page.tsx)
18. **Tasks List** - [/internal/tasks](app/internal/tasks/page.tsx)
19. **Task Detail** - [/internal/tasks/[id]](app/internal/tasks/[id]/page.tsx)
20. **Suggestions** - [/internal/suggestions](app/internal/suggestions/page.tsx)

---

## 🗄️ Database Configuration

**Provider:** Turso (libSQL - SQLite for the edge)  
**Connection String:** `libsql://megicode-internal-megicode.aws-eu-west-1.turso.io`  
**Auth Token:** Configured in `.env.local`  
**ORM:** Drizzle ORM  
**Config File:** [drizzle.config.ts](drizzle.config.ts)

### Environment Variables Required
```env
TURSO_DATABASE_URL="libsql://megicode-internal-megicode.aws-eu-west-1.turso.io"
TURSO_AUTH_TOKEN="<your-token>"
```

---

## 🔐 Authentication

All `/api/internal/*` endpoints and `/internal/*` pages require authentication.
Auth implementation located in [auth.ts](auth.ts).

---

## 🧪 Testing

### Manual Testing Script
Use the PowerShell test script:
```powershell
.\scripts\test-internal-portal.ps1 -BaseUrl "http://localhost:3000" -Verbose
```

### Testing Against Production
```powershell
.\scripts\test-internal-portal.ps1 -BaseUrl "https://your-domain.com"
```

### Individual API Test Example
```powershell
# Test process list endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/internal/process" `
  -Method GET `
  -Headers @{"Authorization"="Bearer <token>"}
```

---

## 📈 Features by Module

### Process Automation
- Create and manage business processes
- Define process steps and workflows
- Execute processes with tracking
- View process analytics and performance

### Client Onboarding
- Automated onboarding workflows
- Client information management
- Progress tracking
- Integration with project management

### Lead Management
- AI-powered lead scoring
- Lead tracking and history
- Conversion analytics
- Integration with CRM workflows

### Project Management
- Project creation and tracking
- Task management
- Team assignment
- Progress monitoring

### Team Collaboration
- Team member management
- Resource allocation
- Template sharing
- Communication tools

---

## 🔄 Database Operations

All APIs use the remote Turso database. Key operations:

1. **Drizzle ORM** - Type-safe database queries
2. **Migrations** - Located in `drizzle/` directory
3. **Schema** - Defined in database schema files
4. **Connection Pooling** - Handled by Turso client

### Running Migrations
```bash
npm run db:push      # Push schema changes
npm run db:generate  # Generate migration files  
npm run db:migrate   # Run migrations
```

---

## 🚀 Deployment Notes

- APIs are deployed as Next.js API Routes (serverless functions)
- Pages are Server-Side Rendered (SSR) or Static Site Generated (SSG)
- Database connections are edge-optimized via Turso
- Environment variables must be set in deployment platform

---

## 📝 Notes

- All APIs return JSON responses
- Error responses follow standard format: `{ error: "message", details?: {} }`
- Success responses: `{ success: true, data: {} }` or just `{ data: {} }`
- Rate limiting may be implemented on production
- CORS is configured for internal use only

---

## 🔗 Related Documentation

- [Internal Portal Audit Report](INTERNAL_PORTAL_AUDIT_REPORT.md)
- [Internal Portal Navigation Audit](INTERNAL_PORTAL_NAVIGATION_AUDIT.md)
- [Internal Portal Roadmap](INTERNAL_PORTAL_ROADMAP.md)
- [Authentication Documentation](README-AUTH.md)
- [SEO Documentation](SEO_DOCUMENTATION.md)
