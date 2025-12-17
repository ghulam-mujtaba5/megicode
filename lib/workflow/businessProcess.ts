/**
 * Business Process Engine - Megicode Internal Portal
 * 
 * Implements the full client onboarding and project lifecycle workflow:
 * 
 * PARTICIPANTS:
 * - Client (WebsiteVisitorClient)
 * - BusinessDevelopment (LeadIntakeSystem, BusinessDeveloperAzan)
 * - AutomationCRM (AIAssistant, CRMSystem)
 * - ProjectManagement (ProjectManager)
 * 
 * PROCESS FLOW:
 * 1. Lead Submission → Lead Record Creation → Lead Scoring
 * 2. If score qualifies → Follow-up emails → Review → Schedule Discovery
 * 3. Discovery Call → Gather Requirements → Proposal Draft
 * 4. Proposal Approval Gateway → Send to Client / Modify
 * 5. Client Review → Accept/Decline Gateway
 * 6. Contract Signing → Onboarding Automation
 * 7. Project Setup → Assign Team → Kickoff Meeting
 */

import type { UserRole } from '@/lib/db/schema';

// =====================
// PROCESS PARTICIPANT TYPES
// =====================

export type ProcessParticipant = 
  | 'client'
  | 'lead_intake_system'
  | 'business_developer'
  | 'ai_assistant'
  | 'crm_system'
  | 'project_manager'
  | 'developer';

export type ProcessLane = 
  | 'Client'
  | 'BusinessDevelopment'
  | 'AutomationCRM'
  | 'ProjectManagement'
  | 'Development';

// Lane type alias for components
export interface Lane {
  key: ProcessLane;
  displayName: string;
  participant: string;
}

// =====================
// STEP TYPES
// =====================

export type StepType = 
  | 'start_event'
  | 'end_event'
  | 'task'
  | 'gateway'
  | 'catch_event' // Message catch events
  | 'send_event';  // Message send events

export type GatewayType = 'exclusive' | 'parallel' | 'inclusive';

export type AutomationAction = 
  | 'create_lead_record'
  | 'assign_lead_score'
  | 'trigger_nurture_sequence'
  | 'create_followup_task'
  | 'generate_followup_email'
  | 'send_followup_email'
  | 'trigger_onboarding'
  | 'send_welcome_email'
  | 'share_onboarding_docs'
  | 'generate_project_summary'
  | 'create_project_workspace'
  | 'assign_project_team'
  | 'schedule_kickoff_meeting'
  | 'transfer_srs_url';

// =====================
// BUSINESS PROCESS DEFINITION
// =====================

export interface BusinessProcessStep {
  key: string;
  title: string;
  type: StepType;
  lane: ProcessLane;
  participant: ProcessParticipant;
  description?: string;
  recommendedRole?: UserRole;
  assigneeRole?: string; // Alternative to recommendedRole
  next?: string; // Single next step (alternative to nextSteps array)
  automationAction?: AutomationAction;
  gatewayType?: GatewayType;
  gatewayConditions?: GatewayCondition[];
  nextSteps?: string[]; // For non-gateway steps
  isManual?: boolean; // Requires human action
  estimatedMinutes?: number;
  expectedDurationMinutes?: number; // Alias for estimatedMinutes
  metadata?: Record<string, any>;
}

export interface GatewayCondition {
  label: string;
  targetStepKey: string;
  condition?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
    value: any;
  };
  isDefault?: boolean;
}

export interface BusinessProcessMessage {
  key: string;
  fromStep: string;
  toStep: string;
  label: string;
  dataTransfer?: string[]; // Fields to transfer
}

export interface BusinessProcessDefinition {
  key: string;
  version: number;
  name: string;
  description: string;
  steps: BusinessProcessStep[];
  messages: BusinessProcessMessage[];
  lanes: ProcessLane[];
  participants: ProcessParticipant[];
  createdAt: Date;
}

// =====================
// PROCESS INSTANCE (RUNTIME)
// =====================

export type ProcessInstanceStatus = 
  | 'pending'
  | 'running'
  | 'waiting_input'
  | 'completed'
  | 'canceled'
  | 'error';

export type StepInstanceStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'skipped'
  | 'failed';

export interface ProcessStepInstance {
  stepKey: string;
  status: StepInstanceStatus;
  startedAt?: Date;
  completedAt?: Date;
  assignedToUserId?: string;
  completedByUserId?: string;
  notes?: string;
  outputData?: Record<string, any>;
  gatewayDecision?: string; // Which path was taken
}

export interface BusinessProcessInstance {
  id: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  processDefinitionVersion: number;
  
  // Linked entities
  leadId?: string;
  proposalId?: string;
  projectId?: string;
  clientId?: string;
  
  status: ProcessInstanceStatus;
  currentStepKey: string;
  currentLane: ProcessLane;
  
