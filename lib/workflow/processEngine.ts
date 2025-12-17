/**
 * Business Process Engine - Runtime Execution
 * 
 * Handles:
 * - Process instance creation and management
 * - Step execution and transitions
 * - Gateway evaluation
 * - Automation action execution
 * - Integration with existing modules (leads, proposals, projects)
 */

import { eq, and, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { getDb } from '@/lib/db';
import {
  processDefinitions,
  processInstances,
  leads,
  proposals,
  projects,
  clients,
  events,
  tasks,
  meetings,
} from '@/lib/db/schema';
import {
  type BusinessProcessDefinition,
  type BusinessProcessInstance,
  type ProcessDataContext,
  type ProcessInstanceStatus,
  type StepInstanceStatus,
  type ProcessStepInstance,
  type AutomationAction,
  type ProcessEvent,
  type ProcessEventType,
  getNextSteps,
  getStepByKey,
  MEGICODE_BUSINESS_PROCESS_KEY,
  getDefaultBusinessProcessDefinition,
} from './businessProcess';
// =====================
// PROCESS DEFINITION MANAGEMENT
// =====================

export async function getActiveBusinessProcessDefinition(): Promise<{
  id: string;
  definition: BusinessProcessDefinition;
}> {
  const db = getDb();

  const existing = await db
    .select()
    .from(processDefinitions)
    .where(
      and(
        eq(processDefinitions.key, MEGICODE_BUSINESS_PROCESS_KEY),
        eq(processDefinitions.isActive, true)
      )
    )
    .orderBy(desc(processDefinitions.version))
    .get();

  if (existing) {
    return {
      id: existing.id,
      definition: existing.json as unknown as BusinessProcessDefinition,
    };
  }

  // Create default if not exists
  const defaultDef = getDefaultBusinessProcessDefinition();
  const id = randomUUID();
  const now = new Date();

  await db.insert(processDefinitions).values({
    id,
    key: MEGICODE_BUSINESS_PROCESS_KEY,
    version: defaultDef.version,
    isActive: true,
    json: defaultDef as unknown as typeof processDefinitions.$inferInsert['json'],
    createdAt: now,
  });

  return { id, definition: defaultDef };
}

// =====================
// PROCESS INSTANCE MANAGEMENT
// =====================

export async function createProcessInstance(params: {
  leadId?: string;
  proposalId?: string;
  projectId?: string;
  clientId?: string;
  createdByUserId?: string;
  initialData?: Partial<ProcessDataContext>;
}): Promise<BusinessProcessInstance> {
  const db = getDb();
  const { id: defId, definition } = await getActiveBusinessProcessDefinition();
  const now = new Date();

  // Find start step
  const startStep = definition.steps.find(s => s.type === 'start_event');
  if (!startStep) {
    throw new Error('No start event found in process definition');
  }

  const instanceId = crypto.randomUUID();

  // Initialize step instances for all steps
  const stepInstances: ProcessStepInstance[] = definition.steps.map(step => ({
    stepKey: step.key,
    status: step.key === startStep.key ? 'completed' : 'pending',
    startedAt: step.key === startStep.key ? now : undefined,
    completedAt: step.key === startStep.key ? now : undefined,
  }));

  // Find the next step after start
  const nextSteps = getNextSteps(definition, startStep.key, params.initialData || {});
  const currentStepKey = nextSteps[0] || startStep.key;
  const currentStep = getStepByKey(definition, currentStepKey);

  // Mark current step as active
  const currentStepInstance = stepInstances.find(si => si.stepKey === currentStepKey);
  if (currentStepInstance) {
    currentStepInstance.status = 'active';
    currentStepInstance.startedAt = now;
  }

  const instance: BusinessProcessInstance = {
    id: instanceId,
    processDefinitionId: defId,
    processDefinitionKey: definition.key,
    processDefinitionVersion: definition.version,
    leadId: params.leadId,
    proposalId: params.proposalId,
    projectId: params.projectId,
    clientId: params.clientId,
    status: 'running',
    currentStepKey,
    currentLane: currentStep?.lane || 'Client',
    stepInstances,
    processData: params.initialData || {},
    startedAt: now,
    createdByUserId: params.createdByUserId,
  };

  // Store in database (simplified - using JSON for step instances)
  await db.insert(processInstances).values({
    id: instanceId,
    processDefinitionId: defId,
    projectId: params.projectId || '',
    status: 'running',
    currentStepKey,
    startedAt: now,
  });

  // Log the event
  await logProcessEvent({
    processInstanceId: instanceId,
    eventType: 'process.started',
    stepKey: startStep.key,
    actorUserId: params.createdByUserId,
    data: { initialData: params.initialData },
  });

  return instance;
}

export async function getProcessInstance(
  instanceId: string
): Promise<BusinessProcessInstance | null> {
  const db = getDb();
  
  const instance = await db
    .select()
    .from(processInstances)
    .where(eq(processInstances.id, instanceId))
    .get();

  if (!instance) return null;

  const { definition } = await getActiveBusinessProcessDefinition();

  // Rebuild the full instance (in production, store full state in DB)
  const currentStep = getStepByKey(definition, instance.currentStepKey || '');

  return {
    id: instance.id,
    processDefinitionId: instance.processDefinitionId,
    processDefinitionKey: MEGICODE_BUSINESS_PROCESS_KEY,
    processDefinitionVersion: 1,
    projectId: instance.projectId,
    status: instance.status as ProcessInstanceStatus,
    currentStepKey: instance.currentStepKey || '',
    currentLane: currentStep?.lane || 'Client',
    stepInstances: [], // Would be loaded from separate table in production
    processData: {},
    startedAt: instance.startedAt,
    completedAt: instance.endedAt || undefined,
  };
}

export async function getProcessInstancesByLead(
  leadId: string
): Promise<BusinessProcessInstance[]> {
  const db = getDb();
  
  // Get all instances linked to this lead via projects
  const projectsWithLead = await db
    .select()
    .from(projects)
    .where(eq(projects.leadId, leadId))
    .all();

  const instances: BusinessProcessInstance[] = [];
  
  for (const project of projectsWithLead) {
    const projectInstances = await db
      .select()
      .from(processInstances)
      .where(eq(processInstances.projectId, project.id))
      .all();
    
    for (const inst of projectInstances) {
      const full = await getProcessInstance(inst.id);
      if (full) instances.push(full);
    }
  }

  return instances;
}

// =====================
// STEP EXECUTION
// =====================

export async function executeStep(
  instanceId: string,
  stepKey: string,
  params: {
    completedByUserId?: string;
    outputData?: Record<string, any>;
    gatewayDecision?: string;
    notes?: string;
  }
): Promise<{ success: boolean; nextStepKey?: string; error?: string }> {
  const db = getDb();
  const { definition } = await getActiveBusinessProcessDefinition();
  
  const step = getStepByKey(definition, stepKey);
  if (!step) {
    return { success: false, error: 'Step not found' };
  }

  const instance = await getProcessInstance(instanceId);
  if (!instance) {
    return { success: false, error: 'Instance not found' };
  }

  const now = new Date();

  // Execute automation if applicable
  if (step.automationAction) {
    try {
      await executeAutomationAction(step.automationAction, instance, params.outputData || {});
    } catch (error) {
      await logProcessEvent({
        processInstanceId: instanceId,
        eventType: 'automation.completed',
        stepKey,
        data: { error: String(error), success: false },
      });
      return { success: false, error: `Automation failed: ${error}` };
    }
  }

  // Log step completion
  await logProcessEvent({
    processInstanceId: instanceId,
    eventType: 'step.completed',
    stepKey,
    actorUserId: params.completedByUserId,
    data: params.outputData,
  });

  // Determine next step
  const processData = { ...instance.processData, ...params.outputData };
  const nextSteps = getNextSteps(definition, stepKey, processData);
  
  if (nextSteps.length === 0) {
    // End of process
    await db
      .update(processInstances)
      .set({
        status: 'completed',
        endedAt: now,
      })
      .where(eq(processInstances.id, instanceId));

    await logProcessEvent({
      processInstanceId: instanceId,
      eventType: 'process.completed',
      data: { completedAt: now },
    });

    return { success: true };
  }

  const nextStepKey = nextSteps[0];
  const nextStep = getStepByKey(definition, nextStepKey);

  // Update current step
  await db
    .update(processInstances)
    .set({
      currentStepKey: nextStepKey,
    })
    .where(eq(processInstances.id, instanceId));

  await logProcessEvent({
    processInstanceId: instanceId,
    eventType: 'step.started',
    stepKey: nextStepKey,
    data: { previousStep: stepKey },
  });

  // If next step is automated, execute it immediately
  if (nextStep && nextStep.automationAction && !nextStep.isManual) {
    return executeStep(instanceId, nextStepKey, {
      outputData: processData,
    });
  }

  return { success: true, nextStepKey };
}

// =====================
// AUTOMATION ACTIONS
// =====================

async function executeAutomationAction(
  action: AutomationAction,
  instance: BusinessProcessInstance,
  data: Record<string, any>
): Promise<void> {
  const db = getDb();
  const now = new Date();

  switch (action) {
    case 'create_lead_record': {
      // Lead is already created when process starts
      // Update lead status to in_review
      if (instance.leadId) {
        await db
          .update(leads)
          .set({ status: 'in_review', updatedAt: now })
          .where(eq(leads.id, instance.leadId));
      }
      break;
    }

    case 'assign_lead_score': {
      // Simple scoring algorithm (can be enhanced with AI)
      let score = 50; // Base score
      const processData = instance.processData;

      // Score based on data completeness
      if (processData.leadEmail) score += 10;
      if (processData.leadCompany) score += 15;
      if (processData.leadPhone) score += 10;
      if (processData.leadMessage && processData.leadMessage.length > 50) score += 15;
      
      // Could add more sophisticated scoring here
      
      // Update process data with score
      instance.processData.leadScore = score;
      break;
    }

    case 'trigger_nurture_sequence': {
      // Create event for nurture sequence trigger
      await db.insert(events).values({
        id: crypto.randomUUID(),
        leadId: instance.leadId || null,
        instanceId: instance.id,
        type: 'automation.nurture_triggered',
        payloadJson: { triggeredAt: now },
        createdAt: now,
      });
      break;
    }

    case 'create_followup_task': {
      // Create a task for the business developer
      await db.insert(tasks).values({
        id: crypto.randomUUID(),
        instanceId: instance.id,
        key: 'followup_lead',
        title: `Follow up with lead: ${instance.processData.leadName || 'Unknown'}`,
        description: 'Review lead information and schedule discovery call',
        priority: 'high',
        status: 'todo',
        projectId: instance.projectId || null,
        createdAt: now,
        updatedAt: now,
      });
      break;
    }

    case 'generate_followup_email': {
      // Generate email content (could integrate with AI)
      const emailContent = generateFollowUpEmailContent(instance.processData);
      instance.processData.generatedEmailContent = emailContent;
      break;
    }

    case 'send_followup_email': {
      // Log email sending (actual email integration would go here)
      await db.insert(events).values({
        id: crypto.randomUUID(),
        leadId: instance.leadId || null,
        instanceId: instance.id,
        type: 'email.followup_sent',
        payloadJson: {
          to: instance.processData.leadEmail,
          sentAt: now,
        },
        createdAt: now,
      });
      break;
    }

    case 'trigger_onboarding': {
      // Update lead to converted status
      if (instance.leadId) {
        await db
          .update(leads)
          .set({ status: 'converted', updatedAt: now })
          .where(eq(leads.id, instance.leadId));
      }

      instance.processData.onboardingStartedAt = now;
      break;
    }

    case 'send_welcome_email': {
      // Log welcome email
      await db.insert(events).values({
        id: crypto.randomUUID(),
        leadId: instance.leadId || null,
        projectId: instance.projectId || null,
        instanceId: instance.id,
        type: 'email.welcome_sent',
        payloadJson: { sentAt: now },
        createdAt: now,
      });

      instance.processData.welcomeEmailSentAt = now;
      break;
    }

    case 'share_onboarding_docs': {
      instance.processData.onboardingDocsSharedAt = now;
      break;
    }

    case 'generate_project_summary': {
      instance.processData.projectSummaryGeneratedAt = now;
      break;
    }

    case 'create_project_workspace': {
      // Create the project if not exists
      if (!instance.projectId && instance.leadId) {
        const lead = await db
          .select()
          .from(leads)
          .where(eq(leads.id, instance.leadId))
          .get();

        if (lead) {
          const projectId = crypto.randomUUID();
          await db.insert(projects).values({
            id: projectId,
            leadId: instance.leadId,
            clientId: instance.clientId || null,
            name: instance.processData.projectName || `Project for ${lead.name}`,
            description: instance.processData.requirements?.join('\n') || lead.message || '',
            status: 'new',
            priority: 'high',
            wikiUrl: instance.processData.srsUrl || lead.srsUrl || null,
            createdAt: now,
            updatedAt: now,
          });

          // Update process instance with project ID
          await db
            .update(processInstances)
            .set({ projectId })
            .where(eq(processInstances.id, instance.id));

          instance.projectId = projectId;
          instance.processData.projectId = projectId;
        }
      }
      break;
    }

    case 'assign_project_team': {
      instance.processData.teamAssignedAt = now;
      break;
    }

    case 'schedule_kickoff_meeting': {
      // Could integrate with calendar API
      instance.processData.kickoffMeetingScheduledAt = now;
      break;
    }

    case 'transfer_srs_url': {
      // Transfer SRS URL from lead to project
      if (instance.projectId && instance.processData.srsUrl) {
        await db
          .update(projects)
          .set({
            wikiUrl: instance.processData.srsUrl,
            updatedAt: now,
          })
          .where(eq(projects.id, instance.projectId));
      }
      break;
    }

    default:
      console.warn(`Unknown automation action: ${action}`);
  }
}

function generateFollowUpEmailContent(processData: ProcessDataContext): string {
  const name = processData.leadName || 'there';
  const company = processData.leadCompany ? ` at ${processData.leadCompany}` : '';
  
  return `
Hi ${name}${company},

Thank you for reaching out to Megicode! We received your inquiry and are excited to learn more about your project.

Based on your initial message, it seems like we could be a great fit for your needs. Our team specializes in building high-quality software solutions tailored to your specific requirements.

I'd love to schedule a brief discovery call to:
- Understand your project requirements in detail
- Discuss your timeline and budget expectations
- Share how we've helped similar clients succeed

Would you be available for a 30-minute call this week? Please let me know your preferred times, or feel free to use our scheduling link.

Looking forward to connecting!

Best regards,
The Megicode Team
  `.trim();
}

// =====================
// EVENT LOGGING
// =====================

async function logProcessEvent(params: {
  processInstanceId: string;
  eventType: ProcessEventType;
  stepKey?: string;
  actorUserId?: string;
  data?: Record<string, any>;
}): Promise<void> {
  const db = getDb();
  const now = new Date();

  await db.insert(events).values({
    id: crypto.randomUUID(),
    instanceId: params.processInstanceId,
    type: params.eventType,
    actorUserId: params.actorUserId || null,
    payloadJson: {
      stepKey: params.stepKey,
      ...params.data,
    },
    createdAt: now,
  });
}

// =====================
// INTEGRATION HELPERS
// =====================

/**
 * Start a process from a new lead submission
 */
export async function startProcessFromLead(
  leadId: string,
  userId?: string
): Promise<BusinessProcessInstance> {
  const db = getDb();
  
  const lead = await db
    .select()
    .from(leads)
    .where(eq(leads.id, leadId))
    .get();

  if (!lead) {
    throw new Error('Lead not found');
  }

  return createProcessInstance({
    leadId,
    createdByUserId: userId,
    initialData: {
      leadName: lead.name,
      leadEmail: lead.email || undefined,
      leadCompany: lead.company || undefined,
      leadPhone: lead.phone || undefined,
      leadMessage: lead.message || undefined,
      leadSource: lead.source,
      srsUrl: lead.srsUrl || undefined,
    },
  });
}

/**
 * Advance process when proposal is accepted
 */
export async function advanceProcessOnProposalAccepted(
  proposalId: string,
  userId?: string
): Promise<void> {
  const db = getDb();
  
  const proposal = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, proposalId))
    .get();

  if (!proposal || !proposal.leadId) return;

  const instances = await getProcessInstancesByLead(proposal.leadId);
  
  for (const instance of instances) {
    if (instance.status === 'running' && 
        instance.currentStepKey === 'client_accept_proposal_gateway') {
      await executeStep(instance.id, instance.currentStepKey, {
        completedByUserId: userId,
        outputData: { proposalStatus: 'accepted' },
        gatewayDecision: 'Yes',
      });
    }
  }
}

