/**
 * API Route: POST /api/camunda/message/publish
 * Publish a message to Camunda (for message catch events)
 */

import { NextRequest, NextResponse } from 'next/server';
import { publishMessage } from '@/lib/camunda';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageName, correlationKey, variables, timeToLive } = body;

    if (!messageName || !correlationKey) {
      return NextResponse.json(
        { error: 'messageName and correlationKey are required' },
        { status: 400 }
      );
    }

    const result = await publishMessage(
      messageName,
      correlationKey,
      variables,
      timeToLive
    );

    return NextResponse.json({
      success: true,
      messageKey: result.key,
    });
  } catch (error: any) {
    console.error('[API] Error publishing message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to publish message' },
      { status: 500 }
    );
  }
}
