/**
 * Workflow Automation Rules Engine
 * 
 * Configurable automation triggers and actions for the workflow system.
 * Supports:
 * - Email notifications on step transitions
 * - Automatic task generation
 * - Slack/Discord webhook notifications
 * - Conditional logic based on process data
 * - Scheduled actions and reminders
 * 
 * All automation respects system settings from the admin panel.
 */

import { eq, and } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { events, tasks, users, leads, projects, automationRulesConfig } from '@/lib/db/schema';
import { sendEmail } from '@/lib/email';
import { isAutomationEnabled, getEnabledAutomationRules, SETTING_KEYS, getBooleanSetting } from '@/lib/settings';
import type { ProcessDataContext, ProcessLane, BusinessProcessStep } from './businessProcess';

// =====================
// TYPES
// =====================

export type AutomationTrigger = 
  | 'step.entered'
  | 'step.completed'
  | 'step.assigned'
  | 'step.sla_warning'
  | 'step.sla_breached'
  | 'process.started'
  | 'process.completed'
  | 'gateway.decision'
  | 'data.updated';

export type AutomationActionType =
  | 'send_email'
  | 'create_task'
  | 'update_data'
  | 'send_webhook'
  | 'assign_user'
  | 'send_notification'
  | 'schedule_reminder'
  | 'execute_script';

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_empty' | 'is_empty';
  value?: any;
}

export interface EmailActionConfig {
  to: 'assignee' | 'project_owner' | 'client' | 'admin' | string; // email or role
  subject: string;
  templateKey?: string;
  bodyTemplate?: string;
  ccRoles?: string[];
}

export interface TaskActionConfig {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignTo: 'current_assignee' | 'project_owner' | 'pm' | 'admin' | string;
  dueDays?: number;
}

export interface WebhookActionConfig {
  url: string;
  method: 'POST' | 'PUT';
  headers?: Record<string, string>;
  payloadTemplate?: string;
  retryCount?: number;
}

export interface NotificationActionConfig {
  channel: 'email' | 'slack' | 'discord' | 'in_app';
  message: string;
  recipients: string[];
  urgency?: 'low' | 'normal' | 'high';
}

