/**
 * API Route: POST /api/camunda/process/start
 * Start a new process instance
 */

import { NextRequest, NextResponse } from 'next/server';
import { startProcessInstance } from '@/lib/camunda';
import { db } from '@/lib/db';
import { processInstances } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bpmnProcessId, variables, version } = body;

    if (!bpmnProcessId) {
      return NextResponse.json(
        { error: 'bpmnProcessId is required' },
        { status: 400 }
      );
    }

    // Start process instance in Camunda
    const processInstance = await startProcessInstance({
      bpmnProcessId,
      variables: variables || {},
      version,
    });

    // Store in local database
    const [dbRecord] = await db
      .insert(processInstances)
      .values({
        processInstanceKey: processInstance.processInstanceKey,
        processDefinitionKey: processInstance.processDefinitionKey,
        bpmnProcessId: processInstance.bpmnProcessId,
        version: processInstance.version,
        variables: processInstance.variables,
        status: 'running',
        projectId: variables?.projectId || null,
        leadId: variables?.leadId || null,
        currentStep: bpmnProcessId,
      })
      .returning();

    return NextResponse.json({
      success: true,
      processInstance: {
        ...processInstance,
        id: dbRecord.id,
      },
    });
  } catch (error: any) {
    console.error('[API] Error starting process:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start process' },
      { status: 500 }
    );
  }
}
