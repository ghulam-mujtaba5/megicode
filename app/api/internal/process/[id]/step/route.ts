/**
 * Business Process Step Execution API
 * 
 * POST /api/internal/process/[id]/step - Execute a specific step
 * GET  /api/internal/process/[id]/step - Get available steps for current position
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { eq, and } from 'drizzle-orm';

import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { processInstances, events, businessProcessStepInstances, businessProcessData } from '@/lib/db/schema';
import {
  executeStep,
  getActiveBusinessProcessDefinition,
} from '@/lib/workflow/processEngine';
import { getNextSteps, StepType } from '@/lib/workflow/businessProcess';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  try {
    const instance = await db
      .select()
      .from(processInstances)
      .where(eq(processInstances.id, id))
      .get();

    if (!instance) {
      return NextResponse.json({ error: 'Process instance not found' }, { status: 404 });
    }

    const { definition } = await getActiveBusinessProcessDefinition();
    const currentStep = definition.steps.find(s => s.key === instance.currentStepKey);

    if (!currentStep) {
      return NextResponse.json({ error: 'Current step not found in definition' }, { status: 404 });
    }

    // Get step history
    const stepHistory = await db
      .select()
      .from(businessProcessStepInstances)
      .where(eq(businessProcessStepInstances.processInstanceId, id))
      .orderBy(businessProcessStepInstances.startedAt)
      .all();

    // Get process data for context
    const processData = await db
      .select()
      .from(businessProcessData)
      .where(eq(businessProcessData.processInstanceId, id))
      .all();

    // Build context object
    const context: Record<string, unknown> = {};
    processData.forEach(d => {
      try {
        context[d.dataKey] = d.dataValue ? JSON.parse(d.dataValue) : null;
      } catch {
        context[d.dataKey] = d.dataValue;
      }
    });

    // Calculate available next steps (for gateways)
    let availableNextSteps: Array<{ key: string; title: string; condition?: string }> = [];
    if (currentStep.type === 'gateway') {
      // For gateway, get all possible paths
      const possibleNextKeys = currentStep.next ? [currentStep.next] : [];
      availableNextSteps = possibleNextKeys.map(key => {
        const step = definition.steps.find(s => s.key === key);
        return {
          key,
          title: step?.title || key,
        };
      });
    }

    // Check if user can complete current step based on role
    const userRole = session.user.role || '';
    const canComplete = currentStep.assigneeRole
      ? currentStep.assigneeRole.toLowerCase() === userRole.toLowerCase() ||
        userRole === 'admin'
      : true;

    return NextResponse.json({
      currentStep: {
        key: currentStep.key,
        title: currentStep.title,
        type: currentStep.type,
        assigneeRole: currentStep.assigneeRole,
        next: currentStep.next,
      },
      availableNextSteps,
      canComplete,
      stepHistory: stepHistory.map(s => ({
        stepKey: s.stepKey,
        status: s.status,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
        assignedToUserId: s.assignedToUserId,
        outputData: s.outputData,
      })),
      context,
      processStatus: instance.status,
    });
  } catch (error) {
    console.error('Error fetching step info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch step information' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  try {
    const body = await request.json();
    const { stepKey, outputData, notes, gatewayDecision, skipValidation } = body;

    const instance = await db
      .select()
      .from(processInstances)
      .where(eq(processInstances.id, id))
      .get();

    if (!instance) {
      return NextResponse.json({ error: 'Process instance not found' }, { status: 404 });
    }

    if (instance.status !== 'running') {
      return NextResponse.json(
        { error: `Cannot execute step on ${instance.status} process` },
        { status: 400 }
      );
    }

    // Get process definition
    const { definition } = await getActiveBusinessProcessDefinition();
    const targetStep = definition.steps.find(s => s.key === (stepKey || instance.currentStepKey));

    if (!targetStep) {
      return NextResponse.json({ error: 'Step not found in process definition' }, { status: 404 });
    }

    // Validate user role can execute this step
    const userRole = session.user.role || '';
    const canExecute =
      targetStep.lane === 'AutomationCRM' ||
      !targetStep.participant ||
      targetStep.participant.toLowerCase() === userRole.toLowerCase() ||
      userRole === 'admin';

    if (!canExecute && !skipValidation) {
      return NextResponse.json(
        { error: `User role ${userRole} cannot execute step in ${targetStep.lane} lane` },
        { status: 403 }
      );
    }

    // Execute the step
    const result = await executeStep(id, targetStep.key, {
      completedByUserId: session.user.id,
      outputData,
      notes,
      gatewayDecision,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Get next step details
    const nextStep = result.nextStepKey
      ? definition.steps.find(s => s.key === result.nextStepKey)
      : null;

    return NextResponse.json({
      success: true,
      completedStep: {
        key: targetStep.key,
        title: targetStep.title,
      },
      nextStep: nextStep
        ? {
            key: nextStep.key,
            title: nextStep.title,
            type: nextStep.type,
            lane: nextStep.lane,
            isManual: nextStep.isManual,
          }
        : null,
      processEnded: !result.nextStepKey || targetStep.type === 'end_event',
    });
  } catch (error) {
    console.error('Error executing step:', error);
    return NextResponse.json(
      { error: 'Failed to execute step' },
      { status: 500 }
    );
  }
}
