/**
 * Notifications API Routes
 * 
 * GET /api/internal/notifications - Get notifications for current user
 * POST /api/internal/notifications - Create a notification (admin only)
 * PATCH /api/internal/notifications - Mark notifications as read
 * DELETE /api/internal/notifications - Clear/dismiss notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import {
  getNotifications,
  getUnreadCount,
  getNotificationStats,
  createNotification,
  markAsRead,
  markAllAsRead,
  dismissNotification,
  clearAllNotifications,
  type CreateNotificationInput,
  type NotificationFilters,
} from '@/lib/notifications';
import { NotificationType, NotificationPriority } from '@/lib/db/schema';

// GET - Get notifications for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Get unread count only
    if (action === 'count') {
      const count = await getUnreadCount(session.user.id);
      return NextResponse.json({ count });
    }
    
    // Get stats
    if (action === 'stats') {
      const stats = await getNotificationStats(session.user.id);
      return NextResponse.json(stats);
    }

    // Get notifications with filters
    const filters: NotificationFilters = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    const isReadParam = searchParams.get('isRead');
    if (isReadParam !== null) {
      filters.isRead = isReadParam === 'true';
    }

    const typeParam = searchParams.get('type');
    if (typeParam) {
      filters.type = typeParam as NotificationType;
    }

    const priorityParam = searchParams.get('priority');
    if (priorityParam) {
      filters.priority = priorityParam as NotificationPriority;
    }

    const entityType = searchParams.get('entityType');
    if (entityType) {
      filters.entityType = entityType;
    }

    const entityId = searchParams.get('entityId');
    if (entityId) {
      filters.entityId = entityId;
    }

    const notifications = await getNotifications(session.user.id, filters);
    const unreadCount = await getUnreadCount(session.user.id);

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        hasMore: notifications.length === filters.limit,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Create a notification (admin only, or system use)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can create arbitrary notifications
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    const input: CreateNotificationInput = {
      userId: body.userId,
      type: body.type || 'system',
      title: body.title,
      message: body.message,
      priority: body.priority || 'normal',
      entityType: body.entityType,
      entityId: body.entityId,
      link: body.link,
      actorUserId: session.user.id,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      actions: body.actions,
      metadata: body.metadata,
    };

    if (!input.userId || !input.title) {
      return NextResponse.json(
        { error: 'userId and title are required' },
        { status: 400 }
      );
    }

    const notification = await createNotification(input);
    
    if (!notification) {
      return NextResponse.json(
        { message: 'Notification not created (disabled by settings or user preferences)' },
        { status: 200 }
      );
    }

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, notificationId, notificationIds } = body;

    switch (action) {
      case 'markRead':
        if (notificationId) {
          await markAsRead(notificationId, session.user.id);
          return NextResponse.json({ success: true });
        }
        if (notificationIds && Array.isArray(notificationIds)) {
          await Promise.all(
            notificationIds.map((id: string) => markAsRead(id, session.user.id))
          );
          return NextResponse.json({ success: true, count: notificationIds.length });
        }
        return NextResponse.json(
          { error: 'notificationId or notificationIds required' },
          { status: 400 }
        );

      case 'markAllRead':
        await markAllAsRead(session.user.id);
        return NextResponse.json({ success: true });

      case 'dismiss':
        if (!notificationId) {
          return NextResponse.json(
            { error: 'notificationId required' },
            { status: 400 }
          );
        }
        await dismissNotification(notificationId, session.user.id);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: markRead, markAllRead, or dismiss' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

// DELETE - Clear all notifications
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await clearAllNotifications(session.user.id);
    
    return NextResponse.json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json(
      { error: 'Failed to clear notifications' },
      { status: 500 }
    );
  }
}
