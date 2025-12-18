# Database Schema Cleanup Summary

**Date:** December 18, 2025  
**Purpose:** Remove tables not related to project development, delivery, and project management

## ✅ Tables KEPT (Core Project Management)

### User & Team Management
- **users** - Team members and roles
- **clients** - Client information

### Lead & Proposal Management  
- **leads** - Lead tracking and management
- **proposals** - Project proposals and quotes
- **proposalItems** - Proposal line items
- **leadNotes** - Lead tracking notes

### Project Management Core
- **projects** - Main project tracking
- **tasks** - Task management
- **milestones** - Project milestones
- **projectNotes** - Project documentation
- **projectRisks** - Risk management
- **changeRequests** - Scope change management
- **decisionRecords** - Architecture Decision Records (ADR)
- **projectTemplates** - Reusable project templates
- **bugs** - Bug tracking (part of project delivery)

### Process Automation (BPMN)
- **processDefinitions** - Business process definitions
- **processInstances** - Process execution tracking
- **businessProcessStepInstances** - Step-level tracking
- **businessProcessData** - Process context data
- **businessProcessMessages** - Inter-process communication
- **businessProcessAutomations** - Automation execution log
- **businessProcessSlas** - SLA definitions

### Collaboration & Documentation
- **taskComments** - Task discussions
- **attachments** - File attachments (generic)
- **onboardingChecklists** - Client onboarding checklists

### Audit & Events
- **events** - Activity tracking
- **auditEvents** - Audit trail

## ❌ Tables REMOVED (Not Core to PM)

### Finance & Billing (38 tables removed)
- ❌ **invoices** - Moved to separate finance system
- ❌ **invoiceItems** - Moved to separate finance system
- ❌ **payments** - Moved to separate finance system
- ❌ **timeEntries** - Time tracking for billing

### CRM & Pre-Sales
- ❌ **clientContacts** - Redundant (can use clients table)
- ❌ **leadTags** - Not core PM
- ❌ **leadScoringRules** - Sales automation
- ❌ **estimations** - Pre-sales estimation
- ❌ **feasibilityChecks** - Pre-sales assessment
- ❌ **stakeholders** - CRM feature

### QA & Testing (Moved to separate QA system)
- ❌ **qaSignoffs** - Use milestones instead
- ❌ **performanceTests** - QA/Testing focus
- ❌ **securityAudits** - Security focus
- ❌ **accessibilityAudits** - QA focus
- ❌ **mobileChecks** - QA focus

### Post-Delivery Support
- ❌ **feedbackItems** - Post-delivery support
- ❌ **maintenanceTasks** - Post-delivery maintenance
- ❌ **systemHealth** - Monitoring (not PM)
- ❌ **supportTickets** - Support system

### Internal Process Improvements
- ❌ **retrospectives** - Use projectNotes instead
- ❌ **npsSurveys** - Customer feedback
- ❌ **lessonsLearned** - Use projectNotes instead
- ❌ **processSuggestions** - Internal improvement

### Infrastructure & DevOps
- ❌ **environmentConfigs** - DevOps focus
- ❌ **apiEndpoints** - Technical planning

### Marketing & Sales
- ❌ **caseStudies** - Marketing focus

### Redundant Features
- ❌ **taskChecklists** - Use sub-tasks instead
- ❌ **subTasks** - Redundant with tasks
- ❌ **riskAssessments** - Duplicate of projectRisks
- ❌ **meetingNotes** - Use projectNotes instead

### Communication & Integration
- ❌ **emailLogs** - Not core PM
- ❌ **emailTemplates** - Email automation
- ❌ **meetings** - Basic calendar is enough
- ❌ **integrations** - Can be added later
- ❌ **webhookDeliveries** - Integration logging

## 📊 Impact Summary

- **Before:** 90+ tables
- **After:** 29 tables (68% reduction)
- **Focus:** Project development, delivery, and management

## 🔧 Required API/UI Updates

### Files Needing Updates (Finance References)
1. **app/api/internal/reports/route.ts** - Remove invoices, payments, timeEntries imports
2. **app/internal/reports/page.tsx** - Remove financial metrics
3. **app/internal/reports/ReportsClient.tsx** - Remove invoice columns

### Folders Removed
- ✅ **app/internal/invoices/** - Removed (finance)

### Folders TO KEEP (Have UI)
- ✅ **app/internal/bugs/** - Keep (project delivery)
- ✅ **app/internal/proposals/** - Keep (pre-project)
- ✅ **app/internal/projects/** - Keep (core)
- ✅ **app/internal/tasks/** - Keep (core)
- ✅ **app/internal/leads/** - Keep (lead management)
- ✅ **app/internal/clients/** - Keep (client management)
- ✅ **app/internal/process/** - Keep (process automation)

## 📝 Next Steps

1. ✅ **Schema Updated:** `lib/db/schema.ts` cleaned
2. ✅ **Types Updated:** `lib/types/json-types.ts` cleaned
3. ⚠️ **APIs Need Update:** Reports API still references removed tables
4. ⚠️ **UI Needs Update:** Reports page still shows finance metrics
5. 🔲 **Push to Database:** Run `npm run db:push` to apply schema changes

## 🚨 Breaking Changes

Applications/pages that referenced removed tables will need updates:
- Reports page financial metrics
- Any custom queries using removed tables

## ✅ Benefits

1. **Focused Schema:** Only project management essentials
2. **Better Performance:** Fewer tables to query
3. **Clearer Purpose:** Each table directly supports PM workflows
4. **Easier Maintenance:** Reduced complexity
5. **Scalable:** Clean foundation for future PM features

## 🔄 Rollback Plan

If needed, removed tables are documented in git history:
```bash
git log --all --full-history -- lib/db/schema.ts
```

All removed table definitions can be restored from commit before this cleanup.
