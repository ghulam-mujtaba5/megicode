/**
 * Notification Service
 * 
 * Centralized service for creating, managing, and delivering notifications.
 * Handles in-app notifications and can integrate with email/external services.
 */

import { eq, and, desc, lt, sql, isNull, or } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { 
  notifications, 
  userNotificationPreferences, 
  users,
  type NotificationType,
  type NotificationPriority,
  type Notification,
  type NewNotification
} from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { getBooleanSetting, SETTING_KEYS } from './settings';

// ==================== Types ====================

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  priority?: NotificationPriority;
  entityType?: string;
  entityId?: string;
  link?: string;
  actorUserId?: string;
  expiresAt?: Date;
  actions?: NotificationAction[];
  metadata?: Record<string, unknown>;
}

export interface NotificationAction {
  label: string;
  url: string;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: NotificationType | NotificationType[];
  priority?: NotificationPriority;
  entityType?: string;
  entityId?: string;
  limit?: number;
  offset?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

// ==================== Notification Templates ====================

export const NotificationTemplates = {
  // Task notifications
  taskAssigned: (taskTitle: string, projectName?: string): Partial<CreateNotificationInput> => ({
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: projectName 
      ? `You have been assigned to "${taskTitle}" in ${projectName}`
      : `You have been assigned to "${taskTitle}"`,
    priority: 'normal',
  }),

  taskCompleted: (taskTitle: string, completedBy: string): Partial<CreateNotificationInput> => ({
    type: 'task_completed',
    title: 'Task Completed',
    message: `"${taskTitle}" was completed by ${completedBy}`,
    priority: 'low',
  }),

  taskDueSoon: (taskTitle: string, dueIn: string): Partial<CreateNotificationInput> => ({
    type: 'task_due_soon',
    title: 'Task Due Soon',
    message: `"${taskTitle}" is due ${dueIn}`,
    priority: 'high',
  }),

  taskOverdue: (taskTitle: string): Partial<CreateNotificationInput> => ({
    type: 'task_overdue',
    title: 'Task Overdue',
    message: `"${taskTitle}" is now overdue`,
    priority: 'urgent',
  }),

  // Project notifications
  projectCreated: (projectName: string): Partial<CreateNotificationInput> => ({
    type: 'project_created',
    title: 'New Project Created',
    message: `A new project "${projectName}" has been created`,
    priority: 'normal',
  }),

  projectStatusChanged: (projectName: string, oldStatus: string, newStatus: string): Partial<CreateNotificationInput> => ({
    type: 'project_status_changed',
    title: 'Project Status Updated',
    message: `"${projectName}" status changed from ${oldStatus} to ${newStatus}`,
    priority: 'normal',
  }),

  // Lead notifications
  leadAssigned: (leadName: string): Partial<CreateNotificationInput> => ({
    type: 'lead_assigned',
    title: 'New Lead Assigned',
    message: `You have been assigned to lead "${leadName}"`,
    priority: 'high',
  }),

  leadConverted: (leadName: string, projectName: string): Partial<CreateNotificationInput> => ({
    type: 'lead_converted',
    title: 'Lead Converted',
    message: `Lead "${leadName}" has been converted to project "${projectName}"`,
    priority: 'normal',
  }),

  // Process notifications
  processStepCompleted: (stepName: string, projectName: string): Partial<CreateNotificationInput> => ({
    type: 'process_step_completed',
    title: 'Process Step Completed',
    message: `Step "${stepName}" completed for "${projectName}"`,
    priority: 'low',
  }),

  approvalRequired: (itemName: string, itemType: string): Partial<CreateNotificationInput> => ({
    type: 'approval_required',
    title: 'Approval Required',
    message: `Your approval is needed for ${itemType} "${itemName}"`,
    priority: 'high',
  }),

  // SLA notifications
  slaWarning: (stepName: string, projectName: string, remainingMinutes: number): Partial<CreateNotificationInput> => ({
    type: 'sla_warning',
    title: 'SLA Warning',
    message: `Step "${stepName}" in "${projectName}" is approaching SLA deadline (${remainingMinutes} min remaining)`,
    priority: 'high',
  }),

  slaBreach: (stepName: string, projectName: string): Partial<CreateNotificationInput> => ({
    type: 'sla_breach',
    title: 'SLA Breach',
    message: `Step "${stepName}" in "${projectName}" has breached its SLA`,
    priority: 'urgent',
  }),

  // Social notifications
  mention: (mentionedBy: string, context: string): Partial<CreateNotificationInput> => ({
    type: 'mention',
    title: 'You were mentioned',
    message: `${mentionedBy} mentioned you in ${context}`,
    priority: 'normal',
  }),

  comment: (commentedBy: string, itemName: string): Partial<CreateNotificationInput> => ({
    type: 'comment',
    title: 'New Comment',
    message: `${commentedBy} commented on "${itemName}"`,
    priority: 'low',
  }),

  // System notifications
  system: (title: string, message: string, priority: NotificationPriority = 'normal'): Partial<CreateNotificationInput> => ({
    type: 'system',
    title,
    message,
    priority,
  }),
};

// ==================== Core Functions ====================

/**
 * Create a new notification
 */
export async function createNotification(input: CreateNotificationInput): Promise<Notification | null> {
  const db = getDb();
  
  // Check if in-app notifications are enabled
  const inAppEnabled = await getBooleanSetting(SETTING_KEYS.NOTIFICATIONS_IN_APP, true);
  if (!inAppEnabled) {
    return null;
  }
  
  // Check user preferences
  const userPrefs = await getUserNotificationPreferences(input.userId);
  if (userPrefs && !userPrefs.inAppEnabled) {
    return null;
  }
  
  // Check if this notification type is enabled for user
  if (userPrefs && !isNotificationTypeEnabled(userPrefs, input.type)) {
    return null;
  }

  const now = new Date();
  const id = uuidv4();

  const notificationData: NewNotification = {
    id,
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message || null,
    priority: input.priority || 'normal',
    entityType: input.entityType || null,
    entityId: input.entityId || null,
    link: input.link || null,
    actorUserId: input.actorUserId || null,
    isRead: false,
    readAt: null,
    isDismissed: false,
    dismissedAt: null,
    expiresAt: input.expiresAt || null,
    actions: input.actions ? JSON.stringify(input.actions) : null,
    metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    createdAt: now,
  };

  await db.insert(notifications).values(notificationData);

  return {
    ...notificationData,
    isRead: false,
    isDismissed: false,
  } as Notification;
}

/**
 * Create notifications for multiple users
 */
export async function createNotificationsForUsers(
  userIds: string[],
  baseInput: Omit<CreateNotificationInput, 'userId'>
): Promise<void> {
  const promises = userIds.map(userId => 
    createNotification({ ...baseInput, userId })
  );
  await Promise.all(promises);
}

/**
 * Get notifications for a user
 */
export async function getNotifications(
  userId: string,
  filters: NotificationFilters = {}
): Promise<Notification[]> {
  const db = getDb();
  const { isRead, type, priority, entityType, entityId, limit = 50, offset = 0 } = filters;

  const conditions = [
    eq(notifications.userId, userId),
    eq(notifications.isDismissed, false),
    or(
      isNull(notifications.expiresAt),
      lt(sql`${Date.now()}`, notifications.expiresAt)
    ),
  ];

  if (isRead !== undefined) {
    conditions.push(eq(notifications.isRead, isRead));
  }

  if (type) {
    if (Array.isArray(type)) {
      conditions.push(sql`${notifications.type} IN (${sql.join(type.map(t => sql`${t}`), sql`, `)})`);
    } else {
      conditions.push(eq(notifications.type, type));
    }
  }

  if (priority) {
    conditions.push(eq(notifications.priority, priority));
  }

  if (entityType) {
    conditions.push(eq(notifications.entityType, entityType));
  }

  if (entityId) {
    conditions.push(eq(notifications.entityId, entityId));
  }

  const results = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  return results;
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const db = getDb();

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false),
      eq(notifications.isDismissed, false),
      or(
        isNull(notifications.expiresAt),
        lt(sql`${Date.now()}`, notifications.expiresAt)
      )
    ))
    .get();

  return result?.count ?? 0;
}

