/**
 * Bottleneck Detection API
 * 
 * GET /api/internal/process/bottlenecks - Get bottleneck analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import {
  runBottleneckAnalysis,
  getStepMetrics,
  getLaneMetrics,
  getResourceUtilization,
  getProcessFlowMetrics,
} from '@/lib/workflow/bottleneckDetection';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admin/pm can view bottleneck analysis
  const userRole = session.user.role;
  if (!['admin', 'pm'].includes(userRole || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const periodDays = parseInt(searchParams.get('period') || '30');
  const type = searchParams.get('type') || 'full';

  try {
    switch (type) {
      case 'steps':
        const stepMetrics = await getStepMetrics(periodDays);
        return NextResponse.json({ stepMetrics });

      case 'lanes':
        const laneMetrics = await getLaneMetrics(periodDays);
        return NextResponse.json({ laneMetrics });

      case 'resources':
        const resourceUtilization = await getResourceUtilization();
        return NextResponse.json({ resourceUtilization });

      case 'flow':
        const flowMetrics = await getProcessFlowMetrics(periodDays);
        return NextResponse.json({ flowMetrics });

      case 'full':
      default:
        const analysis = await runBottleneckAnalysis(periodDays);
        return NextResponse.json(analysis);
    }
  } catch (error) {
    console.error('Error running bottleneck analysis:', error);
    return NextResponse.json(
      { error: 'Failed to run bottleneck analysis' },
      { status: 500 }
    );
  }
}
