/**
 * Process Bottleneck Detection & Analytics
 * 
 * Identifies workflow bottlenecks based on:
 * - Average step duration
 * - Step queue length (pending instances)
 * - SLA breach rates
 * - Resource utilization per lane
 * 
 * Features:
 * - Real-time bottleneck detection
 * - Historical trend analysis
 * - Recommendations for process optimization
 * - Lane-level performance metrics
 */

import { eq, and, gte, lt, sql, desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import {
  processInstances,
  businessProcessStepInstances,
  users,
  tasks,
} from '@/lib/db/schema';
import { getActiveBusinessProcessDefinition } from './processEngine';
import type { ProcessLane, BusinessProcessStep } from './businessProcess';
import { getSLARuleForStep, DEFAULT_SLA_RULES } from './slaMonitoring';

// =====================
// TYPES
// =====================

export interface StepMetrics {
  stepKey: string;
  stepTitle: string;
  lane: ProcessLane;
  participant: string;
  isManual: boolean;
  // Duration metrics (in minutes)
  averageDuration: number;
  medianDuration: number;
  minDuration: number;
  maxDuration: number;
  p90Duration: number; // 90th percentile
  // Count metrics
  totalExecutions: number;
  activeInstances: number;
  pendingInstances: number;
  completedInstances: number;
  failedInstances: number;
  // SLA metrics
  slaBreachCount: number;
  slaBreachRate: number;
  averageSlaUtilization: number; // % of SLA time typically used
  // Bottleneck indicators
  bottleneckScore: number; // 0-100, higher = worse bottleneck
  isBottleneck: boolean;
  bottleneckReasons: string[];
}

export interface LaneMetrics {
  lane: ProcessLane;
  stepCount: number;
  averageStepDuration: number;
  totalActiveInstances: number;
  slaBreachRate: number;
  throughputPerDay: number;
  bottleneckScore: number;
  isBottleneck: boolean;
}

export interface ResourceUtilization {
  userId: string;
  userName: string;
  userRole: string;
  activeTaskCount: number;
  completedTaskCount: number;
  averageCompletionTime: number;
  workloadScore: number; // 0-100, higher = more loaded
  isOverloaded: boolean;
}

export interface BottleneckAnalysis {
  analyzedAt: Date;
  periodDays: number;
  totalProcesses: number;
  completedProcesses: number;
  averageProcessDuration: number;
  // Bottlenecks
  bottleneckSteps: StepMetrics[];
  bottleneckLanes: LaneMetrics[];
  overloadedResources: ResourceUtilization[];
  // All metrics
  stepMetrics: StepMetrics[];
  laneMetrics: LaneMetrics[];
  resourceUtilization: ResourceUtilization[];
  // Recommendations
  recommendations: OptimizationRecommendation[];
}

export interface OptimizationRecommendation {
  type: 'step_optimization' | 'resource_allocation' | 'sla_adjustment' | 'automation' | 'parallelization';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  affectedSteps?: string[];
  affectedUsers?: string[];
  suggestedAction?: string;
}

export interface ProcessFlowMetrics {
  stepKey: string;
  stepTitle: string;
  entryCount: number;
  exitCount: number;
  averageWaitTime: number; // Time before step starts after previous completes
  averageProcessTime: number;
  successRate: number;
  dropoffRate: number;
}

// =====================
// CALCULATION HELPERS
// =====================

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

function calculateMedian(values: number[]): number {
  return calculatePercentile(values, 50);
}

function calculateBottleneckScore(metrics: {
  activeInstances: number;
  pendingInstances: number;
  slaBreachRate: number;
  averageDuration: number;
  slaThreshold: number;
}): number {
  let score = 0;

  // Queue depth contributes 30%
  const queueFactor = Math.min(1, (metrics.activeInstances + metrics.pendingInstances) / 10);
  score += queueFactor * 30;

  // SLA breach rate contributes 40%
  score += (metrics.slaBreachRate / 100) * 40;

  // Duration vs SLA threshold contributes 30%
  const durationFactor = Math.min(1, metrics.averageDuration / metrics.slaThreshold);
  score += durationFactor * 30;

  return Math.round(Math.min(100, score));
}

// =====================
// MAIN ANALYSIS FUNCTIONS
// =====================

/**
 * Get comprehensive step metrics for a given period
 */
export async function getStepMetrics(periodDays: number = 30): Promise<StepMetrics[]> {
  const db = getDb();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  const { definition } = await getActiveBusinessProcessDefinition();

  // Get all step instances in the period
  const stepInstances = await db
    .select()
    .from(businessProcessStepInstances)
    .where(gte(businessProcessStepInstances.createdAt, startDate))
    .all();

  const metrics: StepMetrics[] = [];

  for (const stepDef of definition.steps) {
    // Skip start/end events
    if (stepDef.type === 'start_event' || stepDef.type === 'end_event') continue;

    const stepData = stepInstances.filter(si => si.stepKey === stepDef.key);
    
    // Calculate durations for completed steps
    const durations = stepData
      .filter(si => si.status === 'completed' && si.startedAt && si.completedAt)
      .map(si => {
        const elapsed = si.completedAt!.getTime() - si.startedAt!.getTime();
        return Math.floor(elapsed / (1000 * 60)); // minutes
      });

    // Get SLA info
    const slaRule = getSLARuleForStep(stepDef.key);
    const slaThreshold = slaRule?.criticalThresholdMinutes ?? 1440;

    // Calculate breach count
    const breachCount = durations.filter(d => d > slaThreshold).length;

    const activeCount = stepData.filter(si => si.status === 'active').length;
    const pendingCount = stepData.filter(si => si.status === 'pending').length;
    const completedCount = stepData.filter(si => si.status === 'completed').length;
    const failedCount = stepData.filter(si => si.status === 'failed').length;

    const averageDuration = durations.length > 0 
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    const slaUtilizations = durations.map(d => (d / slaThreshold) * 100);
    const avgSlaUtilization = slaUtilizations.length > 0
      ? Math.round(slaUtilizations.reduce((a, b) => a + b, 0) / slaUtilizations.length)
      : 0;

    const bottleneckScore = calculateBottleneckScore({
      activeInstances: activeCount,
      pendingInstances: pendingCount,
      slaBreachRate: completedCount > 0 ? (breachCount / completedCount) * 100 : 0,
      averageDuration,
      slaThreshold,
    });

    const bottleneckReasons: string[] = [];
    if (activeCount > 5) bottleneckReasons.push('High active instance count');
    if (pendingCount > 3) bottleneckReasons.push('Queue buildup detected');
    if (completedCount > 0 && breachCount / completedCount > 0.1) bottleneckReasons.push('High SLA breach rate');
    if (avgSlaUtilization > 80) bottleneckReasons.push('Close to SLA threshold regularly');

    metrics.push({
      stepKey: stepDef.key,
      stepTitle: stepDef.title,
      lane: stepDef.lane,
      participant: stepDef.participant,
      isManual: stepDef.isManual ?? true,
      averageDuration,
      medianDuration: calculateMedian(durations),
      minDuration: durations.length > 0 ? Math.min(...durations) : 0,
      maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
      p90Duration: calculatePercentile(durations, 90),
      totalExecutions: stepData.length,
      activeInstances: activeCount,
      pendingInstances: pendingCount,
      completedInstances: completedCount,
      failedInstances: failedCount,
      slaBreachCount: breachCount,
      slaBreachRate: completedCount > 0 ? Math.round((breachCount / completedCount) * 100) : 0,
      averageSlaUtilization: avgSlaUtilization,
      bottleneckScore,
      isBottleneck: bottleneckScore > 50,
      bottleneckReasons,
    });
  }

  return metrics.sort((a, b) => b.bottleneckScore - a.bottleneckScore);
}

/**
 * Get lane-level metrics
 */
export async function getLaneMetrics(periodDays: number = 30): Promise<LaneMetrics[]> {
  const stepMetrics = await getStepMetrics(periodDays);
  const { definition } = await getActiveBusinessProcessDefinition();

  const laneData = new Map<ProcessLane, {
    steps: StepMetrics[];
    totalDuration: number;
    totalActive: number;
    totalBreaches: number;
    totalCompleted: number;
  }>();

  // Initialize lanes
  for (const lane of definition.lanes) {
    laneData.set(lane, {
      steps: [],
      totalDuration: 0,
      totalActive: 0,
      totalBreaches: 0,
      totalCompleted: 0,
    });
  }

  // Aggregate step metrics by lane
  for (const step of stepMetrics) {
    const data = laneData.get(step.lane);
    if (data) {
      data.steps.push(step);
      data.totalDuration += step.averageDuration * step.completedInstances;
      data.totalActive += step.activeInstances;
      data.totalBreaches += step.slaBreachCount;
      data.totalCompleted += step.completedInstances;
    }
  }

  const metrics: LaneMetrics[] = [];

  for (const [lane, data] of laneData) {
    const avgDuration = data.totalCompleted > 0 
      ? Math.round(data.totalDuration / data.totalCompleted)
      : 0;

    const slaBreachRate = data.totalCompleted > 0
      ? Math.round((data.totalBreaches / data.totalCompleted) * 100)
      : 0;

    const throughput = data.totalCompleted / periodDays;

    const bottleneckScore = Math.round(
      data.steps.reduce((sum, s) => sum + s.bottleneckScore, 0) / Math.max(1, data.steps.length)
    );

    metrics.push({
      lane,
      stepCount: data.steps.length,
      averageStepDuration: avgDuration,
      totalActiveInstances: data.totalActive,
      slaBreachRate,
      throughputPerDay: Math.round(throughput * 10) / 10,
      bottleneckScore,
      isBottleneck: bottleneckScore > 50,
    });
  }

  return metrics.sort((a, b) => b.bottleneckScore - a.bottleneckScore);
}

/**
 * Get resource utilization metrics
 */
export async function getResourceUtilization(): Promise<ResourceUtilization[]> {
  const db = getDb();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get all users
  const allUsers = await db.select().from(users).where(eq(users.status, 'active')).all();

  const utilization: ResourceUtilization[] = [];

  for (const user of allUsers) {
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

    // Get completed tasks in last 30 days
    const completedTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.assignedToUserId, user.id),
          eq(tasks.status, 'done'),
          gte(tasks.completedAt, thirtyDaysAgo)
        )
      )
      .all();

    // Calculate average completion time
    const completionTimes = completedTasks
      .filter(t => t.createdAt && t.completedAt)
      .map(t => {
        const elapsed = t.completedAt!.getTime() - t.createdAt.getTime();
        return Math.floor(elapsed / (1000 * 60 * 60)); // hours
      });

    const avgCompletionTime = completionTimes.length > 0
      ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
      : 0;

    // Calculate workload score (based on active tasks and role capacity)
    const capacityByRole: Record<string, number> = {
      dev: 5,
      pm: 8,
      qa: 6,
      admin: 10,
      viewer: 3,
    };

    const capacity = capacityByRole[user.role || 'viewer'] || 5;
    const workloadScore = Math.min(100, Math.round((activeTasks.length / capacity) * 100));

    utilization.push({
      userId: user.id,
      userName: user.name || user.email,
      userRole: user.role || 'viewer',
      activeTaskCount: activeTasks.length,
      completedTaskCount: completedTasks.length,
      averageCompletionTime: avgCompletionTime,
      workloadScore,
      isOverloaded: workloadScore > 80,
    });
  }

  return utilization.sort((a, b) => b.workloadScore - a.workloadScore);
}

