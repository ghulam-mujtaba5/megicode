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
  | 'project_manager';

export type ProcessLane = 
  | 'Client'
  | 'BusinessDevelopment'
  | 'AutomationCRM'
  | 'ProjectManagement';

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

export const MEGICODE_BUSINESS_PROCESS_KEY = 'megicode_client_onboarding';

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
      // ============ CLIENT LANE ============
      {
        key: 'start_lead_submission',
        title: 'Start Lead Submission',
        type: 'start_event',
        lane: 'Client',
        participant: 'client',
        description: 'Client initiates contact through website',
        nextSteps: ['submit_contact_form'],
      },
      {
        key: 'submit_contact_form',
        title: 'Submit Contact Form',
        type: 'task',
        lane: 'Client',
        participant: 'client',
        isManual: true,
        description: 'Client fills and submits the contact form',
        nextSteps: ['receive_lead_submission'],
        estimatedMinutes: 5,
      },
      {
        key: 'attend_discovery_call',
        title: 'Attend Discovery Call',
        type: 'task',
        lane: 'Client',
        participant: 'client',
        isManual: true,
        description: 'Client participates in discovery call',
        estimatedMinutes: 60,
        nextSteps: ['gather_client_requirements'],
      },
      {
        key: 'review_proposal_client',
        title: 'Review Proposal',
        type: 'task',
        lane: 'Client',
        participant: 'client',
        isManual: true,
        description: 'Client reviews the proposal document',
        estimatedMinutes: 30,
        nextSteps: ['client_accept_proposal_gateway'],
      },
      {
        key: 'client_accept_proposal_gateway',
        title: 'Client Accept Proposal?',
        type: 'gateway',
        lane: 'Client',
        participant: 'client',
        gatewayType: 'exclusive',
        gatewayConditions: [
          {
            label: 'Yes',
            targetStepKey: 'sign_contract_client',
            condition: { field: 'proposalStatus', operator: 'equals', value: 'accepted' },
          },
          {
            label: 'No',
            targetStepKey: 'request_revision_client',
            isDefault: true,
          },
        ],
      },
      {
        key: 'sign_contract_client',
        title: 'Sign Contract',
        type: 'task',
        lane: 'Client',
        participant: 'client',
        isManual: true,
        description: 'Client signs the contract/agreement',
        estimatedMinutes: 15,
        nextSteps: ['receive_signed_contract'],
      },
      {
        key: 'request_revision_client',
        title: 'Request Revision',
        type: 'task',
        lane: 'Client',
        participant: 'client',
        isManual: true,
        description: 'Client requests revisions to the proposal',
        estimatedMinutes: 10,
        nextSteps: ['prepare_proposal_draft'],
      },
      {
        key: 'end_onboarded_client',
        title: 'Client Onboarded',
        type: 'end_event',
        lane: 'Client',
        participant: 'client',
        description: 'Client successfully onboarded',
      },

      // ============ BUSINESS DEVELOPMENT - LEAD INTAKE SYSTEM ============
      {
        key: 'receive_lead_submission',
        title: 'Receive Lead Submission',
        type: 'catch_event',
        lane: 'BusinessDevelopment',
        participant: 'lead_intake_system',
        description: 'System receives the contact form submission',
        nextSteps: ['create_lead_record'],
      },
      {
        key: 'create_lead_record',
        title: 'Create Lead Record',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'lead_intake_system',
        isManual: false,
        automationAction: 'create_lead_record',
        description: 'Automatically create lead record in CRM',
        estimatedMinutes: 0,
        nextSteps: ['assign_lead_score'],
      },
      {
        key: 'assign_lead_score',
        title: 'Assign Lead Score',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'lead_intake_system',
        isManual: false,
        automationAction: 'assign_lead_score',
        description: 'AI-powered lead scoring based on criteria',
        estimatedMinutes: 0,
        nextSteps: ['lead_score_gateway'],
      },
      {
        key: 'lead_score_gateway',
        title: 'Lead Score Qualified?',
        type: 'gateway',
        lane: 'BusinessDevelopment',
        participant: 'lead_intake_system',
        gatewayType: 'exclusive',
        gatewayConditions: [
          {
            label: 'Yes (Score >= 70)',
            targetStepKey: 'generate_followup_email',
            condition: { field: 'leadScore', operator: 'greater_than', value: 69 },
          },
          {
            label: 'No (Score < 70)',
            targetStepKey: 'trigger_nurture_sequence',
            isDefault: true,
          },
        ],
      },
      {
        key: 'trigger_nurture_sequence',
        title: 'Trigger Nurture Email Sequence',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'lead_intake_system',
        isManual: false,
        automationAction: 'trigger_nurture_sequence',
        description: 'Add lead to automated nurture email campaign',
        estimatedMinutes: 0,
        nextSteps: ['end_nurture_pipeline'],
      },
      {
        key: 'end_nurture_pipeline',
        title: 'End (Nurture Pipeline)',
        type: 'end_event',
        lane: 'BusinessDevelopment',
        participant: 'lead_intake_system',
        description: 'Lead moved to nurture pipeline',
      },
      {
        key: 'create_followup_task',
        title: 'Create Follow-up Task',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'lead_intake_system',
        isManual: false,
        automationAction: 'create_followup_task',
        description: 'Create task for BD to review lead',
        estimatedMinutes: 0,
        nextSteps: ['review_lead_information'],
      },

      // ============ BUSINESS DEVELOPMENT - BUSINESS DEVELOPER ============
      {
        key: 'review_lead_information',
        title: 'Review Lead Information',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'business_developer',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Business developer reviews lead details',
        estimatedMinutes: 15,
        nextSteps: ['schedule_discovery_call'],
      },
      {
        key: 'schedule_discovery_call',
        title: 'Schedule Discovery Call',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'business_developer',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Schedule discovery call with client',
        estimatedMinutes: 10,
        nextSteps: ['attend_discovery_call'],
      },
      {
        key: 'gather_client_requirements',
        title: 'Gather Client Requirements',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'business_developer',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Document requirements from discovery call',
        estimatedMinutes: 30,
        nextSteps: ['prepare_proposal_draft'],
      },
      {
        key: 'prepare_proposal_draft',
        title: 'Prepare Proposal Draft',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'business_developer',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Create initial proposal document',
        estimatedMinutes: 120,
        nextSteps: ['proposal_approval_gateway'],
      },
      {
        key: 'proposal_approval_gateway',
        title: 'Proposal Approved?',
        type: 'gateway',
        lane: 'BusinessDevelopment',
        participant: 'business_developer',
        gatewayType: 'exclusive',
        gatewayConditions: [
          {
            label: 'Yes',
            targetStepKey: 'send_proposal_to_client',
            condition: { field: 'proposalStatus', operator: 'equals', value: 'approved' },
          },
          {
            label: 'No',
            targetStepKey: 'modify_proposal',
            isDefault: true,
          },
        ],
      },
      {
        key: 'modify_proposal',
        title: 'Modify Proposal',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'business_developer',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Revise proposal based on feedback',
        estimatedMinutes: 60,
        nextSteps: ['proposal_approval_gateway'],
      },
      {
        key: 'send_proposal_to_client',
        title: 'Send Proposal to Client',
        type: 'task',
        lane: 'BusinessDevelopment',
        participant: 'business_developer',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Email proposal document to client',
        estimatedMinutes: 5,
        nextSteps: ['review_proposal_client'],
      },

      // ============ AUTOMATION/CRM - AI ASSISTANT ============
      {
        key: 'generate_followup_email',
        title: 'Generate Follow-up Email',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'ai_assistant',
        isManual: false,
        automationAction: 'generate_followup_email',
        description: 'AI generates personalized follow-up email',
        estimatedMinutes: 0,
        nextSteps: ['send_followup_email'],
      },
      {
        key: 'send_followup_email',
        title: 'Send Follow-up Email',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'ai_assistant',
        isManual: false,
        automationAction: 'send_followup_email',
        description: 'Automated email sent to lead',
        estimatedMinutes: 0,
        nextSteps: ['create_followup_task'],
      },
      {
        key: 'send_welcome_email',
        title: 'Send Welcome Email',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'ai_assistant',
        isManual: false,
        automationAction: 'send_welcome_email',
        description: 'Send onboarding welcome email to new client',
        estimatedMinutes: 0,
        nextSteps: ['share_onboarding_docs'],
      },
      {
        key: 'share_onboarding_docs',
        title: 'Share Onboarding Documentation',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'ai_assistant',
        isManual: false,
        automationAction: 'share_onboarding_docs',
        description: 'Share project onboarding materials',
        estimatedMinutes: 0,
        nextSteps: ['generate_project_summary'],
      },
      {
        key: 'generate_project_summary',
        title: 'Generate Project Summary',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'ai_assistant',
        isManual: false,
        automationAction: 'generate_project_summary',
        description: 'AI generates project summary document',
        estimatedMinutes: 0,
        nextSteps: ['create_project_workspace'],
      },

      // ============ AUTOMATION/CRM - CRM SYSTEM ============
      {
        key: 'receive_signed_contract',
        title: 'Receive Signed Contract',
        type: 'catch_event',
        lane: 'AutomationCRM',
        participant: 'crm_system',
        description: 'CRM receives the signed contract',
        nextSteps: ['trigger_onboarding_automation'],
      },
      {
        key: 'trigger_onboarding_automation',
        title: 'Trigger Onboarding Automation',
        type: 'task',
        lane: 'AutomationCRM',
        participant: 'crm_system',
        isManual: false,
        automationAction: 'trigger_onboarding',
        description: 'Start automated onboarding workflow',
        estimatedMinutes: 0,
        nextSteps: ['send_welcome_email'],
      },

      // ============ PROJECT MANAGEMENT ============
      {
        key: 'create_project_workspace',
        title: 'Create Project Workspace',
        type: 'task',
        lane: 'ProjectManagement',
        participant: 'project_manager',
        isManual: false,
        automationAction: 'create_project_workspace',
        recommendedRole: 'pm',
        description: 'Set up project in PM tool with SRS URL',
        estimatedMinutes: 0,
        nextSteps: ['assign_project_team'],
      },
      {
        key: 'assign_project_team',
        title: 'Assign Project Team',
        type: 'task',
        lane: 'ProjectManagement',
        participant: 'project_manager',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Assign team members to project',
        estimatedMinutes: 30,
        nextSteps: ['schedule_kickoff_meeting'],
      },
      {
        key: 'schedule_kickoff_meeting',
        title: 'Schedule Kickoff Meeting',
        type: 'task',
        lane: 'ProjectManagement',
        participant: 'project_manager',
        isManual: true,
        recommendedRole: 'pm',
        description: 'Schedule and send kickoff meeting invite',
        estimatedMinutes: 15,
        nextSteps: ['end_onboarded_client'],
      },
    ],
    messages: [
      {
        key: 'msg_lead_submission',
        fromStep: 'submit_contact_form',
        toStep: 'receive_lead_submission',
        label: 'Lead Submission',
        dataTransfer: ['leadName', 'leadEmail', 'leadCompany', 'leadPhone', 'leadMessage'],
      },
      {
        key: 'msg_discovery_invite',
        fromStep: 'schedule_discovery_call',
        toStep: 'attend_discovery_call',
        label: 'Discovery Call Invite',
        dataTransfer: ['discoveryCallScheduledAt'],
      },
      {
        key: 'msg_proposal',
        fromStep: 'send_proposal_to_client',
        toStep: 'review_proposal_client',
        label: 'Proposal',
        dataTransfer: ['proposalTitle', 'proposalAmount'],
      },
      {
        key: 'msg_revision_request',
        fromStep: 'request_revision_client',
        toStep: 'prepare_proposal_draft',
        label: 'Revision Request',
        dataTransfer: ['revisionNotes'],
      },
      {
        key: 'msg_signed_contract',
        fromStep: 'sign_contract_client',
        toStep: 'receive_signed_contract',
        label: 'Signed Contract',
        dataTransfer: ['contractSignedAt', 'contractUrl'],
      },
      {
        key: 'msg_project_summary',
        fromStep: 'generate_project_summary',
        toStep: 'create_project_workspace',
        label: 'Project Summary',
        dataTransfer: ['projectName', 'srsUrl', 'requirements'],
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
  };
  return labels[participant];
}