  stepInstances: ProcessStepInstance[];
  
  // Process data context
  processData: ProcessDataContext;
  
  startedAt: Date;
  completedAt?: Date;
  canceledAt?: Date;
  canceledReason?: string;
  
  createdByUserId?: string;
}

export interface ProcessDataContext {
  // Lead Data
  leadName?: string;
  leadEmail?: string;
  leadCompany?: string;
  leadPhone?: string;
  leadMessage?: string;
  leadScore?: number;
  leadSource?: string;
  
  // Discovery/Requirements
  discoveryCallScheduledAt?: Date;
  discoveryCallNotes?: string;
  requirements?: string[];
  srsUrl?: string;
  
  // Proposal Data
  proposalTitle?: string;
  proposalAmount?: number;
  proposalStatus?: string;
  proposalSentAt?: Date;
  proposalAcceptedAt?: Date;
  proposalDeclinedAt?: Date;
  revisionRequested?: boolean;
  revisionNotes?: string;
  
  // Contract Data
  contractSignedAt?: Date;
  contractUrl?: string;
  
  // Onboarding Data
  onboardingStartedAt?: Date;
  welcomeEmailSentAt?: Date;
  onboardingDocsSharedAt?: Date;
  projectSummaryGeneratedAt?: Date;
  
  // Project Data
  projectId?: string;
  projectName?: string;
  projectWorkspaceUrl?: string;
  teamAssignedAt?: Date;
  teamMemberIds?: string[];
  kickoffMeetingScheduledAt?: Date;
  
  // Custom fields
  [key: string]: any;
}

// =====================
// PROCESS EVENTS
// =====================

export type ProcessEventType =
  | 'process.started'
  | 'process.completed'
  | 'process.canceled'
  | 'process.error'
  | 'step.started'
  | 'step.completed'
  | 'step.failed'
  | 'gateway.evaluated'
  | 'message.sent'
  | 'message.received'
  | 'automation.triggered'
  | 'automation.completed'
  | 'data.updated';

export interface ProcessEvent {
  id: string;
  processInstanceId: string;
  eventType: ProcessEventType;
  stepKey?: string;
  actorUserId?: string;
  timestamp: Date;
  data?: Record<string, any>;
}

// =====================
// DEFAULT BUSINESS PROCESS DEFINITION
// =====================

export const MEGICODE_BUSINESS_PROCESS_KEY = 'megicode_software_delivery_v2';