export interface ReminderActionConfig {
  delayMinutes: number;
  message: string;
  channel: 'email' | 'in_app';
  repeatCount?: number;
  repeatIntervalMinutes?: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  triggerStepKeys?: string[];  // Specific steps to trigger on, empty = all
  triggerLanes?: ProcessLane[];
  conditions?: AutomationCondition[];
  action: AutomationActionType;
  actionConfig: EmailActionConfig | TaskActionConfig | WebhookActionConfig | NotificationActionConfig | ReminderActionConfig | Record<string, any>;
  priority?: number;  // Lower = higher priority
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationExecutionContext {
  processInstanceId: string;
  stepKey?: string;
  stepTitle?: string;
  lane?: ProcessLane;
  previousStepKey?: string;
  assignedUserId?: string;
  processData: ProcessDataContext;
  triggerType: AutomationTrigger;
  gatewayDecision?: string;
}

export interface AutomationExecutionResult {
  ruleId: string;
  ruleName: string;
  success: boolean;
  action: AutomationActionType;
  error?: string;
  details?: Record<string, any>;
  executedAt: Date;
}

// =====================
// DEFAULT AUTOMATION RULES
// =====================

export const DEFAULT_AUTOMATION_RULES: AutomationRule[] = [
  // Email when PM review starts
  {
    id: 'rule_pm_review_notify',
    name: 'Notify PM on New Request',
    description: 'Send email to project managers when a new request enters review',
    enabled: true,
    trigger: 'step.entered',
    triggerStepKeys: ['pm_review_request'],
    action: 'send_email',
    actionConfig: {
      to: 'pm',
      subject: 'New Project Request Pending Review',
      bodyTemplate: `
Hi {{assigneeName}},

A new project request has been submitted and is ready for your review.

**Lead:** {{leadName}}
**Company:** {{leadCompany}}
**Message:** {{leadMessage}}

Please review and approve/reject the request at your earliest convenience.

[Review Request]({{portalUrl}}/internal/process/{{processInstanceId}})

---
Megicode Internal Portal
      `.trim(),
    } as EmailActionConfig,
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Create task when developer assigned
  {
    id: 'rule_dev_assigned_task',
    name: 'Create Dev Onboarding Task',
    description: 'Create a task for the developer when they are assigned to a project',
    enabled: true,
    trigger: 'step.entered',
    triggerStepKeys: ['development_subprocess'],
    action: 'create_task',
    actionConfig: {
      title: 'Review Requirements and Setup Development Environment',
      description: 'Please review the project requirements and set up your local development environment.',
      priority: 'high',
      assignTo: 'current_assignee',
      dueDays: 1,
    } as TaskActionConfig,
    priority: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Notify on approval
  {
    id: 'rule_approval_notification',
    name: 'Notify Team on Project Approval',
    description: 'Send notification when a project is approved',
    enabled: true,
    trigger: 'gateway.decision',
    triggerStepKeys: ['approval_gateway'],
    conditions: [
      { field: 'approvalStatus', operator: 'equals', value: 'approved' },
    ],
    action: 'send_notification',
    actionConfig: {
      channel: 'email',
      message: 'Project "{{projectName}}" has been approved and is moving forward!',
      recipients: ['pm', 'dev'],
      urgency: 'normal',
    } as NotificationActionConfig,
    priority: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // SLA warning reminder
  {
    id: 'rule_sla_warning',
    name: 'SLA Warning Reminder',
    description: 'Send reminder when step approaches SLA threshold',
    enabled: true,
    trigger: 'step.sla_warning',
    action: 'send_email',
    actionConfig: {
      to: 'assignee',
      subject: '[SLA Warning] Action Required: {{stepTitle}}',
      bodyTemplate: `
Hi {{assigneeName}},

This is a friendly reminder that the step "{{stepTitle}}" is approaching its SLA deadline.

**Time Elapsed:** {{elapsedHours}} hours
**SLA Deadline:** {{slaDeadlineHours}} hours
**Time Remaining:** {{timeRemainingHours}} hours

Please take action to complete this step before the deadline.

[View Process]({{portalUrl}}/internal/process/{{processInstanceId}})

---
Megicode Internal Portal
      `.trim(),
    } as EmailActionConfig,
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Process completed webhook
  {
    id: 'rule_process_completed_webhook',
    name: 'Process Completed Webhook',
    description: 'Send webhook notification when a process is completed',
    enabled: false, // Disabled by default - requires configuration
    trigger: 'process.completed',
    action: 'send_webhook',
    actionConfig: {
      url: '{{webhookUrl}}',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'megicode-internal',
      },
      payloadTemplate: JSON.stringify({
        event: 'process.completed',
        processInstanceId: '{{processInstanceId}}',
        projectName: '{{projectName}}',
        completedAt: '{{completedAt}}',
      }),
      retryCount: 3,
    } as WebhookActionConfig,
    priority: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Client feedback reminder
  {
    id: 'rule_client_feedback_reminder',
    name: 'Client Feedback Reminder',
    description: 'Schedule a reminder for client feedback collection',
    enabled: true,
    trigger: 'step.entered',
    triggerStepKeys: ['client_feedback'],
    action: 'schedule_reminder',
    actionConfig: {
      delayMinutes: 1440, // 24 hours
      message: 'Reminder: Client feedback is pending for project "{{projectName}}". Please follow up.',
      channel: 'email',
      repeatCount: 2,
      repeatIntervalMinutes: 1440, // Daily
    } as ReminderActionConfig,
    priority: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// =====================
// RULE EVALUATION
// =====================

/**
 * Check if conditions are met for a rule
 */
export function evaluateConditions(
  conditions: AutomationCondition[] | undefined,
  processData: ProcessDataContext
): boolean {
  if (!conditions || conditions.length === 0) return true;

  for (const condition of conditions) {
    const fieldValue = processData[condition.field];
    let matches = false;

    switch (condition.operator) {
      case 'equals':
        matches = fieldValue === condition.value;
        break;
      case 'not_equals':
        matches = fieldValue !== condition.value;
        break;
      case 'greater_than':
        matches = Number(fieldValue) > Number(condition.value);
        break;
      case 'less_than':
        matches = Number(fieldValue) < Number(condition.value);
        break;
      case 'contains':
        matches = String(fieldValue).includes(String(condition.value));
        break;
      case 'not_empty':
        matches = fieldValue != null && fieldValue !== '';
        break;
      case 'is_empty':
        matches = fieldValue == null || fieldValue === '';
        break;
    }

    if (!matches) return false;
  }

  return true;
}

/**
 * Find rules that should be triggered for a given context
 */
export function findMatchingRules(
  context: AutomationExecutionContext,
  rules: AutomationRule[] = DEFAULT_AUTOMATION_RULES
): AutomationRule[] {
  return rules
    .filter(rule => {
      // Must be enabled
      if (!rule.enabled) return false;

      // Must match trigger type
      if (rule.trigger !== context.triggerType) return false;

      // Check step filter
      if (rule.triggerStepKeys && rule.triggerStepKeys.length > 0) {
        if (!context.stepKey || !rule.triggerStepKeys.includes(context.stepKey)) {
          return false;
        }
      }

      // Check lane filter
      if (rule.triggerLanes && rule.triggerLanes.length > 0) {
        if (!context.lane || !rule.triggerLanes.includes(context.lane)) {
          return false;
        }
      }

      // Check conditions
      if (!evaluateConditions(rule.conditions, context.processData)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => (a.priority || 99) - (b.priority || 99));
}

// =====================
// TEMPLATE RENDERING
// =====================

/**
 * Render a template string with context data
 */
export function renderTemplate(
  template: string,
  context: AutomationExecutionContext,
  additionalData: Record<string, any> = {}
): string {
  const data: Record<string, any> = {
    processInstanceId: context.processInstanceId,
    stepKey: context.stepKey,
    stepTitle: context.stepTitle,
    lane: context.lane,
    previousStepKey: context.previousStepKey,
    assignedUserId: context.assignedUserId,
    gatewayDecision: context.gatewayDecision,
    portalUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://internal.megicode.com',
    timestamp: new Date().toISOString(),
    ...context.processData,
    ...additionalData,
  };

  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(placeholder, String(value ?? ''));
  }

  return result;
}

// =====================
// ACTION EXECUTORS
// =====================

/**
 * Execute email action
 */
async function executeEmailAction(
  config: EmailActionConfig,
  context: AutomationExecutionContext
): Promise<{ success: boolean; details?: Record<string, any>; error?: string }> {
  const db = getDb();
  let toEmail: string | undefined;

  // Resolve recipient
  if (config.to === 'assignee' && context.assignedUserId) {
    const user = await db.select().from(users).where(eq(users.id, context.assignedUserId)).get();
    toEmail = user?.email;
  } else if (['pm', 'admin', 'dev'].includes(config.to)) {
    const roleUsers = await db.select().from(users).where(eq(users.role, config.to as any)).limit(5).all();
    toEmail = roleUsers.map(u => u.email).join(', ');
  } else if (config.to === 'client' && context.processData.leadEmail) {
    toEmail = context.processData.leadEmail;
  } else if (config.to === 'project_owner' && context.processData.projectId) {
    const project = await db.select().from(projects).where(eq(projects.id, context.processData.projectId)).get();
    if (project?.ownerUserId) {
      const owner = await db.select().from(users).where(eq(users.id, project.ownerUserId)).get();
      toEmail = owner?.email;
    }
  } else if (config.to.includes('@')) {
    toEmail = config.to;
  }

  if (!toEmail) {
    return { success: false, error: 'Could not resolve email recipient' };
  }

  const subject = renderTemplate(config.subject, context);
  const body = config.bodyTemplate ? renderTemplate(config.bodyTemplate, context) : '';

  try {
    await sendEmail({ to: toEmail, subject, text: body });
    return { success: true, details: { to: toEmail, subject } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Execute task creation action
 */
async function executeTaskAction(
  config: TaskActionConfig,
  context: AutomationExecutionContext
): Promise<{ success: boolean; details?: Record<string, any>; error?: string }> {
  const db = getDb();
  const now = new Date();

  let assigneeId: string | null = null;

  // Resolve assignee
  if (config.assignTo === 'current_assignee' && context.assignedUserId) {
    assigneeId = context.assignedUserId;
  } else if (['pm', 'admin', 'dev'].includes(config.assignTo)) {
    const roleUsers = await db.select().from(users).where(eq(users.role, config.assignTo as any)).limit(1).all();
    assigneeId = roleUsers[0]?.id || null;
  } else if (config.assignTo === 'project_owner' && context.processData.projectId) {
    const project = await db.select().from(projects).where(eq(projects.id, context.processData.projectId)).get();
    assigneeId = project?.ownerUserId || null;
  }

  const dueAt = config.dueDays 
    ? new Date(now.getTime() + config.dueDays * 24 * 60 * 60 * 1000)
    : null;

  const taskId = crypto.randomUUID();

  try {
    await db.insert(tasks).values({
      id: taskId,
      instanceId: context.processInstanceId,
      key: `automation_${context.stepKey || 'general'}`,
      title: renderTemplate(config.title, context),
      description: config.description ? renderTemplate(config.description, context) : null,
      priority: config.priority,
      status: 'todo',
      assignedToUserId: assigneeId,
      dueAt,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, details: { taskId, assigneeId, dueAt: dueAt?.toISOString() } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Execute webhook action
 */
async function executeWebhookAction(
  config: WebhookActionConfig,
  context: AutomationExecutionContext
): Promise<{ success: boolean; details?: Record<string, any>; error?: string }> {
  const url = renderTemplate(config.url, context);
  const payload = config.payloadTemplate 
    ? JSON.parse(renderTemplate(config.payloadTemplate, context))
    : { context };

  let lastError: string | undefined;
  const maxRetries = config.retryCount || 1;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: config.method,
        headers: config.headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return { 
          success: true, 
          details: { 
            url, 
            status: response.status,
            attempt: attempt + 1,
          } 
        };
      }

      lastError = `HTTP ${response.status}: ${response.statusText}`;
    } catch (error) {
      lastError = String(error);
    }
  }

  return { success: false, error: lastError };
}

/**
 * Execute notification action
 */
async function executeNotificationAction(
  config: NotificationActionConfig,
  context: AutomationExecutionContext
): Promise<{ success: boolean; details?: Record<string, any>; error?: string }> {
  const db = getDb();
  const now = new Date();
  const message = renderTemplate(config.message, context);

  // For now, only email channel is implemented
  if (config.channel === 'email') {
    // Resolve recipients
    const emails: string[] = [];
    for (const recipient of config.recipients) {
      if (recipient.includes('@')) {
        emails.push(recipient);
      } else if (['pm', 'admin', 'dev'].includes(recipient)) {
        const roleUsers = await db.select().from(users).where(eq(users.role, recipient as any)).all();
        emails.push(...roleUsers.map(u => u.email));
      }
    }

    if (emails.length === 0) {
      return { success: false, error: 'No recipients found' };
    }

    try {
      await sendEmail({
        to: emails.join(', '),
        subject: `[Notification] ${context.processData.projectName || 'Process Update'}`,
        text: message,
      });

      return { success: true, details: { channel: 'email', recipients: emails } };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // Log in-app notifications
  if (config.channel === 'in_app') {
    await db.insert(events).values({
      id: crypto.randomUUID(),
      instanceId: context.processInstanceId,
      type: 'automation.notification',
      payloadJson: {
        message,
        recipients: config.recipients,
        urgency: config.urgency,
      },
      createdAt: now,
    });

    return { success: true, details: { channel: 'in_app', message } };
  }

  return { success: false, error: `Channel ${config.channel} not implemented` };
}

/**
 * Execute reminder action
 */
async function executeReminderAction(
  config: ReminderActionConfig,
  context: AutomationExecutionContext
): Promise<{ success: boolean; details?: Record<string, any>; error?: string }> {
  const db = getDb();
  const now = new Date();
  const scheduledAt = new Date(now.getTime() + config.delayMinutes * 60 * 1000);

  // Log scheduled reminder event
  await db.insert(events).values({
    id: crypto.randomUUID(),
    instanceId: context.processInstanceId,
    type: 'automation.reminder_scheduled',
    payloadJson: {
      message: renderTemplate(config.message, context),
      channel: config.channel,
      scheduledAt: scheduledAt.toISOString(),
      repeatCount: config.repeatCount,
      repeatIntervalMinutes: config.repeatIntervalMinutes,
    },
    createdAt: now,
  });

  return { 
    success: true, 
    details: { 
      scheduledAt: scheduledAt.toISOString(),
      message: config.message,
    } 
  };
}

// =====================
// MAIN EXECUTION FUNCTION
// =====================

/**
 * Execute all matching automation rules for a given context
 * Respects system settings for enabling/disabling automation
 */
export async function executeAutomationRules(
  context: AutomationExecutionContext,
  customRules?: AutomationRule[]
): Promise<AutomationExecutionResult[]> {
  const db = getDb();
  const now = new Date();
  const results: AutomationExecutionResult[] = [];

  // Check if global automation is enabled
  const globalEnabled = await isAutomationEnabled();
  if (!globalEnabled) {
    // Log that automation was skipped
    await db.insert(events).values({
      id: crypto.randomUUID(),
      instanceId: context.processInstanceId,
      type: 'automation.skipped',
      payloadJson: {
        reason: 'Global automation is disabled',
        trigger: context.triggerType,
        stepKey: context.stepKey,
      },
      createdAt: now,
    });
    return results;
  }

  // Get rules - either from custom rules, database, or defaults
  let rulesToUse: AutomationRule[];
  if (customRules) {
    rulesToUse = customRules;
  } else {
    // Try to get rules from database first
    const dbRules = await getEnabledAutomationRules();
    if (dbRules.length > 0) {
      rulesToUse = dbRules.map(r => ({
        ...r,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as AutomationRule[];
    } else {
      // Fall back to default rules
      rulesToUse = DEFAULT_AUTOMATION_RULES;
    }
  }

  const matchingRules = findMatchingRules(context, rulesToUse);

  for (const rule of matchingRules) {
    let result: { success: boolean; details?: Record<string, any>; error?: string };

    try {
      // Check specific automation type settings before executing
      switch (rule.action) {
        case 'send_email':
          if (!(await isAutomationEnabled('email'))) {
            result = { success: false, error: 'Email automation is disabled' };
          } else {
            result = await executeEmailAction(rule.actionConfig as EmailActionConfig, context);
          }
          break;
        case 'create_task':
          if (!(await isAutomationEnabled('tasks'))) {
            result = { success: false, error: 'Task automation is disabled' };
          } else {
            result = await executeTaskAction(rule.actionConfig as TaskActionConfig, context);
          }
          break;
        case 'send_webhook':
          if (!(await isAutomationEnabled('webhooks'))) {
            result = { success: false, error: 'Webhook automation is disabled' };
          } else {
            result = await executeWebhookAction(rule.actionConfig as WebhookActionConfig, context);
          }
          break;
        case 'send_notification':
          if (!(await isAutomationEnabled('email'))) {
            result = { success: false, error: 'Notification automation is disabled' };
          } else {
            result = await executeNotificationAction(rule.actionConfig as NotificationActionConfig, context);
          }
          break;
        case 'schedule_reminder':
          if (!(await isAutomationEnabled('reminders'))) {
            result = { success: false, error: 'Reminder automation is disabled' };
          } else {
            result = await executeReminderAction(rule.actionConfig as ReminderActionConfig, context);
          }
          break;
        default:
          result = { success: false, error: `Unknown action type: ${rule.action}` };
      }
    } catch (error) {
      result = { success: false, error: String(error) };
    }

    // Log execution
    await db.insert(events).values({
      id: crypto.randomUUID(),
      instanceId: context.processInstanceId,
      type: result.success ? 'automation.executed' : 'automation.failed',
      payloadJson: {
        ruleId: rule.id,
        ruleName: rule.name,
        action: rule.action,
        stepKey: context.stepKey,
        ...result,
      },
      createdAt: now,
    });

    results.push({
      ruleId: rule.id,
      ruleName: rule.name,
      success: result.success,
      action: rule.action,
      error: result.error,
      details: result.details,
      executedAt: now,
    });
  }

  return results;
}

/**
 * Convenience function to trigger automation on step entry
 */
export async function triggerStepEnteredAutomation(
  processInstanceId: string,
  stepKey: string,
  stepTitle: string,
  lane: ProcessLane,
  processData: ProcessDataContext,
  assignedUserId?: string,
  previousStepKey?: string
): Promise<AutomationExecutionResult[]> {
  return executeAutomationRules({
    processInstanceId,
    stepKey,
    stepTitle,
    lane,
    previousStepKey,
    assignedUserId,
    processData,
    triggerType: 'step.entered',
  });
}

/**
 * Convenience function to trigger automation on step completion
 */
export async function triggerStepCompletedAutomation(
  processInstanceId: string,
  stepKey: string,
  stepTitle: string,
  lane: ProcessLane,
  processData: ProcessDataContext,
  completedByUserId?: string
): Promise<AutomationExecutionResult[]> {
  return executeAutomationRules({
    processInstanceId,
    stepKey,
    stepTitle,
    lane,
    assignedUserId: completedByUserId,
    processData,
    triggerType: 'step.completed',
  });
}

/**
 * Convenience function to trigger automation on gateway decision
 */
export async function triggerGatewayAutomation(
  processInstanceId: string,
  stepKey: string,
  stepTitle: string,
  processData: ProcessDataContext,
  decision: string
): Promise<AutomationExecutionResult[]> {
  return executeAutomationRules({
    processInstanceId,
    stepKey,
    stepTitle,
    processData,
    triggerType: 'gateway.decision',
    gatewayDecision: decision,
  });
}
