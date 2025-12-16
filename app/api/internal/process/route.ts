/**
 * Business Process API Routes
 * 
 * GET  /api/internal/process - List all process instances
 * POST /api/internal/process - Create new process instance
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { desc, eq, and, or, sql } from 'drizzle-orm';

import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { processInstances, processDefinitions, leads, projects, clients } from '@/lib/db/schema';
import {
  createProcessInstance,
  getActiveBusinessProcessDefinition,
  startProcessFromLead,
} from '@/lib/workflow/processEngine';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const leadId = searchParams.get('leadId');
  const projectId = searchParams.get('projectId');
  const limit = parseInt(searchParams.get('limit') || '50');

  const db = getDb();

  try {
    let query = db
      .select({
        instance: processInstances,
        lead: leads,
        project: projects,
      })
      .from(processInstances)
      .leftJoin(projects, eq(processInstances.projectId, projects.id))
      .leftJoin(leads, eq(projects.leadId, leads.id))
      .orderBy(desc(processInstances.startedAt))
      .limit(limit);

    const conditions = [];

    if (status && ['running', 'completed', 'canceled'].includes(status)) {
      conditions.push(eq(processInstances.status, status as 'running' | 'completed' | 'canceled'));
    }
    if (projectId) {
      conditions.push(eq(processInstances.projectId, projectId));
    }

    const results = await query.all();

    // Enrich with process definition info
    const { definition } = await getActiveBusinessProcessDefinition();

    const enrichedResults = results.map((row) => {
      const currentStep = definition.steps.find(
        (s) => s.key === row.instance.currentStepKey
      );

      return {
        id: row.instance.id,
        status: row.instance.status,
        currentStepKey: row.instance.currentStepKey,
        currentStepTitle: currentStep?.title || 'Unknown',
        currentLane: currentStep?.lane || 'Unknown',
        projectId: row.instance.projectId,
        projectName: row.project?.name,
        leadName: row.lead?.name,
        startedAt: row.instance.startedAt,
        endedAt: row.instance.endedAt,
      };
    });

    return NextResponse.json({
      instances: enrichedResults,
      total: enrichedResults.length,
    });
  } catch (error) {
    console.error('Error fetching process instances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch process instances' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { leadId, projectId, clientId, initialData } = body;

    let instance;

    if (leadId) {
      // Start process from existing lead
      instance = await startProcessFromLead(leadId, session.user.id);
    } else {
      // Create new process instance
      instance = await createProcessInstance({
        projectId,
        clientId,
        createdByUserId: session.user.id,
        initialData,
      });
    }

    return NextResponse.json({
      success: true,
      instance: {
        id: instance.id,
        status: instance.status,
        currentStepKey: instance.currentStepKey,
        startedAt: instance.startedAt,
      },
    });
  } catch (error) {
    console.error('Error creating process instance:', error);
    return NextResponse.json(
      { error: 'Failed to create process instance' },
      { status: 500 }
    );
  }
}