export function getDefaultBusinessProcessDefinition(): BusinessProcessDefinition {
  return {
    key: MEGICODE_BUSINESS_PROCESS_KEY,
    version: 1,
    name: 'Megicode Client Onboarding & Project Lifecycle',
    description: 'Complete business process from lead submission to project kickoff',
    lanes: ['Client', 'BusinessDevelopment', 'AutomationCRM', 'ProjectManagement'],
    participants: [
      'client',
      'lead_intake_system',
      'business_developer',
      'ai_assistant',
      'crm_system',
      'project_manager',
    ],
    createdAt: new Date(),
    steps: [
      // 1. Client Submits Project Request (Start Event)
      {
        key: 'client_submit_request',
        title: 'Client Submits Project Request',
        type: 'start_event',
        lane: 'Client',
        participant: 'client',
        description: 'Client submits a new project request via the portal',
        nextSteps: ['crm_record_request'],
      },

      // 2. CRM Auto-Records Request [Automated]
      {
        key: 'crm_record_request',
        title: 'CRM Auto-Records Request',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'crm_system',
        isManual: false,
        automationAction: 'create_lead_record',
        description: 'System automatically records the request in CRM',
        estimatedMinutes: 0,
        nextSteps: ['pm_review_request'],
      },

      // 3. PM Reviews Request [User Task]
      {
        key: 'pm_review_request',
        title: 'PM Reviews Request',
        type: 'task',
        lane: 'ProjectManagement',
        participant: 'project_manager',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Project Manager reviews the incoming request',
        estimatedMinutes: 60,
        nextSteps: ['approval_gateway'],
      },

      // 4. Approval Gateway [Decision]
      {
        key: 'approval_gateway',
        title: 'Approval Gateway',
        type: 'gateway',
        lane: 'ProjectManagement',
        participant: 'project_manager',
        description: 'Decision to approve or reject the project request',
        gatewayType: 'exclusive',
        gatewayConditions: [
          {
            label: 'Approved',
            targetStepKey: 'create_project_workspace',
            condition: { field: 'approvalStatus', operator: 'equals', value: 'approved' },
          },
          {
            label: 'Rejected',
            targetStepKey: 'close_ticket', // Skip to end if rejected
            condition: { field: 'approvalStatus', operator: 'equals', value: 'rejected' },
            isDefault: true,
          },
        ],
      },

      // 5. Auto-Create Project Workspace [Automated]
      {
        key: 'create_project_workspace',
        title: 'Auto-Create Project Workspace',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'crm_system',
        isManual: false,
        automationAction: 'create_project_workspace',
        description: 'System creates project workspace and repositories',
        estimatedMinutes: 0,
        nextSteps: ['assign_developer'],
      },

      // 6. Assign Developer Based on Workload [User Task / Rule]
      {
        key: 'assign_developer',
        title: 'Assign Developer',
        type: 'task',
        lane: 'ProjectManagement',
        participant: 'project_manager',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Assign developer based on current workload',
        estimatedMinutes: 30,
        nextSteps: ['ai_requirement_clarification'],
      },

      // 7. AI Requirement Clarification [AI Task]
      {
        key: 'ai_requirement_clarification',
        title: 'AI Requirement Clarification',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'ai_assistant',
        isManual: false,
        automationAction: 'generate_project_summary', // Reusing existing action type
        description: 'AI analyzes requirements and suggests clarifications',
        estimatedMinutes: 5,
        nextSteps: ['development_subprocess'],
      },

      // 8. Development Subprocess [Sub-Process]
      {
        key: 'development_subprocess',
        title: 'Development & QA',
        type: 'task',
        lane: 'Development',
        participant: 'developer',
        isManual: true,
        recommendedRole: 'dev',
        description: 'Development and QA execution phase',
        estimatedMinutes: 2400, // 1 week placeholder
        nextSteps: ['weekly_status_email'],
      },

      // 9. Weekly Status Auto Email [Automated]
      {
        key: 'weekly_status_email',
        title: 'Weekly Status Auto Email',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'crm_system',
        isManual: false,
        automationAction: 'send_followup_email', // Reusing existing action type
        description: 'System sends automated weekly status update',
        estimatedMinutes: 0,
        nextSteps: ['final_review_deployment'],
      },

      // 10. Final Review & Deployment [User Task]
      {
        key: 'final_review_deployment',
        title: 'Final Review & Deployment',
        type: 'task',
        lane: 'ProjectManagement',
        participant: 'project_manager',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Final review and deployment to production',
        estimatedMinutes: 120,
        nextSteps: ['send_delivery_package'],
      },

      // 11. Auto-Send Delivery Package [Automated]
      {
        key: 'send_delivery_package',
        title: 'Auto-Send Delivery Package',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'crm_system',
        isManual: false,
        automationAction: 'share_onboarding_docs', // Reusing similar action
        description: 'System sends final delivery package to client',
        estimatedMinutes: 0,
        nextSteps: ['client_feedback'],
      },

      // 12. Client Feedback Collection [User Task]
      {
        key: 'client_feedback',
        title: 'Client Feedback Collection',
        type: 'task',
        lane: 'Client',
        participant: 'client',
        isManual: true,
        description: 'Client provides feedback on the delivery',
        estimatedMinutes: 1440, // 1 day
        nextSteps: ['close_ticket'],
      },

      // 13. Ticket Auto-Closed (End Event)
      {
        key: 'close_ticket',
        title: 'Ticket Auto-Closed',
        type: 'end_event',
        lane: 'AutomationCRM',
        participant: 'crm_system',
        description: 'Process completed and ticket closed',
      },
    ],
    messages: [
      {
        key: 'msg_project_request',
        fromStep: 'client_submit_request',
        toStep: 'crm_record_request',
        label: 'Project Request Data',
        dataTransfer: ['projectName', 'projectDescription', 'budget', 'timeline'],
      },
      {
        key: 'msg_request_review',
        fromStep: 'crm_record_request',
        toStep: 'pm_review_request',
        label: 'New Request Notification',
        dataTransfer: ['leadId', 'requestDetails'],
      },
      {
        key: 'msg_approval_notification',
        fromStep: 'approval_gateway',
        toStep: 'create_project_workspace',
        label: 'Project Approved',
        dataTransfer: ['approvalStatus', 'approvedBy'],
      },
      {
        key: 'msg_dev_assignment',
        fromStep: 'assign_developer',
        toStep: 'ai_requirement_clarification',
        label: 'Developer Assigned',
        dataTransfer: ['developerId', 'assignmentDate'],
      },
      {
        key: 'msg_clarification',
        fromStep: 'ai_requirement_clarification',
        toStep: 'development_subprocess',
        label: 'Requirements Clarified',
        dataTransfer: ['clarifiedRequirements', 'aiSuggestions'],
      },
      {
        key: 'msg_deployment_ready',
        fromStep: 'final_review_deployment',
        toStep: 'send_delivery_package',
        label: 'Ready for Delivery',
        dataTransfer: ['deploymentUrl', 'releaseNotes'],
      },
      {
        key: 'msg_delivery',
        fromStep: 'send_delivery_package',
        toStep: 'client_feedback',
        label: 'Delivery Package',
        dataTransfer: ['packageUrl', 'credentials'],
      },
      {
        key: 'msg_feedback',
        fromStep: 'client_feedback',
        toStep: 'close_ticket',
        label: 'Client Feedback',
        dataTransfer: ['feedbackRating', 'feedbackComments'],
      },
    ],
  };
}