/**
 * Generate optimization recommendations based on analysis
 */
export function generateRecommendations(
  stepMetrics: StepMetrics[],
  laneMetrics: LaneMetrics[],
  resourceUtilization: ResourceUtilization[]
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];

  // Check for step bottlenecks
  const criticalBottlenecks = stepMetrics.filter(s => s.bottleneckScore > 70);
  for (const step of criticalBottlenecks) {
    recommendations.push({
      type: 'step_optimization',
      priority: step.bottleneckScore > 85 ? 'critical' : 'high',
      title: `Optimize Step: ${step.stepTitle}`,
      description: `This step has a bottleneck score of ${step.bottleneckScore}. ${step.bottleneckReasons.join('. ')}`,
      impact: `Reducing delays here could improve overall process time by ${Math.round(step.averageDuration * 0.3)} minutes on average.`,
      affectedSteps: [step.stepKey],
      suggestedAction: step.isManual 
        ? 'Consider automating this step or adding more resources.'
        : 'Review automation logic for potential optimizations.',
    });
  }

  // Check for overloaded resources
  const overloaded = resourceUtilization.filter(r => r.isOverloaded);
  if (overloaded.length > 0) {
    recommendations.push({
      type: 'resource_allocation',
      priority: 'high',
      title: 'Redistribute Workload',
      description: `${overloaded.length} team member(s) are overloaded with tasks.`,
      impact: 'Balancing workload can reduce task completion times and improve team morale.',
      affectedUsers: overloaded.map(r => r.userId),
      suggestedAction: `Consider redistributing tasks from: ${overloaded.map(r => r.userName).join(', ')}`,
    });
  }

  // Check for high SLA breach rates
  const highBreachRates = stepMetrics.filter(s => s.slaBreachRate > 20);
  for (const step of highBreachRates) {
    recommendations.push({
      type: 'sla_adjustment',
      priority: step.slaBreachRate > 40 ? 'high' : 'medium',
      title: `Review SLA for: ${step.stepTitle}`,
      description: `This step has a ${step.slaBreachRate}% SLA breach rate.`,
      impact: 'Adjusting SLA thresholds or adding resources can improve compliance.',
      affectedSteps: [step.stepKey],
      suggestedAction: step.slaBreachRate > 40 
        ? 'Either extend the SLA threshold or allocate additional resources.'
        : 'Monitor this step closely and consider proactive interventions.',
    });
  }

  // Check for automation opportunities
  const manualSlowSteps = stepMetrics.filter(
    s => s.isManual && s.averageDuration > 60 && s.completedInstances > 5
  );
  for (const step of manualSlowSteps) {
    recommendations.push({
      type: 'automation',
      priority: 'medium',
      title: `Automate: ${step.stepTitle}`,
      description: `This manual step takes an average of ${Math.round(step.averageDuration / 60)} hours.`,
      impact: 'Automation could reduce this to minutes and free up team resources.',
      affectedSteps: [step.stepKey],
      suggestedAction: 'Evaluate if this step can be partially or fully automated.',
    });
  }

  // Check for lane bottlenecks
  const bottleneckLanes = laneMetrics.filter(l => l.isBottleneck);
  for (const lane of bottleneckLanes) {
    recommendations.push({
      type: 'parallelization',
      priority: 'medium',
      title: `Review ${lane.lane} Lane`,
      description: `The ${lane.lane} lane has ${lane.totalActiveInstances} active instances with a bottleneck score of ${lane.bottleneckScore}.`,
      impact: 'Adding parallel processing or resources to this lane could improve throughput.',
      suggestedAction: 'Consider adding more team members to this lane or parallelizing steps.',
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Run comprehensive bottleneck analysis
 */
export async function runBottleneckAnalysis(periodDays: number = 30): Promise<BottleneckAnalysis> {
  const db = getDb();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  // Get basic process counts
  const allProcesses = await db
    .select()
    .from(processInstances)
    .where(gte(processInstances.startedAt, startDate))
    .all();

  const completedProcesses = allProcesses.filter(p => p.status === 'completed');

  // Calculate average process duration
  const processDurations = completedProcesses
    .filter(p => p.startedAt && p.endedAt)
    .map(p => {
      const elapsed = p.endedAt!.getTime() - p.startedAt.getTime();
      return Math.floor(elapsed / (1000 * 60)); // minutes
    });

  const avgProcessDuration = processDurations.length > 0
    ? Math.round(processDurations.reduce((a, b) => a + b, 0) / processDurations.length)
    : 0;

  // Get all metrics
  const stepMetrics = await getStepMetrics(periodDays);
  const laneMetrics = await getLaneMetrics(periodDays);
  const resourceUtilization = await getResourceUtilization();

  // Generate recommendations
  const recommendations = generateRecommendations(stepMetrics, laneMetrics, resourceUtilization);

  return {
    analyzedAt: new Date(),
    periodDays,
    totalProcesses: allProcesses.length,
    completedProcesses: completedProcesses.length,
    averageProcessDuration: avgProcessDuration,
    bottleneckSteps: stepMetrics.filter(s => s.isBottleneck),
    bottleneckLanes: laneMetrics.filter(l => l.isBottleneck),
    overloadedResources: resourceUtilization.filter(r => r.isOverloaded),
    stepMetrics,
    laneMetrics,
    resourceUtilization,
    recommendations,
  };
}

/**
 * Get process flow metrics for funnel analysis
 */
export async function getProcessFlowMetrics(periodDays: number = 30): Promise<ProcessFlowMetrics[]> {
  const db = getDb();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  const { definition } = await getActiveBusinessProcessDefinition();
  
  const stepInstances = await db
    .select()
    .from(businessProcessStepInstances)
    .where(gte(businessProcessStepInstances.createdAt, startDate))
    .orderBy(businessProcessStepInstances.processInstanceId, businessProcessStepInstances.createdAt)
    .all();

  const flowMetrics: ProcessFlowMetrics[] = [];

  for (const stepDef of definition.steps) {
    if (stepDef.type === 'start_event' || stepDef.type === 'end_event') continue;

    const stepData = stepInstances.filter(si => si.stepKey === stepDef.key);
    const entryCount = stepData.length;
    const exitCount = stepData.filter(si => si.status === 'completed').length;
    
    const processTimes = stepData
      .filter(si => si.startedAt && si.completedAt)
      .map(si => {
        const elapsed = si.completedAt!.getTime() - si.startedAt!.getTime();
        return Math.floor(elapsed / (1000 * 60));
      });

    const avgProcessTime = processTimes.length > 0
      ? Math.round(processTimes.reduce((a, b) => a + b, 0) / processTimes.length)
      : 0;

    flowMetrics.push({
      stepKey: stepDef.key,
      stepTitle: stepDef.title,
      entryCount,
      exitCount,
      averageWaitTime: 0, // Would need to calculate based on previous step completion
      averageProcessTime: avgProcessTime,
      successRate: entryCount > 0 ? Math.round((exitCount / entryCount) * 100) : 100,
      dropoffRate: entryCount > 0 ? Math.round(((entryCount - exitCount) / entryCount) * 100) : 0,
    });
  }

  return flowMetrics;
}
