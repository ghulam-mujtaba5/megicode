export type TechStack = string[];
export type RequirementsList = string[];

// Legacy process definition format (simple workflows)
export type LegacyProcessDefinition = {
  steps: Array<{
    key: string;
    title: string;
    type?: 'task' | 'approval' | 'notification';
    assigneeRole?: string;
    recommendedRole?: string; // Used in some existing code
    next?: string;
  }>;
};

// Full business process definition format (BPMN-compatible)
export type BusinessProcessDefinitionJson = {
  key: string;
  name: string;
  version: number;
  description: string;
  lanes: string[];
  steps: Array<{
    key: string;
    lane: string;
    type: string;
    title: string;
    description?: string;
    nextSteps: string[];
    gatewayConditions?: Array<{
      condition: string;
      targetStepKey: string;
    }>;
    automations?: Array<{
      action: string;
      params?: Record<string, unknown>;
    }>;
    estimatedDurationMinutes?: number;
    requiredApprovals?: number;
    isOptional?: boolean;
  }>;
  triggerEvents: string[];
  outputKeys: string[];
};

// Union type for database storage (supports both formats)
export type ProcessDefinitionJson = LegacyProcessDefinition | BusinessProcessDefinitionJson;

export type AuditPayload = Record<string, any>;

export type ChecklistItem = { 
  label: string; 
  checked: boolean;
};
export type ChecklistItems = ChecklistItem[];