/**
 * Get notification stats for a user
 */
export async function getNotificationStats(userId: string): Promise<NotificationStats> {
  const db = getDb();

  const allNotifications = await db
    .select({
      type: notifications.type,
      priority: notifications.priority,
      isRead: notifications.isRead,
    })
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isDismissed, false)
    ))
    .all();

  const stats: NotificationStats = {
    total: allNotifications.length,
    unread: allNotifications.filter(n => !n.isRead).length,
    byType: {},
    byPriority: {},
  };

  allNotifications.forEach(n => {
    stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
    stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1;
  });

  return stats;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string, userId: string): Promise<boolean> {
  const db = getDb();
  const now = new Date();

  const result = await db
    .update(notifications)
    .set({ isRead: true, readAt: now })
    .where(and(
      eq(notifications.id, notificationId),
      eq(notifications.userId, userId)
    ));

  return true;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<number> {
  const db = getDb();
  const now = new Date();

  await db
    .update(notifications)
    .set({ isRead: true, readAt: now })
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ));

  return 0; // SQLite doesn't return count easily, this would need adjustment
}

/**
 * Dismiss a notification
 */
export async function dismissNotification(notificationId: string, userId: string): Promise<boolean> {
  const db = getDb();
  const now = new Date();

  await db
    .update(notifications)
    .set({ isDismissed: true, dismissedAt: now })
    .where(and(
      eq(notifications.id, notificationId),
      eq(notifications.userId, userId)
    ));

  return true;
}