// =====================
// STEP PROGRESSION HELPERS
// =====================

export function getNextSteps(
  definition: BusinessProcessDefinition,
  currentStepKey: string,
  processData: ProcessDataContext
): string[] {
  const step = definition.steps.find(s => s.key === currentStepKey);
  if (!step) return [];

  if (step.type === 'gateway' && step.gatewayConditions) {
    // Evaluate gateway conditions
    for (const condition of step.gatewayConditions) {
      if (!condition.condition) continue;
      
      const fieldValue = processData[condition.condition.field];
      let matches = false;

      switch (condition.condition.operator) {
        case 'equals':
          matches = fieldValue === condition.condition.value;
          break;
        case 'not_equals':
          matches = fieldValue !== condition.condition.value;
          break;
        case 'greater_than':
          matches = Number(fieldValue) > Number(condition.condition.value);
          break;
        case 'less_than':
          matches = Number(fieldValue) < Number(condition.condition.value);
          break;
        case 'contains':
          matches = String(fieldValue).includes(String(condition.condition.value));
          break;
      }

      if (matches) {
        return [condition.targetStepKey];
      }
    }

    // Find default path
    const defaultCondition = step.gatewayConditions.find(c => c.isDefault);
    if (defaultCondition) {
      return [defaultCondition.targetStepKey];
    }
  }

  return step.nextSteps || [];
}

export function getStepByKey(
  definition: BusinessProcessDefinition,
  stepKey: string
): BusinessProcessStep | undefined {
  return definition.steps.find(s => s.key === stepKey);
}

export function getStepsByLane(
  definition: BusinessProcessDefinition,
  lane: ProcessLane
): BusinessProcessStep[] {
  return definition.steps.filter(s => s.lane === lane);
}

export function getManualSteps(
  definition: BusinessProcessDefinition
): BusinessProcessStep[] {
  return definition.steps.filter(s => s.isManual);
}

export function getAutomationSteps(
  definition: BusinessProcessDefinition
): BusinessProcessStep[] {
  return definition.steps.filter(s => s.automationAction);
}

export function calculateProcessProgress(
  instance: BusinessProcessInstance,
  definition: BusinessProcessDefinition
): { completed: number; total: number; percentage: number } {
  const totalSteps = definition.steps.filter(
    s => s.type !== 'start_event' && s.type !== 'gateway'
  ).length;
  
  const completedSteps = instance.stepInstances.filter(
    si => si.status === 'completed'
  ).length;

  return {
    completed: completedSteps,
    total: totalSteps,
    percentage: Math.round((completedSteps / totalSteps) * 100),
  };
}

// =====================
// STATUS HELPERS
// =====================

export function getInstanceStatusLabel(status: ProcessInstanceStatus): string {
  const labels: Record<ProcessInstanceStatus, string> = {
    pending: 'Pending',
    running: 'In Progress',
    waiting_input: 'Waiting for Input',
    completed: 'Completed',
    canceled: 'Canceled',
    error: 'Error',
  };
  return labels[status];
}

export function getInstanceStatusColor(status: ProcessInstanceStatus): string {
  const colors: Record<ProcessInstanceStatus, string> = {
    pending: 'gray',
    running: 'blue',
    waiting_input: 'yellow',
    completed: 'green',
    canceled: 'red',
    error: 'red',
  };
  return colors[status];
}

export function getStepStatusLabel(status: StepInstanceStatus): string {
  const labels: Record<StepInstanceStatus, string> = {
    pending: 'Pending',
    active: 'In Progress',
    completed: 'Completed',
    skipped: 'Skipped',
    failed: 'Failed',
  };
  return labels[status];
}

export function getLaneLabel(lane: ProcessLane): string {
  const labels: Record<ProcessLane, string> = {
    Client: 'Client',
    BusinessDevelopment: 'Business Development',
    AutomationCRM: 'Automation & CRM',
    ProjectManagement: 'Project Management',
    Development: 'Development & QA',
  };
  return labels[lane];
}

export function getParticipantLabel(participant: ProcessParticipant): string {
  const labels: Record<ProcessParticipant, string> = {
    client: 'Client',
    lead_intake_system: 'Lead Intake System',
    business_developer: 'Business Developer',
    ai_assistant: 'AI Assistant',
    crm_system: 'CRM System',
    project_manager: 'Project Manager',
    developer: 'Developer',
  };
  return labels[participant];
}
