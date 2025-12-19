/**
 * Notification Preferences API Routes
 * 
 * GET /api/internal/notifications/preferences - Get user preferences
 * PUT /api/internal/notifications/preferences - Update user preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import {
  getUserNotificationPreferences,
  upsertUserNotificationPreferences,
} from '@/lib/notifications';

// GET - Get notification preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await getUserNotificationPreferences(session.user.id);
    
    // Return defaults if no preferences exist
    if (!preferences) {
      return NextResponse.json({
        taskAssigned: true,
        taskCompleted: true,
        taskUpdated: true,
        taskDueSoon: true,
        taskOverdue: true,
        projectUpdates: true,
        leadUpdates: true,
        mentions: true,
        comments: true,
        slaAlerts: true,
        approvalRequests: true,
        systemAlerts: true,
        inAppEnabled: true,
        emailEnabled: true,
        emailDigest: 'instant',
        quietHours: null,
      });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// PUT - Update notification preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate and sanitize input
    const allowedFields = [
      'taskAssigned',
      'taskCompleted',
      'taskUpdated',
      'taskDueSoon',
      'taskOverdue',
      'projectUpdates',
      'leadUpdates',
      'mentions',
      'comments',
      'slaAlerts',
      'approvalRequests',
      'systemAlerts',
      'inAppEnabled',
      'emailEnabled',
      'emailDigest',
      'quietHours',
    ];

    const preferences: Record<string, unknown> = {};
    
    for (const field of allowedFields) {
      if (field in body) {
        if (field === 'emailDigest') {
          // Validate emailDigest value
          const validDigests = ['instant', 'hourly', 'daily', 'weekly', 'off'];
          if (validDigests.includes(body[field])) {
            preferences[field] = body[field];
          }
        } else if (field === 'quietHours') {
          // quietHours should be JSON or null
          preferences[field] = body[field] ? JSON.stringify(body[field]) : null;
        } else {
          // Boolean fields
          preferences[field] = Boolean(body[field]);
        }
      }
    }

    await upsertUserNotificationPreferences(session.user.id, preferences);
    
    const updated = await getUserNotificationPreferences(session.user.id);
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
