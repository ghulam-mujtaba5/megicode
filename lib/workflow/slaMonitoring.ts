/**
 * SLA Monitoring System
 * 
 * Tracks step time limits, monitors for breaches, and triggers auto-escalations.
 * 
 * Features:
 * - Define SLA rules per step (warning threshold, critical threshold)
 * - Calculate current SLA status for process instances
 * - Auto-escalation triggers when SLA is breached
 * - Generate SLA breach notifications
 */

import { eq, and, lt, isNotNull, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import {
  processInstances,
  businessProcessStepInstances,
  events,
  users,
  tasks,
} from '@/lib/db/schema';
import { sendEmail } from '@/lib/email';
import { getActiveBusinessProcessDefinition } from './processEngine';

// =====================
// TYPES
// =====================

export interface SLARule {
  stepKey: string;
  warningThresholdMinutes: number;  // Time before warning (yellow)
  criticalThresholdMinutes: number; // Time before breach (red)
  escalateTo?: string[];  // User IDs or role names to notify
  autoReassign?: boolean; // Auto-reassign to manager if breached
  description?: string;
}

export interface SLAStatus {
  stepKey: string;
  stepTitle: string;
  status: 'on_track' | 'warning' | 'breached';
  elapsedMinutes: number;
  warningThreshold: number;
  criticalThreshold: number;
  percentUsed: number;
  timeRemaining: number | null; // null if breached
  startedAt: Date;
  assignedTo?: string;
  escalationTriggered: boolean;
}

export interface ProcessSLASummary {
  processInstanceId: string;
  projectName?: string;
  overallStatus: 'on_track' | 'warning' | 'breached';
  currentStepSLA: SLAStatus | null;
  historicalBreaches: number;
  averageStepTime: number;
  stepStatuses: SLAStatus[];
}

// =====================
// DEFAULT SLA RULES
// =====================

export const DEFAULT_SLA_RULES: SLARule[] = [
  {
    stepKey: 'pm_review_request',
    warningThresholdMinutes: 240, // 4 hours
    criticalThresholdMinutes: 480, // 8 hours
    escalateTo: ['admin'],
    description: 'PM must review incoming requests within 8 hours',
  },
  {
    stepKey: 'approval_gateway',
    warningThresholdMinutes: 480, // 8 hours
    criticalThresholdMinutes: 1440, // 24 hours
    escalateTo: ['admin'],
    description: 'Approval decisions should be made within 24 hours',
  },
  {
    stepKey: 'assign_developer',
    warningThresholdMinutes: 120, // 2 hours
    criticalThresholdMinutes: 480, // 8 hours
    escalateTo: ['pm'],
    description: 'Developer assignment should happen within 8 hours of approval',
  },
  {
    stepKey: 'development_subprocess',
    warningThresholdMinutes: 7200, // 5 days
    criticalThresholdMinutes: 14400, // 10 days
    escalateTo: ['pm', 'admin'],
    description: 'Development phase has a 10-day SLA unless extended',
  },
  {
    stepKey: 'final_review_deployment',
    warningThresholdMinutes: 240, // 4 hours
    criticalThresholdMinutes: 480, // 8 hours
    escalateTo: ['pm'],
    description: 'Final review and deployment within 8 hours',
  },
  {
    stepKey: 'client_feedback',
    warningThresholdMinutes: 2880, // 2 days
    criticalThresholdMinutes: 7200, // 5 days
    escalateTo: ['pm'],
    description: 'Client feedback expected within 5 days',
  },
];

// =====================
// SLA CALCULATION FUNCTIONS
// =====================

/**
 * Get SLA rule for a specific step
 */
export function getSLARuleForStep(stepKey: string, customRules?: SLARule[]): SLARule | undefined {
  const rules = customRules || DEFAULT_SLA_RULES;
  return rules.find(r => r.stepKey === stepKey);
}

/**
 * Calculate SLA status for a single step instance
 */
export function calculateStepSLAStatus(
  stepKey: string,
  stepTitle: string,
  startedAt: Date,
  assignedTo?: string,
  customRules?: SLARule[]
): SLAStatus {
  const rule = getSLARuleForStep(stepKey, customRules);
  const now = new Date();
  const elapsedMs = now.getTime() - startedAt.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

  // Default thresholds if no rule defined
  const warningThreshold = rule?.warningThresholdMinutes ?? 480; // 8 hours default
  const criticalThreshold = rule?.criticalThresholdMinutes ?? 1440; // 24 hours default

  let status: 'on_track' | 'warning' | 'breached';
  if (elapsedMinutes >= criticalThreshold) {
    status = 'breached';
  } else if (elapsedMinutes >= warningThreshold) {
    status = 'warning';
  } else {
    status = 'on_track';
  }

  const percentUsed = Math.min(100, Math.round((elapsedMinutes / criticalThreshold) * 100));
  const timeRemaining = status === 'breached' ? null : criticalThreshold - elapsedMinutes;

  return {
    stepKey,
    stepTitle,
    status,
    elapsedMinutes,
    warningThreshold,
    criticalThreshold,
    percentUsed,
    timeRemaining,
    startedAt,
    assignedTo,
    escalationTriggered: false,
  };
}

/**
 * Get SLA summary for a process instance
 */
export async function getProcessSLASummary(
  processInstanceId: string,
  customRules?: SLARule[]
): Promise<ProcessSLASummary | null> {
  const db = getDb();
  
  // Get process instance
  const instanceRows = await db
    .select()
    .from(processInstances)
    .where(eq(processInstances.id, processInstanceId))
    .limit(1);
  const instance = instanceRows[0];

  if (!instance) return null;

  // Get process definition for step titles
  const { definition } = await getActiveBusinessProcessDefinition();

  // Get all step instances
  const stepInstances = await db
    .select()
    .from(businessProcessStepInstances)
    .where(eq(businessProcessStepInstances.processInstanceId, processInstanceId))
    .all();

  const stepStatuses: SLAStatus[] = [];
  let historicalBreaches = 0;
  let totalStepTime = 0;
  let completedSteps = 0;

  for (const stepInst of stepInstances) {
    const stepDef = definition.steps.find(s => s.key === stepInst.stepKey);
    const stepTitle = stepDef?.title || stepInst.stepKey;

    if (stepInst.status === 'active' && stepInst.startedAt) {
      // Active step - calculate current SLA
      const slaStatus = calculateStepSLAStatus(
        stepInst.stepKey,
        stepTitle,
        stepInst.startedAt,
        stepInst.assignedToUserId || undefined,
        customRules
      );
      stepStatuses.push(slaStatus);
    } else if (stepInst.status === 'completed' && stepInst.startedAt && stepInst.completedAt) {
      // Completed step - check if it breached SLA
      const elapsedMs = stepInst.completedAt.getTime() - stepInst.startedAt.getTime();
      const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
      const rule = getSLARuleForStep(stepInst.stepKey, customRules);
      const criticalThreshold = rule?.criticalThresholdMinutes ?? 1440;

      if (elapsedMinutes > criticalThreshold) {
        historicalBreaches++;
      }

      totalStepTime += elapsedMinutes;
      completedSteps++;

      stepStatuses.push({
        stepKey: stepInst.stepKey,
        stepTitle,
        status: elapsedMinutes > criticalThreshold ? 'breached' : 'on_track',
        elapsedMinutes,
        warningThreshold: rule?.warningThresholdMinutes ?? 480,
        criticalThreshold,
        percentUsed: Math.min(100, Math.round((elapsedMinutes / criticalThreshold) * 100)),
        timeRemaining: null,
        startedAt: stepInst.startedAt,
        assignedTo: stepInst.assignedToUserId || undefined,
        escalationTriggered: false,
      });
    }
  }

  // Determine overall status
  const activeSteps = stepStatuses.filter(s => s.timeRemaining !== null);
  const currentStepSLA = activeSteps.length > 0 ? activeSteps[0] : null;

  let overallStatus: 'on_track' | 'warning' | 'breached' = 'on_track';
  if (activeSteps.some(s => s.status === 'breached')) {
    overallStatus = 'breached';
  } else if (activeSteps.some(s => s.status === 'warning')) {
    overallStatus = 'warning';
  }

  return {
    processInstanceId,
    overallStatus,
    currentStepSLA,
    historicalBreaches,
    averageStepTime: completedSteps > 0 ? Math.round(totalStepTime / completedSteps) : 0,
    stepStatuses,
  };
}

/**
 * Check all running processes for SLA breaches
 */
export async function checkAllSLABreaches(): Promise<{
  breached: ProcessSLASummary[];
  warning: ProcessSLASummary[];
  onTrack: ProcessSLASummary[];
}> {
  const db = getDb();

  const runningInstances = await db
    .select()
    .from(processInstances)
    .where(eq(processInstances.status, 'running'))
    .all();

  const breached: ProcessSLASummary[] = [];
  const warning: ProcessSLASummary[] = [];
  const onTrack: ProcessSLASummary[] = [];

  for (const instance of runningInstances) {
    const summary = await getProcessSLASummary(instance.id);
    if (!summary) continue;

    switch (summary.overallStatus) {
      case 'breached':
        breached.push(summary);
        break;
      case 'warning':
        warning.push(summary);
        break;
      default:
        onTrack.push(summary);
    }
  }

  return { breached, warning, onTrack };
}

// =====================
// ESCALATION FUNCTIONS
// =====================

/**
 * Trigger SLA escalation for a step
 */
export async function triggerSLAEscalation(
  processInstanceId: string,
  stepKey: string,
  slaStatus: SLAStatus
): Promise<void> {
  const db = getDb();
  const now = new Date();
  const rule = getSLARuleForStep(stepKey);

  // Log the escalation event
  await db.insert(events).values({
    id: crypto.randomUUID(),
    instanceId: processInstanceId,
    type: 'sla.escalation_triggered',
    payloadJson: {
      stepKey,
      status: slaStatus.status,
      elapsedMinutes: slaStatus.elapsedMinutes,
      threshold: slaStatus.criticalThreshold,
      escalateTo: rule?.escalateTo,
    },
    createdAt: now,
  });

  // Get users to notify
  if (rule?.escalateTo && rule.escalateTo.length > 0) {
    // If escalateTo contains role names, find users with those roles
    const usersToNotify = await db
      .select()
      .from(users)
      .where(sql`role IN (${sql.join(rule.escalateTo.map(r => sql`${r}`), sql`,`)})`)
      .all();

    // Send notification emails
    for (const user of usersToNotify) {
      if (user.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: `[SLA Alert] Step "${slaStatus.stepTitle}" has breached SLA`,
            text: `
SLA Breach Alert
================

Step: ${slaStatus.stepTitle}
Status: ${slaStatus.status.toUpperCase()}
Time Elapsed: ${Math.round(slaStatus.elapsedMinutes / 60)} hours
SLA Threshold: ${Math.round(slaStatus.criticalThreshold / 60)} hours
Process Instance: ${processInstanceId}

Please take immediate action to address this delay.

${rule.description || ''}

---
Megicode Internal Portal
            `.trim(),
          });
        } catch (error) {
          console.error(`Failed to send SLA escalation email to ${user.email}:`, error);
        }
      }
    }
  }

  // Create escalation task if autoReassign is enabled
  if (rule?.autoReassign) {
    const admins = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin'))
      .limit(1)
      .all();

    if (admins.length > 0) {
      await db.insert(tasks).values({
        id: crypto.randomUUID(),
        instanceId: processInstanceId,
        key: `sla_escalation_${stepKey}`,
        title: `[ESCALATED] ${slaStatus.stepTitle} - SLA Breached`,
        description: `This step has exceeded its SLA threshold of ${Math.round(slaStatus.criticalThreshold / 60)} hours. Please investigate and take action.`,
        priority: 'critical',
        status: 'todo',
        assignedToUserId: admins[0].id,
        createdAt: now,
        updatedAt: now,
      });
    }
  }
}