/**
 * Clear all notifications for a user
 */
export async function clearAllNotifications(userId: string): Promise<void> {
  const db = getDb();
  const now = new Date();

  await db
    .update(notifications)
    .set({ isDismissed: true, dismissedAt: now })
    .where(eq(notifications.userId, userId));
}

/**
 * Delete old notifications (cleanup job)
 */
export async function deleteOldNotifications(daysOld: number = 30): Promise<number> {
  const db = getDb();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  await db
    .delete(notifications)
    .where(and(
      eq(notifications.isDismissed, true),
      lt(notifications.createdAt, cutoffDate)
    ));

  return 0;
}

// ==================== User Preferences ====================

/**
 * Get user notification preferences
 */
export async function getUserNotificationPreferences(
  userId: string
): Promise<typeof userNotificationPreferences.$inferSelect | null> {
  const db = getDb();

  const prefs = await db
    .select()
    .from(userNotificationPreferences)
    .where(eq(userNotificationPreferences.userId, userId))
    .get();

  return prefs || null;
}

/**
 * Create or update user notification preferences
 */
export async function upsertUserNotificationPreferences(
  userId: string,
  preferences: Partial<typeof userNotificationPreferences.$inferInsert>
): Promise<void> {
  const db = getDb();
  const now = new Date();

  const existing = await getUserNotificationPreferences(userId);

  if (existing) {
    await db
      .update(userNotificationPreferences)
      .set({ ...preferences, updatedAt: now })
      .where(eq(userNotificationPreferences.userId, userId));
  } else {
    await db.insert(userNotificationPreferences).values({
      id: uuidv4(),
      userId,
      ...preferences,
      updatedAt: now,
    });
  }
}

/**
 * Check if a notification type is enabled for a user
 */
