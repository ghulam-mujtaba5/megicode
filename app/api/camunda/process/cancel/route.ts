/**
 * API Route: POST /api/camunda/process/cancel
 * Cancel a running process instance
 */

import { NextRequest, NextResponse } from 'next/server';
import { cancelProcessInstance } from '@/lib/camunda';
import { db } from '@/lib/db';
import { processInstances } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { processInstanceKey } = body;

    if (!processInstanceKey) {
      return NextResponse.json(
        { error: 'processInstanceKey is required' },
        { status: 400 }
      );
    }

    // Cancel in Camunda
    await cancelProcessInstance(processInstanceKey);

    // Update local database
    await db
      .update(processInstances)
      .set({
        status: 'cancelled',
        endedAt: new Date(),
      })
      .where(eq(processInstances.processInstanceKey, processInstanceKey));

    return NextResponse.json({
      success: true,
      message: 'Process instance cancelled',
    });
  } catch (error: any) {
    console.error('[API] Error cancelling process:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel process' },
      { status: 500 }
    );
  }
}