/**
 * Run SLA check job - to be called periodically (e.g., every 15 minutes)
 */
export async function runSLACheckJob(): Promise<{
  processed: number;
  escalations: number;
}> {
  const db = getDb();
  const now = new Date();

  // Get all active step instances
  const activeSteps = await db
    .select({
      stepInstance: businessProcessStepInstances,
      processInstance: processInstances,
    })
    .from(businessProcessStepInstances)
    .innerJoin(processInstances, eq(businessProcessStepInstances.processInstanceId, processInstances.id))
    .where(
      and(
        eq(businessProcessStepInstances.status, 'active'),
        eq(processInstances.status, 'running'),
        isNotNull(businessProcessStepInstances.startedAt)
      )
    )
    .all();

  let processed = 0;
  let escalations = 0;

  for (const { stepInstance, processInstance } of activeSteps) {
    if (!stepInstance.startedAt) continue;

    const { definition } = await getActiveBusinessProcessDefinition();
    const stepDef = definition.steps.find(s => s.key === stepInstance.stepKey);
    const stepTitle = stepDef?.title || stepInstance.stepKey;

    const slaStatus = calculateStepSLAStatus(
      stepInstance.stepKey,
      stepTitle,
      stepInstance.startedAt,
      stepInstance.assignedToUserId || undefined
    );

    processed++;

    // Check if we need to escalate
    if (slaStatus.status === 'breached') {
      // Check if we already escalated this step
      const existingEscalationRows = await db
        .select()
        .from(events)
        .where(
          and(
            eq(events.instanceId, processInstance.id),
            eq(events.type, 'sla.escalation_triggered'),
            sql`json_extract(payload_json, '$.stepKey') = ${stepInstance.stepKey}`
          )
        )
        .limit(1);
      const existingEscalation = existingEscalationRows[0];

      if (!existingEscalation) {
        await triggerSLAEscalation(processInstance.id, stepInstance.stepKey, slaStatus);
        escalations++;
      }
    }
  }

  return { processed, escalations };
}