function isNotificationTypeEnabled(
  prefs: typeof userNotificationPreferences.$inferSelect,
  type: NotificationType
): boolean {
  const typeMapping: Record<NotificationType, keyof typeof prefs | null> = {
    task_assigned: 'taskAssigned',
    task_completed: 'taskCompleted',
    task_updated: 'taskUpdated',
    task_due_soon: 'taskDueSoon',
    task_overdue: 'taskOverdue',
    project_created: 'projectUpdates',
    project_updated: 'projectUpdates',
    project_status_changed: 'projectUpdates',
    lead_assigned: 'leadUpdates',
    lead_converted: 'leadUpdates',
    lead_status_changed: 'leadUpdates',
    mention: 'mentions',
    comment: 'comments',
    sla_warning: 'slaAlerts',
    sla_breach: 'slaAlerts',
    process_step_completed: 'projectUpdates',
    process_completed: 'projectUpdates',
    approval_required: 'approvalRequests',
    approval_completed: 'approvalRequests',
    system: 'systemAlerts',
    custom: null,
  };

  const prefKey = typeMapping[type];
  if (!prefKey) return true; // Custom notifications always enabled

  return prefs[prefKey] as boolean;
}

// ==================== Convenience Functions ====================

/**
 * Notify task assignee
 */
export async function notifyTaskAssigned(
  assigneeUserId: string,
  taskId: string,
  taskTitle: string,
  projectName?: string,
  actorUserId?: string
): Promise<void> {
  const template = NotificationTemplates.taskAssigned(taskTitle, projectName);
  
  await createNotification({
    userId: assigneeUserId,
    ...template,
    type: template.type as NotificationType,
    title: template.title!,
    entityType: 'task',
    entityId: taskId,
    link: `/internal/tasks/${taskId}`,
    actorUserId,
  });
}

/**
 * Notify project team of status change
 */
export async function notifyProjectStatusChange(
  teamUserIds: string[],
  projectId: string,
  projectName: string,
  oldStatus: string,
  newStatus: string,
  actorUserId?: string
): Promise<void> {
  const template = NotificationTemplates.projectStatusChanged(projectName, oldStatus, newStatus);
  
  await createNotificationsForUsers(
    teamUserIds.filter(id => id !== actorUserId), // Don't notify the actor
    {
      ...template,
      type: template.type as NotificationType,
      title: template.title!,
      entityType: 'project',
      entityId: projectId,
      link: `/internal/projects/${projectId}`,
      actorUserId,
    }
  );
}

/**
 * Notify about SLA warning
 */
export async function notifySlaWarning(
  userIds: string[],
  stepName: string,
  projectName: string,
  projectId: string,
  remainingMinutes: number
): Promise<void> {
  const template = NotificationTemplates.slaWarning(stepName, projectName, remainingMinutes);
  
  await createNotificationsForUsers(userIds, {
    ...template,
    type: template.type as NotificationType,
    title: template.title!,
    entityType: 'project',
    entityId: projectId,
    link: `/internal/projects/${projectId}`,
  });
}

/**
 * Notify about approval required
 */
export async function notifyApprovalRequired(
  approverUserIds: string[],
  itemId: string,
  itemName: string,
  itemType: string,
  link: string,
  actorUserId?: string
): Promise<void> {
  const template = NotificationTemplates.approvalRequired(itemName, itemType);
  
  await createNotificationsForUsers(approverUserIds, {
    ...template,
    type: template.type as NotificationType,
    title: template.title!,
    entityType: itemType,
    entityId: itemId,
    link,
    actorUserId,
    actions: [
      { label: 'Review', url: link, style: 'primary' },
    ],
  });
}

/**
 * Send system notification to all admins
 */
export async function notifyAdmins(
  title: string,
  message: string,
  priority: NotificationPriority = 'normal',
  link?: string
): Promise<void> {
  const db = getDb();
  
  const admins = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, 'admin'))
    .all();

  const template = NotificationTemplates.system(title, message, priority);
  
  await createNotificationsForUsers(
    admins.map(a => a.id),
    {
      ...template,
      type: template.type as NotificationType,
      title: template.title!,
      link,
    }
  );
}
