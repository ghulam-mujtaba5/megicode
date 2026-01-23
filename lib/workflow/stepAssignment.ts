/**
 * Smart Step Assignment System with Workload Balancing
 * 
 * Provides intelligent assignment of workflow steps to team members based on:
 * - Current workload
 * - Skills and role matching
 * - Availability
 * - Historical performance
 * - Round-robin fairness
 * 
 * Features:
 * - Auto-assignment based on configurable rules
 * - Manual assignment with workload visibility
 * - Load balancing across team members
 * - Skill-based routing
 * - Assignment history and analytics
 */

import { eq, and, sql, desc, gte } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import {
  users,
  tasks,
  businessProcessStepInstances,
  processInstances,
  events,
} from '@/lib/db/schema';
import type { UserRole } from '@/lib/db/schema';
import type { ProcessLane, BusinessProcessStep, ProcessParticipant } from './businessProcess';
import { getActiveBusinessProcessDefinition } from './processEngine';

// =====================
// TYPES
// =====================

export interface AssignmentRule {
  id: string;
  name: string;
  enabled: boolean;
  // Matching criteria
  stepKeys?: string[];           // Specific steps to apply to
  lanes?: ProcessLane[];         // Lanes to apply to
  roles?: UserRole[];            // Required roles for assignment
  // Assignment strategy
  strategy: AssignmentStrategy;
  // Filters
  minAvailability?: number;      // Minimum availability score (0-100)
  maxWorkload?: number;          // Maximum workload score (0-100)
  requiredSkills?: string[];     // Skills the assignee must have
  // Priority
  priority: number;
}

export type AssignmentStrategy =
  | 'round_robin'         // Rotate through available team members
  | 'least_loaded'        // Assign to person with lowest workload
  | 'skill_match'         // Best skill match for the task
  | 'performance_based'   // Based on historical performance metrics
  | 'manual'              // Require manual assignment
  | 'sticky'              // Keep same assignee from previous step
  | 'project_owner'       // Assign to project owner
  | 'lane_lead';          // Assign to the lead of the lane

export interface TeamMemberProfile {
  userId: string;
  userName: string;
  email: string;
  role: UserRole;
  // Workload metrics
  activeStepCount: number;
  activeTaskCount: number;
  workloadScore: number;  // 0-100
  // Performance metrics
  averageCompletionTime: number;
  completedStepsCount: number;
  slaBreachRate: number;
  performanceScore: number;  // 0-100
  // Availability
  isAvailable: boolean;
  availabilityScore: number;  // 0-100
  lastAssignedAt?: Date;
  // Skills (could be enhanced with actual skill tracking)
  skills: string[];
  // Composite score for assignment
  assignmentScore: number;  // Higher = better candidate
}

export interface AssignmentCandidate {
  user: TeamMemberProfile;
  matchScore: number;
  matchReasons: string[];
}

export interface AssignmentResult {
  success: boolean;
  assignedToUserId?: string;
  assignedToUserName?: string;
  strategy: AssignmentStrategy;
  reason: string;
  candidates?: AssignmentCandidate[];
}

// =====================
// DEFAULT ASSIGNMENT RULES
// =====================

export const DEFAULT_ASSIGNMENT_RULES: AssignmentRule[] = [
  {
    id: 'rule_pm_review',
    name: 'PM Review Assignment',
    enabled: true,
    stepKeys: ['pm_review_request'],
    roles: ['pm', 'admin'],
    strategy: 'least_loaded',
    maxWorkload: 80,
    priority: 1,
  },
  {
    id: 'rule_approval',
    name: 'Approval Assignment',
    enabled: true,
    stepKeys: ['approval_gateway'],
    roles: ['pm', 'admin'],
    strategy: 'project_owner',
    priority: 2,
  },
  {
    id: 'rule_dev_assignment',
    name: 'Developer Assignment',
    enabled: true,
    stepKeys: ['development_subprocess'],
    lanes: ['Development'],
    roles: ['dev'],
    strategy: 'skill_match',
    maxWorkload: 70,
    priority: 1,
  },
  {
    id: 'rule_final_review',
    name: 'Final Review Assignment',
    enabled: true,
    stepKeys: ['final_review_deployment'],
    roles: ['pm', 'admin'],
    strategy: 'sticky',
    priority: 2,
  },
  {
    id: 'rule_default',
    name: 'Default Round Robin',
    enabled: true,
    strategy: 'round_robin',
    priority: 99,
  },
];

