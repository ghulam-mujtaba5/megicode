/**
 * API Route: GET /api/camunda/health
 * Check Camunda connection health
 */

import { NextResponse } from 'next/server';
import { getTopology } from '@/lib/camunda';

export async function GET() {
  try {
    const topology = await getTopology();

    return NextResponse.json({
      success: true,
      status: 'connected',
      topology: {
        brokers: topology.brokers?.length || 0,
        clusterSize: topology.clusterSize,
        partitionsCount: topology.partitionsCount,
        replicationFactor: topology.replicationFactor,
        gatewayVersion: topology.gatewayVersion,
      },
    });
  } catch (error: any) {
    console.error('[API] Camunda health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        status: 'disconnected',
        error: error.message,
      },
      { status: 503 }
    );
  }
}
