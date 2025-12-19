/**
 * SLA Monitoring API
 * 
 * GET  /api/internal/process/sla - Get SLA status overview
 * GET  /api/internal/process/sla/[id] - Get SLA status for a specific process
 * POST /api/internal/process/sla/check - Run SLA check job
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import {
  getSLAAnalytics,
  checkAllSLABreaches,
  getProcessSLASummary,
  runSLACheckJob,
  DEFAULT_SLA_RULES,
} from '@/lib/workflow/slaMonitoring';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const periodDays = parseInt(searchParams.get('period') || '30');
  const processId = searchParams.get('processId');

  try {
    if (processId) {
      // Get SLA status for specific process
      const summary = await getProcessSLASummary(processId);
      if (!summary) {
        return NextResponse.json({ error: 'Process not found' }, { status: 404 });
      }
      return NextResponse.json(summary);
    }

    // Get overall SLA overview
    const [analytics, breachStatus] = await Promise.all([
      getSLAAnalytics(periodDays),
      checkAllSLABreaches(),
    ]);

    return NextResponse.json({
      analytics,
      currentStatus: {
        breached: breachStatus.breached.length,
        warning: breachStatus.warning.length,
        onTrack: breachStatus.onTrack.length,
        processes: {
          breached: breachStatus.breached,
          warning: breachStatus.warning,
        },
      },
      rules: DEFAULT_SLA_RULES,
    });
  } catch (error) {
    console.error('Error fetching SLA data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SLA data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admin/pm can run SLA check
  const userRole = session.user.role;
  if (!['admin', 'pm'].includes(userRole || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'check') {
      // Run SLA check job
      const result = await runSLACheckJob();
      return NextResponse.json({
        success: true,
        ...result,
        message: `Processed ${result.processed} steps, triggered ${result.escalations} escalations`,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error running SLA check:', error);
    return NextResponse.json(
      { error: 'Failed to run SLA check' },
      { status: 500 }
    );
  }
}