// =====================
// SLA ANALYTICS
// =====================

export interface SLAAnalytics {
  totalProcesses: number;
  onTrackCount: number;
  warningCount: number;
  breachedCount: number;
  onTrackPercentage: number;
  averageComplianceRate: number;
  stepBreachCounts: Record<string, number>;
  mostBreachedSteps: Array<{ stepKey: string; stepTitle: string; breachCount: number }>;
}

/**
 * Get SLA analytics for all processes
 */
export async function getSLAAnalytics(
  periodDays: number = 30
): Promise<SLAAnalytics> {
  const db = getDb();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  // Get all completed step instances in the period
  const completedSteps = await db
    .select()
    .from(businessProcessStepInstances)
    .where(
      and(
        eq(businessProcessStepInstances.status, 'completed'),
        sql`started_at >= ${startDate.getTime()}`
      )
    )
    .all();

  const { definition } = await getActiveBusinessProcessDefinition();
  const stepBreachCounts: Record<string, number> = {};
  let totalCompliant = 0;
  let totalSteps = 0;

  for (const step of completedSteps) {
    if (!step.startedAt || !step.completedAt) continue;

    const rule = getSLARuleForStep(step.stepKey);
    const criticalThreshold = rule?.criticalThresholdMinutes ?? 1440;
    const elapsedMs = step.completedAt.getTime() - step.startedAt.getTime();
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

    totalSteps++;

    if (elapsedMinutes <= criticalThreshold) {
      totalCompliant++;
    } else {
      stepBreachCounts[step.stepKey] = (stepBreachCounts[step.stepKey] || 0) + 1;
    }
  }

  // Get current running processes status
  const { breached, warning, onTrack } = await checkAllSLABreaches();

  // Calculate most breached steps
  const mostBreachedSteps = Object.entries(stepBreachCounts)
    .map(([stepKey, breachCount]) => {
      const stepDef = definition.steps.find(s => s.key === stepKey);
      return {
        stepKey,
        stepTitle: stepDef?.title || stepKey,
        breachCount,
      };
    })
    .sort((a, b) => b.breachCount - a.breachCount)
    .slice(0, 5);

  return {
    totalProcesses: breached.length + warning.length + onTrack.length,
    onTrackCount: onTrack.length,
    warningCount: warning.length,
    breachedCount: breached.length,
    onTrackPercentage: Math.round((onTrack.length / Math.max(1, breached.length + warning.length + onTrack.length)) * 100),
    averageComplianceRate: totalSteps > 0 ? Math.round((totalCompliant / totalSteps) * 100) : 100,
    stepBreachCounts,
    mostBreachedSteps,
  };
}