/**
 * Get process analytics
 */
export async function getProcessAnalytics(): Promise<{
  totalInstances: number;
  runningInstances: number;
  completedInstances: number;
  averageCompletionDays: number;
  stepBreakdown: Record<string, number>;
}> {
  const db = getDb();
  
  const allInstances = await db
    .select()
    .from(processInstances)
    .all();

  const running = allInstances.filter(i => i.status === 'running');
  const completed = allInstances.filter(i => i.status === 'completed');

  // Calculate average completion time
  let totalDays = 0;
  let countWithEndDate = 0;
  
  for (const inst of completed) {
    if (inst.endedAt && inst.startedAt) {
      const days = (inst.endedAt.getTime() - inst.startedAt.getTime()) / (1000 * 60 * 60 * 24);
      totalDays += days;
      countWithEndDate++;
    }
  }

  // Step breakdown for running instances
  const stepBreakdown: Record<string, number> = {};
  for (const inst of running) {
    const stepKey = inst.currentStepKey || 'unknown';
    stepBreakdown[stepKey] = (stepBreakdown[stepKey] || 0) + 1;
  }

  return {
    totalInstances: allInstances.length,
    runningInstances: running.length,
    completedInstances: completed.length,
    averageCompletionDays: countWithEndDate > 0 ? Math.round(totalDays / countWithEndDate) : 0,
    stepBreakdown,
  };
}
