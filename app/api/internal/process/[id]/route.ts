/**
 * Business Process Instance API Routes
 * 
 * GET    /api/internal/process/[id] - Get process instance details
 * PATCH  /api/internal/process/[id] - Update process instance
 * DELETE /api/internal/process/[id] - Cancel process instance
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { eq } from 'drizzle-orm';

import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { processInstances, events, leads, projects, clients } from '@/lib/db/schema';
import {
  getProcessInstance,
  executeStep,
  getActiveBusinessProcessDefinition,
} from '@/lib/workflow/processEngine';

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

    // Get related entities
    const project = instance.projectId
      ? await db.select().from(projects).where(eq(projects.id, instance.projectId)).get()
      : null;

    const lead = project?.leadId
      ? await db.select().from(leads).where(eq(leads.id, project.leadId)).get()
      : null;

    const client = project?.clientId
      ? await db.select().from(clients).where(eq(clients.id, project.clientId)).get()
      : null;

    // Get process definition
    const { definition } = await getActiveBusinessProcessDefinition();
    const currentStep = definition.steps.find(s => s.key === instance.currentStepKey);

    // Get recent events
    const recentEvents = await db
      .select()
      .from(events)
      .where(eq(events.instanceId, id))
      .orderBy(events.createdAt)
      .limit(50)
      .all();

    // Calculate progress
    const completedSteps = recentEvents.filter(e => e.type === 'step.completed').length;
    const totalSteps = definition.steps.filter(
      s => s.type !== 'start_event' && s.type !== 'gateway'
    ).length;

    return NextResponse.json({
      instance: {
        id: instance.id,
        status: instance.status,
        currentStepKey: instance.currentStepKey,
        currentStep: currentStep
          ? {
              key: currentStep.key,
              title: currentStep.title,
              type: currentStep.type,
              lane: currentStep.lane,
              participant: currentStep.participant,
              isManual: currentStep.isManual,
              description: currentStep.description,
            }
          : null,
        projectId: instance.projectId,
        startedAt: instance.startedAt,
        endedAt: instance.endedAt,
      },
      project: project
        ? {
            id: project.id,
            name: project.name,
            status: project.status,
          }
        : null,
      lead: lead
        ? {
            id: lead.id,
            name: lead.name,
            email: lead.email,
            company: lead.company,
            status: lead.status,
            srsUrl: lead.srsUrl,
          }
        : null,
      client: client
        ? {
            id: client.id,
            name: client.name,
            company: client.company,
          }
        : null,
      definition: {
        key: definition.key,
        name: definition.name,
        steps: definition.steps.map(s => ({
          key: s.key,
          title: s.title,
          type: s.type,
          lane: s.lane,
          isManual: s.isManual,
          automationAction: s.automationAction,
        })),
        lanes: definition.lanes,
      },
      events: recentEvents.map(e => ({
        id: e.id,
        type: e.type,
        createdAt: e.createdAt,
        payload: e.payloadJson,
      })),
      progress: {
        completed: completedSteps,
        total: totalSteps,
        percentage: Math.round((completedSteps / totalSteps) * 100),
      },
    });
  } catch (error) {
    console.error('Error fetching process instance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch process instance' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { action, stepKey, outputData, notes, gatewayDecision } = body;

    const instance = await db
      .select()
      .from(processInstances)
      .where(eq(processInstances.id, id))
      .get();

    if (!instance) {
      return NextResponse.json({ error: 'Process instance not found' }, { status: 404 });
    }

    if (action === 'complete_step') {
      // Complete the current step and advance
      const result = await executeStep(id, stepKey || instance.currentStepKey || '', {
        completedByUserId: session.user.id,
        outputData,
        notes,
        gatewayDecision,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        nextStepKey: result.nextStepKey,
      });
    }

    if (action === 'update_data') {
      // Update process data without advancing
      await db.insert(events).values({
        id: crypto.randomUUID(),
        instanceId: id,
        type: 'data.updated',
        actorUserId: session.user.id,
        payloadJson: outputData,
        createdAt: new Date(),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating process instance:', error);
    return NextResponse.json(
      { error: 'Failed to update process instance' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin or PM
  const userRole = session.user.role;
  if (!['admin', 'pm'].includes(userRole || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const db = getDb();

  try {
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    const now = new Date();

    await db
      .update(processInstances)
      .set({
        status: 'canceled',
        endedAt: now,
      })
      .where(eq(processInstances.id, id));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      instanceId: id,
      type: 'process.canceled',
      actorUserId: session.user.id,
      payloadJson: { reason, canceledAt: now },
      createdAt: now,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error canceling process instance:', error);
    return NextResponse.json(
      { error: 'Failed to cancel process instance' },
      { status: 500 }
    );
  }
}
