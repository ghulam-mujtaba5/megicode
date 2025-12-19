/**
 * Automation Rules API
 * 
 * GET  /api/internal/process/automation - Get automation rules and execution history
 * POST /api/internal/process/automation - Test or manage automation rules
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { eq, desc, gte, and } from 'drizzle-orm';

import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { events } from '@/lib/db/schema';
import {
  DEFAULT_AUTOMATION_RULES,
  executeAutomationRules,
  findMatchingRules,
  type AutomationRule,
  type AutomationExecutionContext,
} from '@/lib/workflow/automationRules';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'rules';
  const periodDays = parseInt(searchParams.get('period') || '7');

  try {
    const db = getDb();

    switch (type) {
      case 'rules':
        // Return all available automation rules
        return NextResponse.json({
          rules: DEFAULT_AUTOMATION_RULES,
          total: DEFAULT_AUTOMATION_RULES.length,
          enabledCount: DEFAULT_AUTOMATION_RULES.filter(r => r.enabled).length,
        });

      case 'history':
        // Get automation execution history
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);

        const executionHistory = await db
          .select()
          .from(events)
          .where(
            and(
              eq(events.type, 'automation.executed'),
              gte(events.createdAt, startDate)
            )
          )
          .orderBy(desc(events.createdAt))
          .limit(100)
          .all();

        const failedHistory = await db
          .select()
          .from(events)
          .where(
            and(
              eq(events.type, 'automation.failed'),
              gte(events.createdAt, startDate)
            )
          )
          .orderBy(desc(events.createdAt))
          .limit(50)
          .all();

        return NextResponse.json({
          executed: executionHistory.map(e => ({
            id: e.id,
            processInstanceId: e.instanceId,
            ...e.payloadJson,
            createdAt: e.createdAt,
          })),
          failed: failedHistory.map(e => ({
            id: e.id,
            processInstanceId: e.instanceId,
            ...e.payloadJson,
            createdAt: e.createdAt,
          })),
          summary: {
            totalExecuted: executionHistory.length,
            totalFailed: failedHistory.length,
            successRate: executionHistory.length > 0
              ? Math.round((executionHistory.length / (executionHistory.length + failedHistory.length)) * 100)
              : 100,
          },
        });

      case 'scheduled':
        // Get scheduled reminders/actions
        const scheduledActions = await db
          .select()
          .from(events)
          .where(eq(events.type, 'automation.reminder_scheduled'))
          .orderBy(desc(events.createdAt))
          .limit(50)
          .all();

        return NextResponse.json({
          scheduled: scheduledActions.map(e => ({
            id: e.id,
            processInstanceId: e.instanceId,
            ...e.payloadJson,
            createdAt: e.createdAt,
          })),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: rules, history, or scheduled' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching automation data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automation data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admin can manage automation
  const userRole = session.user.role;
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'test':
        // Test which rules would match for a given context
        const { context } = body as { context: AutomationExecutionContext };

        if (!context || !context.triggerType) {
          return NextResponse.json(
            { error: 'Missing required context with triggerType' },
            { status: 400 }
          );
        }

        const matchingRules = findMatchingRules(context);

        return NextResponse.json({
          matchingRules: matchingRules.map(r => ({
            id: r.id,
            name: r.name,
            action: r.action,
            priority: r.priority,
          })),
          totalMatched: matchingRules.length,
          wouldExecute: matchingRules.filter(r => r.enabled).length,
        });

      case 'execute':
        // Manually trigger automation for testing
        const { executeContext, dryRun } = body as {
          executeContext: AutomationExecutionContext;
          dryRun?: boolean;
        };

        if (!executeContext || !executeContext.processInstanceId) {
          return NextResponse.json(
            { error: 'Missing required executeContext with processInstanceId' },
            { status: 400 }
          );
        }

        if (dryRun) {
          const matchedRules = findMatchingRules(executeContext);
          return NextResponse.json({
            dryRun: true,
            wouldExecute: matchedRules.map(r => ({
              id: r.id,
              name: r.name,
              action: r.action,
              actionConfig: r.actionConfig,
            })),
          });
        }

        const results = await executeAutomationRules(executeContext);

        return NextResponse.json({
          success: true,
          results,
          executed: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
        });

      case 'toggle':
        // Toggle a rule on/off (would require custom rules storage)
        return NextResponse.json({
          success: false,
          message: 'Custom rule management not yet implemented. Edit DEFAULT_AUTOMATION_RULES in code.',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: test, execute, or toggle' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing automation action:', error);
    return NextResponse.json(
      { error: 'Failed to process automation action' },
      { status: 500 }
    );
  }
}
