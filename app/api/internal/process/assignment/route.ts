/**
 * Step Assignment API
 * 
 * GET  /api/internal/process/assignment - Get workload overview
 * POST /api/internal/process/assignment - Assign or reassign a step
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import {
  getTeamWorkloadOverview,
  getTeamMemberProfiles,
  findBestAssignee,
  autoAssignStep,
  manuallyAssignStep,
  reassignStep,
} from '@/lib/workflow/stepAssignment';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'overview';
  const role = searchParams.get('role');

  try {
    switch (type) {
      case 'profiles':
        const roleFilter = role ? [role as any] : undefined;
        const profiles = await getTeamMemberProfiles(roleFilter);
        return NextResponse.json({ profiles });

      case 'candidates':
        const stepKey = searchParams.get('stepKey');
        const lane = searchParams.get('lane');
        const participant = searchParams.get('participant');

        if (!stepKey || !lane || !participant) {
          return NextResponse.json(
            { error: 'Missing required parameters: stepKey, lane, participant' },
            { status: 400 }
          );
        }

        const projectOwnerId = searchParams.get('projectOwnerId') || undefined;
        const previousAssigneeId = searchParams.get('previousAssigneeId') || undefined;

        const result = await findBestAssignee(
          stepKey,
          lane as any,
          participant as any,
          projectOwnerId,
          previousAssigneeId
        );

        return NextResponse.json(result);

      case 'overview':
      default:
        const overview = await getTeamWorkloadOverview();
        return NextResponse.json(overview);
    }
  } catch (error) {
    console.error('Error fetching assignment data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignment data' },
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
    const { action, processInstanceId, stepInstanceId, stepKey, lane, participant } = body;

    switch (action) {
      case 'auto':
        // Auto-assign a step
        if (!processInstanceId || !stepInstanceId || !stepKey || !lane || !participant) {
          return NextResponse.json(
            { error: 'Missing required fields for auto-assignment' },
            { status: 400 }
          );
        }

        const autoResult = await autoAssignStep(
          processInstanceId,
          stepInstanceId,
          stepKey,
          lane,
          participant,
          body.projectOwnerId,
          body.previousAssigneeId
        );

        return NextResponse.json(autoResult);

      case 'manual':
        // Manual assignment
        const { assignToUserId, notes } = body;

        if (!processInstanceId || !stepInstanceId || !assignToUserId) {
          return NextResponse.json(
            { error: 'Missing required fields for manual assignment' },
            { status: 400 }
          );
        }

        const manualResult = await manuallyAssignStep(
          processInstanceId,
          stepInstanceId,
          assignToUserId,
          session.user.id,
          notes
        );

        return NextResponse.json(manualResult);

      case 'reassign':
        // Reassignment
        const { newAssigneeId, reason } = body;

        if (!processInstanceId || !stepInstanceId || !newAssigneeId || !reason) {
          return NextResponse.json(
            { error: 'Missing required fields for reassignment' },
            { status: 400 }
          );
        }

        const reassignResult = await reassignStep(
          processInstanceId,
          stepInstanceId,
          newAssigneeId,
          session.user.id,
          reason
        );

        return NextResponse.json(reassignResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: auto, manual, or reassign' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing assignment:', error);
    return NextResponse.json(
      { error: 'Failed to process assignment' },
      { status: 500 }
    );
  }
}
