/**
 * Camunda Platform 8 (Zeebe) Type Definitions
 * For use with zeebe-node client
 */

export interface ProcessInstance {
  processInstanceKey: string;
  processDefinitionKey: string;
  bpmnProcessId: string;
  version: number;
  variables: Record<string, any>;
}

export interface ProcessDefinition {
  processDefinitionKey: string;
  bpmnProcessId: string;
  version: number;
  resourceName: string;
}

export interface Task {
  key: string;
  type: string;
  processInstanceKey: string;
  bpmnProcessId: string;
  processDefinitionKey: string;
  elementId: string;
  elementInstanceKey: string;
  customHeaders: Record<string, string>;
  worker: string;
  retries: number;
  deadline: string;
  variables: Record<string, any>;
}

export interface TaskHandler {
  (job: Task): Promise<void>;
}

export interface CompleteTaskRequest {
  jobKey: string;
  variables?: Record<string, any>;
}

export interface FailTaskRequest {
  jobKey: string;
  retries?: number;
  errorMessage?: string;
  retryBackoff?: number;
}

export interface StartProcessInstanceRequest {
  bpmnProcessId: string;
  variables?: Record<string, any>;
  version?: number;
}

export interface DeployResourceRequest {
  resources: Array<{
    name: string;
    content: Buffer;
  }>;
}

export interface CamundaConfig {
  zeebeGatewayAddress: string;
  clientId?: string;
  clientSecret?: string;
  clusterId?: string;
  region?: string;
  oAuthUrl?: string;
}

export interface WorkerConfig {
  taskType: string;
  handler: TaskHandler;
  maxJobsToActivate?: number;
  timeout?: number;
  pollInterval?: number;
  requestTimeout?: number;
}

// Process-specific variable types
export interface LeadVariables {
  leadId: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message?: string;
  source: string;
  leadScore?: number;
  srsDocument?: string;
  budgetEstimate?: number;
  timelineEstimate?: string;
}

export interface ProjectVariables {
  projectId: string;
  leadId?: string;
  clientId: string;
  name: string;
  description?: string;
  techStack?: string[];
  status: 'new' | 'in_progress' | 'in_qa' | 'delivered' | 'blocked';
  startDate?: string;
  dueDate?: string;
  budget?: number;
  actualHours?: number;
}

export interface TaskVariables {
  taskId: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  estimatedHours?: number;
  actualHours?: number;
}

export interface EmailVariables {
  to: string;
  subject: string;
  body: string;
  template?: string;
  attachments?: string[];
}

export interface NotificationVariables {
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  link?: string;
}