// =====================
// ROLE TO LANE MAPPING
// =====================

const LANE_TO_ROLES: Record<ProcessLane, UserRole[]> = {
  'Client': [],  // Clients don't have internal roles
  'BusinessDevelopment': ['pm', 'admin'],
  'AutomationCRM': ['admin'],  // Automated steps
  'ProjectManagement': ['pm', 'admin'],
  'Development': ['dev', 'qa'],
};

const PARTICIPANT_TO_ROLES: Record<ProcessParticipant, UserRole[]> = {
  'client': [],
  'lead_intake_system': [],
  'business_developer': ['pm', 'admin'],
  'ai_assistant': [],
  'crm_system': [],
  'project_manager': ['pm', 'admin'],
  'developer': ['dev'],
};

// =====================
// TEAM MEMBER PROFILING
// =====================

/**
 * Get all team member profiles with their metrics
 */
export async function getTeamMemberProfiles(
  roleFilter?: UserRole[]
): Promise<TeamMemberProfile[]> {
  const db = getDb();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let usersQuery = db.select().from(users).where(eq(users.status, 'active'));
  
  const activeUsers = await usersQuery.all();
  const profiles: TeamMemberProfile[] = [];

  for (const user of activeUsers) {
    // Apply role filter if provided
    if (roleFilter && roleFilter.length > 0 && !roleFilter.includes(user.role as UserRole)) {
      continue;
    }

    // Get active step instances
    const activeSteps = await db
      .select()
      .from(businessProcessStepInstances)
      .where(
        and(
          eq(businessProcessStepInstances.assignedToUserId, user.id),
          eq(businessProcessStepInstances.status, 'active')
        )
      )
      .all();

    // Get active tasks
    const activeTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.assignedToUserId, user.id),
          sql`status IN ('todo', 'in_progress')`
        )
      )
      .all();

    // Get completed steps in last 30 days
    const completedSteps = await db
      .select()
      .from(businessProcessStepInstances)
      .where(
        and(
          eq(businessProcessStepInstances.completedByUserId, user.id),
          eq(businessProcessStepInstances.status, 'completed'),
          gte(businessProcessStepInstances.completedAt, thirtyDaysAgo)
        )
      )
      .all();

    // Calculate completion times
    const completionTimes = completedSteps
      .filter(s => s.startedAt && s.completedAt)
      .map(s => {
        const elapsed = s.completedAt!.getTime() - s.startedAt!.getTime();
        return Math.floor(elapsed / (1000 * 60)); // minutes
      });

    const avgCompletionTime = completionTimes.length > 0
      ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
      : 0;

    // Calculate workload score
    const capacityByRole: Record<string, number> = {
      dev: 5,
      pm: 8,
      qa: 6,
      admin: 10,
      viewer: 3,
    };
    const capacity = capacityByRole[user.role || 'viewer'] || 5;
    const totalActive = activeSteps.length + activeTasks.length;
    const workloadScore = Math.min(100, Math.round((totalActive / capacity) * 100));

    // Calculate performance score (simple version)
    const performanceScore = Math.min(100, Math.max(0,
      100 - (avgCompletionTime > 60 ? 20 : 0) - (workloadScore > 80 ? 10 : 0)
    ));

    // Availability (inverse of workload)
    const availabilityScore = 100 - workloadScore;

    // Get last assignment
    const lastAssignmentRows = await db
      .select()
      .from(businessProcessStepInstances)
      .where(eq(businessProcessStepInstances.assignedToUserId, user.id))
      .orderBy(desc(businessProcessStepInstances.createdAt))
      .limit(1);
    const lastAssignment = lastAssignmentRows[0];

    // Derive skills from role (could be enhanced with actual skill tracking)
    const skillsByRole: Record<string, string[]> = {
      dev: ['development', 'coding', 'debugging', 'testing'],
      pm: ['project_management', 'communication', 'planning', 'review'],
      qa: ['testing', 'qa', 'automation', 'debugging'],
      admin: ['management', 'review', 'approval', 'planning'],
      viewer: ['review'],
    };

    const skills = skillsByRole[user.role || 'viewer'] || [];

    // Calculate assignment score (higher = better candidate)
    const assignmentScore = Math.round(
      (availabilityScore * 0.4) +
      (performanceScore * 0.3) +
      ((100 - workloadScore) * 0.3)
    );

    profiles.push({
      userId: user.id,
      userName: user.name || user.email,
      email: user.email,
      role: user.role as UserRole,
      activeStepCount: activeSteps.length,
      activeTaskCount: activeTasks.length,
      workloadScore,
      averageCompletionTime: avgCompletionTime,
      completedStepsCount: completedSteps.length,
      slaBreachRate: 0, // Would need SLA data
      performanceScore,
      isAvailable: workloadScore < 90,
      availabilityScore,
      lastAssignedAt: lastAssignment?.createdAt || undefined,
      skills,
      assignmentScore,
    });
  }

  return profiles.sort((a, b) => b.assignmentScore - a.assignmentScore);
}

