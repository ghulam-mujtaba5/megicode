/**
 * Business Process Analytics API
 * 
 * GET /api/internal/process/analytics - Get process analytics and metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { eq, and, gte, lte, sql, count, avg } from 'drizzle-orm';

import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { 
  processInstances, 
  events, 
  businessProcessStepInstances,
  businessProcessAutomations 
} from '@/lib/db/schema';
import { getActiveBusinessProcessDefinition } from '@/lib/workflow/processEngine';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only allow admin and PM to see analytics
  const userRole = session.user.role;
  if (!['admin', 'pm'].includes(userRole || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = getDb();
  const { searchParams } = new URL(request.url);

  // Parse date range
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const rangeStart = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const rangeEnd = endDate ? new Date(endDate) : new Date();

  try {
    const { id: definitionId, definition } = await getActiveBusinessProcessDefinition();

    // Overall process stats
    const allInstances = await db
      .select()
      .from(processInstances)
      .where(
        and(
          eq(processInstances.processDefinitionId, definitionId),
          gte(processInstances.startedAt, rangeStart)
        )
      )
      .all();

    const totalInstances = allInstances.length;
    const completedInstances = allInstances.filter(i => i.status === 'completed').length;
    const runningInstances = allInstances.filter(i => i.status === 'running').length;
    const canceledInstances = allInstances.filter(i => i.status === 'canceled').length;

    // Calculate average completion time for completed processes
    const completedWithDuration = allInstances
      .filter(i => i.status === 'completed' && i.startedAt && i.endedAt)
      .map(i => ({
        duration: new Date(i.endedAt!).getTime() - new Date(i.startedAt!).getTime(),
      }));

    const avgCompletionTime = completedWithDuration.length > 0
      ? completedWithDuration.reduce((sum, i) => sum + i.duration, 0) / completedWithDuration.length
      : 0;

    // Step-level analytics
    const stepInstances = await db
      .select()
      .from(businessProcessStepInstances)
      .where(gte(businessProcessStepInstances.startedAt, rangeStart))
      .all();

    // Group by step key
    const stepStats = new Map<string, {
      total: number;
      completed: number;
      errors: number;
      totalDuration: number;
    }>();

    stepInstances.forEach(si => {
      const existing = stepStats.get(si.stepKey) || {
        total: 0,
        completed: 0,
        errors: 0,
        totalDuration: 0,
      };

      existing.total++;
      if (si.status === 'completed') {
        existing.completed++;
        if (si.startedAt && si.completedAt) {
          existing.totalDuration += 
            new Date(si.completedAt).getTime() - new Date(si.startedAt).getTime();
        }
      }
      if (si.status === 'failed') {
        existing.errors++;
      }

      stepStats.set(si.stepKey, existing);
    });

    // Build step analytics with definition info
    const stepAnalytics = definition.steps
      .filter(s => s.type !== 'start_event' && s.type !== 'gateway')
      .map(step => {
        const stats = stepStats.get(step.key) || {
          total: 0,
          completed: 0,
          errors: 0,
          totalDuration: 0,
        };

        return {
          stepKey: step.key,
          title: step.title,
          lane: step.lane,
          isManual: step.isManual,
          automationAction: step.automationAction,
          metrics: {
            total: stats.total,
            completed: stats.completed,
            errors: stats.errors,
            successRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
            avgDurationMs: stats.completed > 0 
              ? Math.round(stats.totalDuration / stats.completed)
              : 0,
            avgDurationFormatted: stats.completed > 0
              ? formatDuration(stats.totalDuration / stats.completed)
              : 'N/A',
          },
        };
      });

    // Lane analytics
    const laneStats = new Map<string, { total: number; completed: number; duration: number }>();
    stepInstances.forEach(si => {
      const step = definition.steps.find(s => s.key === si.stepKey);
      if (!step) return;

      const lane = step.lane;
      const existing = laneStats.get(lane) || { total: 0, completed: 0, duration: 0 };

      existing.total++;
      if (si.status === 'completed') {
        existing.completed++;
        if (si.startedAt && si.completedAt) {
          existing.duration += 
            new Date(si.completedAt).getTime() - new Date(si.startedAt).getTime();
        }
      }
      laneStats.set(lane, existing);
    });

    const laneAnalytics = Array.from(laneStats.entries()).map(([lane, stats]) => ({
      lane,
      total: stats.total,
      completed: stats.completed,
      avgDurationMs: stats.completed > 0 ? Math.round(stats.duration / stats.completed) : 0,
    }));

    // Automation success rates
    const automations = await db
      .select()
      .from(businessProcessAutomations)
      .where(gte(businessProcessAutomations.startedAt, rangeStart))
      .all();

    const automationStats = new Map<string, { total: number; success: number; failed: number }>();
    automations.forEach(a => {
      const existing = automationStats.get(a.automationAction) || { total: 0, success: 0, failed: 0 };
      existing.total++;
      if (a.status === 'completed') existing.success++;
      if (a.status === 'failed') existing.failed++;
      automationStats.set(a.automationAction, existing);
    });

    const automationAnalytics = Array.from(automationStats.entries()).map(([action, stats]) => ({
      actionType: action,
      total: stats.total,
      success: stats.success,
      failed: stats.failed,
      successRate: stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0,
    }));

    // Current bottlenecks (steps where instances are waiting)
    const waitingByStep = new Map<string, number>();
    runningInstances; // Already have this count
    
    const runningInstList = allInstances.filter(i => i.status === 'running');
    runningInstList.forEach(inst => {
      if (inst.currentStepKey) {
        waitingByStep.set(
          inst.currentStepKey, 
          (waitingByStep.get(inst.currentStepKey) || 0) + 1
        );
      }
    });

    const bottlenecks = Array.from(waitingByStep.entries())
      .map(([stepKey, count]) => {
        const step = definition.steps.find(s => s.key === stepKey);
        return {
          stepKey,
          title: step?.title || stepKey,
          lane: step?.lane || 'Unknown',
          waitingCount: count,
        };
      })
      .sort((a, b) => b.waitingCount - a.waitingCount)
      .slice(0, 5);

    // Trend data (by day)
    const dailyTrend = new Map<string, { started: number; completed: number }>();
    allInstances.forEach(inst => {
      if (inst.startedAt) {
        const dateKey = new Date(inst.startedAt).toISOString().split('T')[0];
        const existing = dailyTrend.get(dateKey) || { started: 0, completed: 0 };
        existing.started++;
        dailyTrend.set(dateKey, existing);
      }
      if (inst.status === 'completed' && inst.endedAt) {
        const dateKey = new Date(inst.endedAt).toISOString().split('T')[0];
        const existing = dailyTrend.get(dateKey) || { started: 0, completed: 0 };
        existing.completed++;
        dailyTrend.set(dateKey, existing);
      }
    });

    const trend = Array.from(dailyTrend.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, counts]) => ({
        date,
        started: counts.started,
        completed: counts.completed,
      }));

    return NextResponse.json({
      dateRange: {
        start: rangeStart.toISOString(),
        end: rangeEnd.toISOString(),
      },
      processDefinition: {
        key: definition.key,
        name: definition.name,
        version: definition.version,
      },
      overview: {
        total: totalInstances,
        running: runningInstances,
        completed: completedInstances,
        canceled: canceledInstances,
        completionRate: totalInstances > 0 
          ? Math.round((completedInstances / totalInstances) * 100) 
          : 0,
        avgCompletionTimeMs: Math.round(avgCompletionTime),
        avgCompletionTimeFormatted: formatDuration(avgCompletionTime),
      },
      stepAnalytics,
      laneAnalytics,
      automationAnalytics,
      bottlenecks,
      trend,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function formatDuration(ms: number): string {
  if (ms === 0) return '0s';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
