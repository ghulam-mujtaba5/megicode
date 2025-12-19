/**
 * Process Template System
 * 
 * Allows creation and management of reusable workflow templates for different project types.
 * 
 * Features:
 * - Create templates from existing process definitions
 * - Clone templates for customization
 * - Version management
 * - Template categories and tags
 * - Quick-start process creation from templates
 */

import { eq, and, desc, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { processDefinitions } from '@/lib/db/schema';
import type { BusinessProcessDefinition, BusinessProcessStep, ProcessLane } from './businessProcess';
import { getDefaultBusinessProcessDefinition, MEGICODE_BUSINESS_PROCESS_KEY } from './businessProcess';

// =====================
// TYPES
// =====================

export interface ProcessTemplate {
  id: string;
  key: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  version: number;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId?: string;
  definition: BusinessProcessDefinition;
  // Metadata
  estimatedDurationDays?: number;
  complexity: 'simple' | 'moderate' | 'complex';
  recommendedTeamSize?: number;
  usageCount: number;
}

export type TemplateCategory = 
  | 'software_development'
  | 'web_development'
  | 'mobile_development'
  | 'consulting'
  | 'design'
  | 'maintenance'
  | 'support'
  | 'custom';

export interface TemplateStepConfig {
  stepKey: string;
  enabled: boolean;
  customTitle?: string;
  customDescription?: string;
  slaDays?: number;
  assignToRole?: string;
  isOptional?: boolean;
}

export interface TemplateCreateParams {
  name: string;
  description: string;
  category: TemplateCategory;
  tags?: string[];
  complexity?: 'simple' | 'moderate' | 'complex';
  estimatedDurationDays?: number;
  recommendedTeamSize?: number;
  steps?: TemplateStepConfig[];
  createdByUserId?: string;
  baseTemplateKey?: string; // Clone from existing template
}

export interface TemplateUpdateParams {
  name?: string;
  description?: string;
  category?: TemplateCategory;
  tags?: string[];
  complexity?: 'simple' | 'moderate' | 'complex';
  estimatedDurationDays?: number;
  recommendedTeamSize?: number;
  isActive?: boolean;
  isDefault?: boolean;
}

// =====================
// DEFAULT TEMPLATES
// =====================

export const DEFAULT_TEMPLATES: Omit<ProcessTemplate, 'id' | 'createdAt' | 'updatedAt' | 'definition'>[] = [
  {
    key: 'megicode_standard',
    name: 'Megicode Standard Delivery',
    description: 'Standard software development process with full lifecycle from lead to delivery.',
    category: 'software_development',
    tags: ['standard', 'full-lifecycle', 'recommended'],
    version: 1,
    isActive: true,
    isDefault: true,
    estimatedDurationDays: 30,
    complexity: 'moderate',
    recommendedTeamSize: 3,
    usageCount: 0,
  },
  {
    key: 'quick_fix',
    name: 'Quick Fix / Bug Fix',
    description: 'Streamlined process for quick fixes and bug resolutions.',
    category: 'maintenance',
    tags: ['quick', 'bugfix', 'minimal'],
    version: 1,
    isActive: true,
    isDefault: false,
    estimatedDurationDays: 3,
    complexity: 'simple',
    recommendedTeamSize: 1,
    usageCount: 0,
  },
  {
    key: 'website_redesign',
    name: 'Website Redesign',
    description: 'Complete website redesign with design review, development, and content migration.',
    category: 'web_development',
    tags: ['website', 'redesign', 'frontend'],
    version: 1,
    isActive: true,
    isDefault: false,
    estimatedDurationDays: 45,
    complexity: 'complex',
    recommendedTeamSize: 4,
    usageCount: 0,
  },
  {
    key: 'mobile_app',
    name: 'Mobile App Development',
    description: 'Full mobile application development with iOS/Android considerations.',
    category: 'mobile_development',
    tags: ['mobile', 'app', 'ios', 'android'],
    version: 1,
    isActive: true,
    isDefault: false,
    estimatedDurationDays: 60,
    complexity: 'complex',
    recommendedTeamSize: 4,
    usageCount: 0,
  },
  {
    key: 'consulting_engagement',
    name: 'Consulting Engagement',
    description: 'Consulting project with discovery, analysis, and recommendations.',
    category: 'consulting',
    tags: ['consulting', 'analysis', 'advisory'],
    version: 1,
    isActive: true,
    isDefault: false,
    estimatedDurationDays: 14,
    complexity: 'moderate',
    recommendedTeamSize: 2,
    usageCount: 0,
  },
];

// =====================
// STEP CONFIGURATIONS FOR TEMPLATES
// =====================

const QUICK_FIX_STEPS: BusinessProcessStep[] = [
  {
    key: 'client_submit_request',
    title: 'Client Reports Issue',
    type: 'start_event',
    lane: 'Client',
    participant: 'client',
    description: 'Client submits a bug report or quick fix request',
    nextSteps: ['triage_review'],
  },
  {
    key: 'triage_review',
    title: 'Triage & Review',
    type: 'task',
    lane: 'ProjectManagement',
    participant: 'project_manager',
    isManual: true,
    recommendedRole: 'pm',
    description: 'Quick triage to assess severity and assign priority',
    estimatedMinutes: 30,
    nextSteps: ['quick_fix_development'],
  },
  {
    key: 'quick_fix_development',
    title: 'Apply Fix',
    type: 'task',
    lane: 'Development',
    participant: 'developer',
    isManual: true,
    recommendedRole: 'dev',
    description: 'Developer implements the fix',
    estimatedMinutes: 240,
    nextSteps: ['verification'],
  },
  {
    key: 'verification',
    title: 'Verify Fix',
    type: 'task',
    lane: 'ProjectManagement',
    participant: 'project_manager',
    isManual: true,
    recommendedRole: 'pm',
    description: 'Verify the fix works as expected',
    estimatedMinutes: 60,
    nextSteps: ['deploy_close'],
  },
  {
    key: 'deploy_close',
    title: 'Deploy & Close',
    type: 'end_event',
    lane: 'AutomationCRM',
    participant: 'crm_system',
    description: 'Deploy fix and close the ticket',
  },
];

const CONSULTING_STEPS: BusinessProcessStep[] = [
  {
    key: 'client_submit_request',
    title: 'Consulting Request',
    type: 'start_event',
    lane: 'Client',
    participant: 'client',
    description: 'Client requests consulting services',
    nextSteps: ['discovery_call'],
  },
  {
    key: 'discovery_call',
    title: 'Discovery Call',
    type: 'task',
    lane: 'BusinessDevelopment',
    participant: 'business_developer',
    isManual: true,
    recommendedRole: 'pm',
    description: 'Initial discovery call to understand needs',
    estimatedMinutes: 60,
    nextSteps: ['analysis_phase'],
  },
  {
    key: 'analysis_phase',
    title: 'Analysis & Research',
    type: 'task',
    lane: 'ProjectManagement',
    participant: 'project_manager',
    isManual: true,
    recommendedRole: 'pm',
    description: 'Conduct analysis and research',
    estimatedMinutes: 480,
    nextSteps: ['prepare_recommendations'],
  },
  {
    key: 'prepare_recommendations',
    title: 'Prepare Recommendations',
    type: 'task',
    lane: 'ProjectManagement',
    participant: 'project_manager',
    isManual: true,
    recommendedRole: 'pm',
    description: 'Compile findings into recommendations document',
    estimatedMinutes: 240,
    nextSteps: ['presentation'],
  },
  {
    key: 'presentation',
    title: 'Present Findings',
    type: 'task',
    lane: 'Client',
    participant: 'client',
    isManual: true,
    description: 'Present recommendations to client',
    estimatedMinutes: 90,
    nextSteps: ['engagement_close'],
  },
  {
    key: 'engagement_close',
    title: 'Close Engagement',
    type: 'end_event',
    lane: 'AutomationCRM',
    participant: 'crm_system',
    description: 'Close consulting engagement',
  },
];

// =====================
// TEMPLATE MANAGEMENT FUNCTIONS
// =====================

/**
 * Get all available templates
 */
export async function getProcessTemplates(
  options?: {
    category?: TemplateCategory;
    activeOnly?: boolean;
    includeDefinition?: boolean;
  }
): Promise<ProcessTemplate[]> {
  const db = getDb();

  const conditions = [];
  if (options?.activeOnly !== false) {
    conditions.push(sql`is_active = 1`);
  }

  const definitions = await db
    .select()
    .from(processDefinitions)
    .orderBy(desc(processDefinitions.version))
    .all();

  // Group by key to get latest version of each
  const latestByKey = new Map<string, typeof definitions[0]>();
  for (const def of definitions) {
    if (!latestByKey.has(def.key)) {
      latestByKey.set(def.key, def);
    }
  }

  const templates: ProcessTemplate[] = [];

  for (const [key, def] of latestByKey) {
    const json = def.json as any;
    
    // Find matching default template metadata
    const defaultMeta = DEFAULT_TEMPLATES.find(t => t.key === key);

    templates.push({
      id: def.id,
      key: def.key,
      name: json?.name || defaultMeta?.name || key,
      description: json?.description || defaultMeta?.description || '',
      category: defaultMeta?.category || 'custom',
      tags: defaultMeta?.tags || [],
      version: def.version,
      isActive: def.isActive ?? true,
      isDefault: defaultMeta?.isDefault || false,
      createdAt: def.createdAt,
      updatedAt: def.createdAt,
      definition: options?.includeDefinition ? (json as BusinessProcessDefinition) : {} as any,
      estimatedDurationDays: defaultMeta?.estimatedDurationDays,
      complexity: defaultMeta?.complexity || 'moderate',
      recommendedTeamSize: defaultMeta?.recommendedTeamSize,
      usageCount: defaultMeta?.usageCount || 0,
    });
  }

  // Filter by category if specified
  if (options?.category) {
    return templates.filter(t => t.category === options.category);
  }

  return templates;
}

/**
 * Get a specific template by key
 */
export async function getTemplateByKey(key: string): Promise<ProcessTemplate | null> {
  const db = getDb();

  const def = await db
    .select()
    .from(processDefinitions)
    .where(eq(processDefinitions.key, key))
    .orderBy(desc(processDefinitions.version))
    .get();

  if (!def) return null;

  const json = def.json as any;
  const defaultMeta = DEFAULT_TEMPLATES.find(t => t.key === key);

  return {
    id: def.id,
    key: def.key,
    name: json?.name || defaultMeta?.name || key,
    description: json?.description || defaultMeta?.description || '',
    category: defaultMeta?.category || 'custom',
    tags: defaultMeta?.tags || [],
    version: def.version,
    isActive: def.isActive ?? true,
    isDefault: defaultMeta?.isDefault || false,
    createdAt: def.createdAt,
    updatedAt: def.createdAt,
    definition: json as BusinessProcessDefinition,
    estimatedDurationDays: defaultMeta?.estimatedDurationDays,
    complexity: defaultMeta?.complexity || 'moderate',
    recommendedTeamSize: defaultMeta?.recommendedTeamSize,
    usageCount: defaultMeta?.usageCount || 0,
  };
}

/**
 * Create a new process template
 */
export async function createProcessTemplate(
  params: TemplateCreateParams
): Promise<ProcessTemplate> {
  const db = getDb();
  const now = new Date();
  const id = crypto.randomUUID();

  // Generate unique key
  const key = params.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') + '_' + Date.now().toString(36);

  // Get base definition
  let baseDefinition: BusinessProcessDefinition;

  if (params.baseTemplateKey) {
    const baseTemplate = await getTemplateByKey(params.baseTemplateKey);
    if (baseTemplate) {
      baseDefinition = baseTemplate.definition;
    } else {
      baseDefinition = getDefaultBusinessProcessDefinition();
    }
  } else if (params.category === 'maintenance') {
    // Use quick fix template for maintenance
    baseDefinition = {
      key,
      version: 1,
      name: params.name,
      description: params.description,
      lanes: ['Client', 'ProjectManagement', 'Development', 'AutomationCRM'],
      participants: ['client', 'project_manager', 'developer', 'crm_system'],
      steps: QUICK_FIX_STEPS,
      messages: [],
      createdAt: now,
    };
  } else if (params.category === 'consulting') {
    baseDefinition = {
      key,
      version: 1,
      name: params.name,
      description: params.description,
      lanes: ['Client', 'BusinessDevelopment', 'ProjectManagement', 'AutomationCRM'],
      participants: ['client', 'business_developer', 'project_manager', 'crm_system'],
      steps: CONSULTING_STEPS,
      messages: [],
      createdAt: now,
    };
  } else {
    baseDefinition = getDefaultBusinessProcessDefinition();
  }

  // Apply customizations
  const definition: BusinessProcessDefinition = {
    ...baseDefinition,
    key,
    name: params.name,
    description: params.description,
    version: 1,
    createdAt: now,
  };

  // Apply step configurations if provided
  if (params.steps && params.steps.length > 0) {
    definition.steps = definition.steps.map(step => {
      const config = params.steps!.find(c => c.stepKey === step.key);
      if (config) {
        return {
          ...step,
          title: config.customTitle || step.title,
          description: config.customDescription || step.description,
          recommendedRole: config.assignToRole as any || step.recommendedRole,
          // Note: SLA would be handled separately
        };
      }
      return step;
    }).filter(step => {
      const config = params.steps!.find(c => c.stepKey === step.key);
      // Keep step if no config or if config says enabled
      return !config || config.enabled !== false;
    });
  }

  // Save to database
  await db.insert(processDefinitions).values({
    id,
    key,
    version: 1,
    isActive: true,
    json: definition as any,
    createdAt: now,
  });

  return {
    id,
    key,
    name: params.name,
    description: params.description,
    category: params.category,
    tags: params.tags || [],
    version: 1,
    isActive: true,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    createdByUserId: params.createdByUserId,
    definition,
    estimatedDurationDays: params.estimatedDurationDays,
    complexity: params.complexity || 'moderate',
    recommendedTeamSize: params.recommendedTeamSize,
    usageCount: 0,
  };
}

/**
 * Clone an existing template
 */
export async function cloneTemplate(
  sourceKey: string,
  newName: string,
  customizations?: Partial<TemplateCreateParams>
): Promise<ProcessTemplate | null> {
  const source = await getTemplateByKey(sourceKey);
  if (!source) return null;

  return createProcessTemplate({
    name: newName,
    description: customizations?.description || source.description,
    category: customizations?.category || source.category,
    tags: customizations?.tags || [...source.tags, 'cloned'],
    complexity: customizations?.complexity || source.complexity,
    estimatedDurationDays: customizations?.estimatedDurationDays || source.estimatedDurationDays,
    recommendedTeamSize: customizations?.recommendedTeamSize || source.recommendedTeamSize,
    baseTemplateKey: sourceKey,
    createdByUserId: customizations?.createdByUserId,
    steps: customizations?.steps,
  });
}

/**
 * Update template metadata
 */
export async function updateTemplateMetadata(
  key: string,
  updates: TemplateUpdateParams
): Promise<ProcessTemplate | null> {
  const db = getDb();
  const now = new Date();

  const existing = await db
    .select()
    .from(processDefinitions)
    .where(eq(processDefinitions.key, key))
    .orderBy(desc(processDefinitions.version))
    .get();

  if (!existing) return null;

  const currentJson = existing.json as any;

  const updatedJson = {
    ...currentJson,
    name: updates.name || currentJson.name,
    description: updates.description || currentJson.description,
  };

  // If updating to new version, create new record
  if (updates.isActive !== undefined && updates.isActive !== existing.isActive) {
    await db
      .update(processDefinitions)
      .set({ isActive: updates.isActive })
      .where(eq(processDefinitions.id, existing.id));
  }

  // For other updates, we might want to create a new version
  // For now, just update in place (for metadata only)

  return getTemplateByKey(key);
}

/**
 * Create a new version of a template
 */
export async function createTemplateVersion(
  key: string,
  definition: BusinessProcessDefinition,
  createdByUserId?: string
): Promise<ProcessTemplate | null> {
  const db = getDb();
  const now = new Date();

  // Get current version
  const existing = await db
    .select()
    .from(processDefinitions)
    .where(eq(processDefinitions.key, key))
    .orderBy(desc(processDefinitions.version))
    .get();

  if (!existing) return null;

  const newVersion = existing.version + 1;
  const id = crypto.randomUUID();

  // Deactivate old version
  await db
    .update(processDefinitions)
    .set({ isActive: false })
    .where(eq(processDefinitions.key, key));

  // Create new version
  await db.insert(processDefinitions).values({
    id,
    key,
    version: newVersion,
    isActive: true,
    json: {
      ...definition,
      key,
      version: newVersion,
    } as any,
    createdAt: now,
  });

  return getTemplateByKey(key);
}

/**
 * Delete a template (soft delete by deactivating)
 */
export async function deleteTemplate(key: string): Promise<boolean> {
  const db = getDb();

  // Don't allow deleting the default template
  if (key === MEGICODE_BUSINESS_PROCESS_KEY) {
    return false;
  }

  await db
    .update(processDefinitions)
    .set({ isActive: false })
    .where(eq(processDefinitions.key, key));

  return true;
}

/**
 * Get template categories with counts
 */
export async function getTemplateCategoryCounts(): Promise<Record<TemplateCategory, number>> {
  const templates = await getProcessTemplates({ activeOnly: true });

  const counts: Record<TemplateCategory, number> = {
    software_development: 0,
    web_development: 0,
    mobile_development: 0,
    consulting: 0,
    design: 0,
    maintenance: 0,
    support: 0,
    custom: 0,
  };

  for (const template of templates) {
    counts[template.category] = (counts[template.category] || 0) + 1;
  }

  return counts;
}

/**
 * Search templates by name or tags
 */
export async function searchTemplates(query: string): Promise<ProcessTemplate[]> {
  const templates = await getProcessTemplates({ activeOnly: true });
  const lowerQuery = query.toLowerCase();

  return templates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Initialize default templates in the database
 */
export async function ensureDefaultTemplates(): Promise<void> {
  const db = getDb();

  for (const templateMeta of DEFAULT_TEMPLATES) {
    const existing = await db
      .select()
      .from(processDefinitions)
      .where(eq(processDefinitions.key, templateMeta.key))
      .get();

    if (!existing && templateMeta.key !== MEGICODE_BUSINESS_PROCESS_KEY) {
      // Create the template
      await createProcessTemplate({
        name: templateMeta.name,
        description: templateMeta.description,
        category: templateMeta.category,
        tags: templateMeta.tags,
        complexity: templateMeta.complexity,
        estimatedDurationDays: templateMeta.estimatedDurationDays,
        recommendedTeamSize: templateMeta.recommendedTeamSize,
      });
    }
  }
}