// =====================
// ASSIGNMENT STRATEGIES
// =====================

/**
 * Round-robin assignment
 */
async function assignRoundRobin(
  candidates: TeamMemberProfile[],
  stepKey: string
): Promise<AssignmentCandidate[]> {
  // Sort by last assigned date (oldest first)
  const sorted = [...candidates].sort((a, b) => {
    const aTime = a.lastAssignedAt?.getTime() || 0;
    const bTime = b.lastAssignedAt?.getTime() || 0;
    return aTime - bTime;
  });

  return sorted.map((user, index) => ({
    user,
    matchScore: 100 - index * 10,
    matchReasons: ['Round-robin assignment order'],
  }));
}

/**
 * Least-loaded assignment
 */
function assignLeastLoaded(
  candidates: TeamMemberProfile[]
): AssignmentCandidate[] {
  const sorted = [...candidates].sort((a, b) => a.workloadScore - b.workloadScore);

  return sorted.map(user => ({
    user,
    matchScore: 100 - user.workloadScore,
    matchReasons: [`Workload: ${user.workloadScore}%`],
  }));
}

/**
 * Skill-match assignment
 */
function assignBySkillMatch(
  candidates: TeamMemberProfile[],
  requiredSkills: string[]
): AssignmentCandidate[] {
  return candidates.map(user => {
    const matchingSkills = user.skills.filter(s => 
      requiredSkills.some(rs => s.toLowerCase().includes(rs.toLowerCase()))
    );
    const matchScore = (matchingSkills.length / Math.max(1, requiredSkills.length)) * 100;

    return {
      user,
      matchScore: Math.round(matchScore),
      matchReasons: matchingSkills.length > 0 
        ? [`Matching skills: ${matchingSkills.join(', ')}`]
        : ['No specific skill match'],
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Performance-based assignment
 */
function assignByPerformance(
  candidates: TeamMemberProfile[]
): AssignmentCandidate[] {
  const sorted = [...candidates].sort((a, b) => b.performanceScore - a.performanceScore);

  return sorted.map(user => ({
    user,
    matchScore: user.performanceScore,
    matchReasons: [`Performance score: ${user.performanceScore}`],
  }));
}

// =====================
// MAIN ASSIGNMENT FUNCTION
// =====================

/**
 * Find the best assignee for a step
 */
export async function findBestAssignee(
  stepKey: string,
  lane: ProcessLane,
  participant: ProcessParticipant,
  projectOwnerId?: string,
  previousAssigneeId?: string,
  customRules?: AssignmentRule[]
): Promise<AssignmentResult> {
  const db = getDb();
  const rules = customRules || DEFAULT_ASSIGNMENT_RULES;

  // Find applicable rule
  const applicableRule = rules
    .filter(r => r.enabled)
    .sort((a, b) => a.priority - b.priority)
    .find(r => {
      if (r.stepKeys && r.stepKeys.length > 0 && !r.stepKeys.includes(stepKey)) {
        return false;
      }
      if (r.lanes && r.lanes.length > 0 && !r.lanes.includes(lane)) {
        return false;
      }
      return true;
    });

  if (!applicableRule) {
    return {
      success: false,
      strategy: 'manual',
      reason: 'No applicable assignment rule found',
    };
  }

  // Handle special strategies first
  if (applicableRule.strategy === 'manual') {
    return {
      success: false,
      strategy: 'manual',
      reason: 'Manual assignment required',
    };
  }

  if (applicableRule.strategy === 'project_owner' && projectOwnerId) {
    const ownerRows = await db.select().from(users).where(eq(users.id, projectOwnerId)).limit(1);
    const owner = ownerRows[0];
    if (owner) {
      return {
        success: true,
        assignedToUserId: owner.id,
        assignedToUserName: owner.name || owner.email,
        strategy: 'project_owner',
        reason: 'Assigned to project owner',
      };
    }
  }

  if (applicableRule.strategy === 'sticky' && previousAssigneeId) {
    const prevAssigneeRows = await db.select().from(users).where(eq(users.id, previousAssigneeId)).limit(1);
    const prevAssignee = prevAssigneeRows[0];
    if (prevAssignee && prevAssignee.status === 'active') {
      return {
        success: true,
        assignedToUserId: prevAssignee.id,
        assignedToUserName: prevAssignee.name || prevAssignee.email,
        strategy: 'sticky',
        reason: 'Assigned to previous step assignee for continuity',
      };
    }
  }

  // Get eligible roles
  let eligibleRoles = applicableRule.roles || [];
  if (eligibleRoles.length === 0) {
    // Derive from lane or participant
    eligibleRoles = LANE_TO_ROLES[lane] || PARTICIPANT_TO_ROLES[participant] || [];
  }

  // Get candidates
  let candidates = await getTeamMemberProfiles(
    eligibleRoles.length > 0 ? eligibleRoles : undefined
  );

  // Apply filters
  if (applicableRule.maxWorkload) {
    candidates = candidates.filter(c => c.workloadScore <= applicableRule.maxWorkload!);
  }

  if (applicableRule.minAvailability) {
    candidates = candidates.filter(c => c.availabilityScore >= applicableRule.minAvailability!);
  }

  candidates = candidates.filter(c => c.isAvailable);

  if (candidates.length === 0) {
    return {
      success: false,
      strategy: applicableRule.strategy,
      reason: 'No available candidates matching criteria',
    };
  }

  // Apply strategy
  let rankedCandidates: AssignmentCandidate[];

  switch (applicableRule.strategy) {
    case 'round_robin':
      rankedCandidates = await assignRoundRobin(candidates, stepKey);
      break;
    case 'least_loaded':
      rankedCandidates = assignLeastLoaded(candidates);
      break;
    case 'skill_match':
      rankedCandidates = assignBySkillMatch(
        candidates, 
        applicableRule.requiredSkills || ['general']
      );
      break;
    case 'performance_based':
      rankedCandidates = assignByPerformance(candidates);
      break;
    default:
      rankedCandidates = assignLeastLoaded(candidates);
  }

  if (rankedCandidates.length === 0) {
    return {
      success: false,
      strategy: applicableRule.strategy,
      reason: 'No candidates after strategy evaluation',
    };
  }

  const bestCandidate = rankedCandidates[0];

  return {
    success: true,
    assignedToUserId: bestCandidate.user.userId,
    assignedToUserName: bestCandidate.user.userName,
    strategy: applicableRule.strategy,
    reason: bestCandidate.matchReasons.join('; '),
    candidates: rankedCandidates.slice(0, 5),
  };
}

/**
 * Auto-assign a step instance
 */
export async function autoAssignStep(
  processInstanceId: string,
  stepInstanceId: string,
  stepKey: string,
  lane: ProcessLane,
  participant: ProcessParticipant,
  projectOwnerId?: string,
  previousAssigneeId?: string
): Promise<AssignmentResult> {
  const db = getDb();
  const now = new Date();

  const result = await findBestAssignee(
    stepKey,
    lane,
    participant,
    projectOwnerId,
    previousAssigneeId
  );

  if (result.success && result.assignedToUserId) {
    // Update step instance with assignment
    await db
      .update(businessProcessStepInstances)
      .set({
        assignedToUserId: result.assignedToUserId,
      })
      .where(eq(businessProcessStepInstances.id, stepInstanceId));

    // Log assignment event
    await db.insert(events).values({
      id: crypto.randomUUID(),
      instanceId: processInstanceId,
      type: 'step.auto_assigned',
      actorUserId: null,
      payloadJson: {
        stepKey,
        assignedToUserId: result.assignedToUserId,
        strategy: result.strategy,
        reason: result.reason,
      },
      createdAt: now,
    });
  }

  return result;
}

/**
 * Manually assign a step to a user
 */
export async function manuallyAssignStep(
  processInstanceId: string,
  stepInstanceId: string,
  assignToUserId: string,
  assignedByUserId: string,
  notes?: string
): Promise<AssignmentResult> {
  const db = getDb();
  const now = new Date();

  const userRows = await db.select().from(users).where(eq(users.id, assignToUserId)).limit(1);
  const user = userRows[0];

  if (!user) {
    return {
      success: false,
      strategy: 'manual',
      reason: 'User not found',
    };
  }

  await db
    .update(businessProcessStepInstances)
    .set({
      assignedToUserId: assignToUserId,
      notes: notes || undefined,
    })
    .where(eq(businessProcessStepInstances.id, stepInstanceId));

  await db.insert(events).values({
    id: crypto.randomUUID(),
    instanceId: processInstanceId,
    type: 'step.manually_assigned',
    actorUserId: assignedByUserId,
    payloadJson: {
      assignedToUserId: assignToUserId,
      notes,
    },
    createdAt: now,
  });

  return {
    success: true,
    assignedToUserId: user.id,
    assignedToUserName: user.name || user.email,
    strategy: 'manual',
    reason: notes || 'Manually assigned by user',
  };
}

/**
 * Reassign a step (with reason tracking)
 */
export async function reassignStep(
  processInstanceId: string,
  stepInstanceId: string,
  newAssigneeId: string,
  reassignedByUserId: string,
  reason: string
): Promise<AssignmentResult> {
  const db = getDb();
  const now = new Date();

  // Get current assignment
  const stepInstanceRows = await db
    .select()
    .from(businessProcessStepInstances)
    .where(eq(businessProcessStepInstances.id, stepInstanceId))
    .limit(1);
  const stepInstance = stepInstanceRows[0];

  const previousAssigneeId = stepInstance?.assignedToUserId;

  const userRows = await db.select().from(users).where(eq(users.id, newAssigneeId)).limit(1);
  const user = userRows[0];

  if (!user) {
    return {
      success: false,
      strategy: 'manual',
      reason: 'User not found',
    };
  }

  await db
    .update(businessProcessStepInstances)
    .set({
      assignedToUserId: newAssigneeId,
    })
    .where(eq(businessProcessStepInstances.id, stepInstanceId));

  await db.insert(events).values({
    id: crypto.randomUUID(),
    instanceId: processInstanceId,
    type: 'step.reassigned',
    actorUserId: reassignedByUserId,
    payloadJson: {
      previousAssigneeId,
      newAssigneeId,
      reason,
    },
    createdAt: now,
  });

  return {
    success: true,
    assignedToUserId: user.id,
    assignedToUserName: user.name || user.email,
    strategy: 'manual',
    reason: `Reassigned: ${reason}`,
  };
}

/**
 * Get workload overview for team
 */
export async function getTeamWorkloadOverview(): Promise<{
  totalMembers: number;
  availableMembers: number;
  overloadedMembers: number;
  averageWorkload: number;
  members: TeamMemberProfile[];
}> {
  const profiles = await getTeamMemberProfiles();

  const availableMembers = profiles.filter(p => p.isAvailable).length;
  const overloadedMembers = profiles.filter(p => p.workloadScore > 80).length;
  const avgWorkload = profiles.length > 0
    ? Math.round(profiles.reduce((sum, p) => sum + p.workloadScore, 0) / profiles.length)
    : 0;

  return {
    totalMembers: profiles.length,
    availableMembers,
    overloadedMembers,
    averageWorkload: avgWorkload,
    members: profiles,
  };
}
