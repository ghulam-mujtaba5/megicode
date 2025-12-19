/**
 * Workflow Engine - Main Entry Point
 * 
 * This module exports all workflow-related functionality for the
 * Megicode Internal Portal business process management system.
 */

// Core Process Engine
export {
  getActiveBusinessProcessDefinition,
  createProcessInstance,
  getProcessInstance,
  getProcessInstancesByLead,
  executeStep,
  startProcessFromLead,
  advanceProcessOnProposalAccepted,
  getProcessAnalytics,
} from './processEngine';

// Business Process Types and Utilities
export {
  type BusinessProcessDefinition,
  type BusinessProcessStep,
  type BusinessProcessInstance,
  type ProcessDataContext,
  type ProcessInstanceStatus,
  type StepInstanceStatus,
  type ProcessStepInstance,
  type ProcessEvent,
  type ProcessEventType,
  type AutomationAction,
  type ProcessLane,
  type ProcessParticipant,
  type GatewayType,
  getNextSteps,
  getStepByKey,
  getStepsByLane,
  MEGICODE_BUSINESS_PROCESS_KEY,
  getDefaultBusinessProcessDefinition,
} from './businessProcess';

// SLA Monitoring
export {
  type SLARule,
  type SLAStatus,
  type ProcessSLASummary,
  type SLAAnalytics,
  getSLARuleForStep,
  calculateStepSLAStatus,
  getProcessSLASummary,
  checkAllSLABreaches,
  triggerSLAEscalation,
  runSLACheckJob,
  getSLAAnalytics,
  DEFAULT_SLA_RULES,
} from './slaMonitoring';

// Automation Rules
export {
  type AutomationTrigger,
  type AutomationActionType,
  type AutomationCondition,
  type AutomationRule,
  type AutomationExecutionContext,
  findMatchingRules,
  executeAutomationRules,
  triggerStepEnteredAutomation,
  triggerStepCompletedAutomation,
  triggerGatewayAutomation,
  DEFAULT_AUTOMATION_RULES,
} from './automationRules';

// Bottleneck Detection
export {
  type StepMetrics,
  type LaneMetrics,
  type ResourceUtilization,
  type BottleneckAnalysis,
  type OptimizationRecommendation,
  type ProcessFlowMetrics,
  getStepMetrics,
  getLaneMetrics,
  getResourceUtilization,
  runBottleneckAnalysis,
  getProcessFlowMetrics,
} from './bottleneckDetection';

// Step Assignment
export {
  type AssignmentStrategy,
  type AssignmentRule,
  type TeamMemberProfile,
  type AssignmentCandidate,
  type AssignmentResult,
  getTeamMemberProfiles,
  findBestAssignee,
  autoAssignStep,
  manuallyAssignStep,
  reassignStep,
  getTeamWorkloadOverview,
  DEFAULT_ASSIGNMENT_RULES,
} from './stepAssignment';

// Template System
export {
  type ProcessTemplate,
  type TemplateCategory,
  type TemplateCreateParams,
  getProcessTemplates,
  getTemplateByKey,
  createProcessTemplate,
  cloneTemplate,
  updateTemplateMetadata,
  createTemplateVersion,
  deleteTemplate,
  searchTemplates,
  ensureDefaultTemplates,
  DEFAULT_TEMPLATES,
} from './templateSystem';
