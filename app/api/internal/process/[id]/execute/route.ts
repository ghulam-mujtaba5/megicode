/**
 * Workflow Step Execution API
 * 
 * POST /api/internal/process/[id]/execute
 * 
 * Executes a workflow step and advances the process to the next step
 * Handles both manual and automated steps
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { eq } from 'drizzle-orm';

import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { processInstances, businessProcessStepInstances, events, tasks, leads, proposals } from '@/lib/db/schema';
import {
  getActiveBusinessProcessDefinition,
  executeStep,
} from '@/lib/workflow/processEngine';
import { getNextSteps, getStepByKey } from '@/lib/workflow/businessProcess';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: instanceId } = await params;
  const db = getDb();

  try {
    const body = await request.json();
    const { stepKey, action, data, notes } = body;

    // Validate process instance exists
    const instance = await db
      .select()
      .from(processInstances)
      .where(eq(processInstances.id, instanceId))
      .get();

    if (!instance) {
      return NextResponse.json({ error: 'Process instance not found' }, { status: 404 });
    }

    if (instance.status !== 'running') {
      return NextResponse.json(
        { error: 'Process is not running' },
        { status: 400 }
      );
    }

    // Get process definition
    const { definition } = await getActiveBusinessProcessDefinition();
    const currentStep = getStepByKey(definition, instance.currentStepKey || '');

    if (!currentStep) {
      return NextResponse.json(
        { error: 'Current step not found in definition' },
        { status: 400 }
      );
    }

    // Verify the step being executed matches the current step (or allow force progression)
    if (stepKey && stepKey !== instance.currentStepKey && action !== 'skip') {
      return NextResponse.json(
        { error: 'Step mismatch - process is at a different step' },
        { status: 400 }
      );
    }

    const now = new Date();
    let result;

    switch (action) {
      case 'complete': {
        // Execute the current step
        result = await executeStep(instanceId, instance.currentStepKey || '', {
          completedByUserId: session.user.id,
          outputData: data,
          notes,
        });
        break;
      }

      case 'gateway_decision': {
        // Handle gateway decisions
        if (currentStep.type !== 'gateway') {
          return NextResponse.json(
            { error: 'Current step is not a gateway' },
            { status: 400 }
          );
        }

        const decision = data?.decision;
        if (!decision) {
          return NextResponse.json(
            { error: 'Gateway decision required' },
            { status: 400 }
          );
        }

        result = await executeStep(instanceId, instance.currentStepKey || '', {
          completedByUserId: session.user.id,
          outputData: data,
          gatewayDecision: decision,
        });
        break;
      }

      case 'skip': {
        // Skip the current step (admin only)
        if (session.user.role !== 'admin') {
          return NextResponse.json(
            { error: 'Only admins can skip steps' },
            { status: 403 }
          );
        }

        // Record skip event
        await db.insert(events).values({
          id: crypto.randomUUID(),
          instanceId,
          type: 'step.skipped',
          actorUserId: session.user.id,
          payloadJson: { stepKey: instance.currentStepKey, reason: notes },
          createdAt: now,
        });

        // Find next step manually
        const nextSteps = getNextSteps(definition, instance.currentStepKey || '', {});
        const nextStepKey = nextSteps[0];

        if (nextStepKey) {
          await db
            .update(processInstances)
            .set({ currentStepKey: nextStepKey })
            .where(eq(processInstances.id, instanceId));
        }

        result = { success: true, nextStepKey };
        break;
      }

      case 'cancel': {
        // Cancel the process
        await db
          .update(processInstances)
          .set({
            status: 'canceled',
            endedAt: now,
          })
          .where(eq(processInstances.id, instanceId));

        await db.insert(events).values({
          id: crypto.randomUUID(),
          instanceId,
          type: 'process.canceled',
          actorUserId: session.user.id,
          payloadJson: { reason: notes },
          createdAt: now,
        });

        result = { success: true, canceled: true };
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Get updated instance
    const updatedInstance = await db
      .select()
      .from(processInstances)
      .where(eq(processInstances.id, instanceId))
      .get();

    const newStep = updatedInstance?.currentStepKey
      ? getStepByKey(definition, updatedInstance.currentStepKey)
      : null;

    return NextResponse.json({
      success: true,
      result,
      currentStep: newStep
        ? {
            key: newStep.key,
            title: newStep.title,
            type: newStep.type,
            lane: newStep.lane,
            isManual: newStep.isManual,
          }
        : null,
      instanceStatus: updatedInstance?.status,
    });
  } catch (error) {
    console.error('Error executing workflow step:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow step' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/internal/process/[id]/execute
 * 
 * Get available actions for the current step
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: instanceId } = await params;
  const db = getDb();

  try {
    const instance = await db
      .select()
      .from(processInstances)
      .where(eq(processInstances.id, instanceId))
      .get();

    if (!instance) {
      return NextResponse.json({ error: 'Process instance not found' }, { status: 404 });
    }

    const { definition } = await getActiveBusinessProcessDefinition();
    const currentStep = getStepByKey(definition, instance.currentStepKey || '');

    if (!currentStep) {
      return NextResponse.json({
        instanceId,
        status: instance.status,
        currentStep: null,
        availableActions: [],
      });
    }

    // Determine available actions based on step type
    const actions = [];

    if (instance.status === 'running') {
      if (currentStep.type === 'gateway') {
        // Gateway - show decision options
        currentStep.gatewayConditions?.forEach(condition => {
          actions.push({
            type: 'gateway_decision',
            label: condition.label,
            decision: condition.targetStepKey,
            isDefault: condition.isDefault,
          });
        });
      } else if (currentStep.isManual) {
        // Manual task - show complete option
        actions.push({
          type: 'complete',
          label: 'Complete Step',
          description: currentStep.description,
          requiresData: getRequiredDataFields(currentStep),
        });
      }

      // Admin actions
      if (session.user.role === 'admin') {
        actions.push({
          type: 'skip',
          label: 'Skip Step',
          adminOnly: true,
        });
        actions.push({
          type: 'cancel',
          label: 'Cancel Process',
          adminOnly: true,
          dangerous: true,
        });
      }
    }

    return NextResponse.json({
      instanceId,
      status: instance.status,
      currentStep: {
        key: currentStep.key,
        title: currentStep.title,
        type: currentStep.type,
        lane: currentStep.lane,
        participant: currentStep.participant,
        description: currentStep.description,
        isManual: currentStep.isManual,
        automationAction: currentStep.automationAction,
        estimatedMinutes: currentStep.estimatedMinutes,
      },
      availableActions: actions,
      nextPossibleSteps: getNextSteps(definition, currentStep.key, {}).map(key => {
        const step = getStepByKey(definition, key);
        return step ? { key: step.key, title: step.title, lane: step.lane } : null;
      }).filter(Boolean),
    });
  } catch (error) {
    console.error('Error getting step actions:', error);
    return NextResponse.json(
      { error: 'Failed to get step actions' },
      { status: 500 }
    );
  }
}

function getRequiredDataFields(step: any): string[] {
  // Map step keys to required data fields
  const fieldMap: Record<string, string[]> = {
    schedule_discovery_call: ['discoveryCallScheduledAt'],
    gather_client_requirements: ['requirements', 'srsUrl'],
    prepare_proposal_draft: ['proposalTitle', 'proposalAmount'],
    sign_contract_client: ['contractSignedAt', 'contractUrl'],
    assign_project_team: ['teamMemberIds'],
    schedule_kickoff_meeting: ['kickoffMeetingScheduledAt'],
  };

  return fieldMap[step.key] || [];
}
