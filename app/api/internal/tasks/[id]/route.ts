import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';






























































































































































































































































































































































































































































































































































































































































































}  );    </div>      </div>        )}          })            );              </motion.div>                </div>                  </div>                    </button>                      Dismiss                    >                      onClick={() => handleDismiss(notification.id)}                      className="itemActionsBtn"                    <button                    )}                      </Link>                        View                      <Link href={notification.link} className="itemActionsBtn">                    {notification.link && (                    )}                      </button>                        Mark as read                      >                        onClick={() => handleMarkAsRead(notification.id)}                        className="itemActionsBtn"                      <button                    {!notification.isRead && (                  <div className="itemActions">                  )}                    <p className="itemMessage">{notification.message}</p>                  {notification.message && (                  </div>                    <span className="itemTime">{formatRelativeTime(notification.createdAt)}</span>                    </span>                      )}                        <span className="urgentBadge">Urgent</span>                      {notification.priority === 'urgent' && (                      {notification.title}                    <span className="itemTitle">                  <div className="itemHeader">                <div className="itemContent">                </div>                  {icon}                <div className="itemIcon" style={{ color: priorityColors[notification.priority] }}>                />                  onChange={() => toggleSelect(notification.id)}                  checked={selectedIds.has(notification.id)}                  className="checkbox"                  type="checkbox"                <input              >                transition={{ delay: index * 0.02 }}                animate={{ opacity: 1, y: 0 }}                initial={{ opacity: 0, y: 10 }}                className={`listItem ${!notification.isRead ? 'unread' : ''}`}                key={notification.id}              <motion.div            return (            const icon = typeIcons[notification.type] || Icons.bell;          notifications.map((notification, index) => {        ) : (          </div>            <p>No notifications to show</p>            {Icons.bell}          <div className="empty">        ) : notifications.length === 0 ? (          <div className="loading">Loading notifications...</div>        {loading ? (      <div className="list">      {/* List */}      )}        </div>          </button>            Clear selection          <button className="actionBtn" onClick={() => setSelectedIds(new Set())}>          </button>            Mark read            {Icons.check}          <button className="actionBtn" onClick={handleBulkMarkRead}>          <span>{selectedIds.size} selected</span>        <div className="bulkActions">      {selectedIds.size > 0 && (      {/* Bulk actions */}      </div>        )}          </select>            ))}              <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>            {notificationTypes.map(type => (            <option value="all">All types</option>          >            onChange={(e) => setTypeFilter(e.target.value)}            value={typeFilter}            className="filterSelect"          <select        {notificationTypes.length > 0 && (        </div>          </button>            Unread          >            onClick={() => setFilter('unread')}            className={`filterBtn ${filter === 'unread' ? 'active' : ''}`}          <button          </button>            All          >            onClick={() => setFilter('all')}            className={`filterBtn ${filter === 'all' ? 'active' : ''}`}          <button        <div className="filterGroup">      <div className="filters">      {/* Filters */}      )}        </div>          ))}            </div>              <span className="statLabel">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>              <span className="statValue" style={{ color: priorityColors[priority] }}>{count}</span>            <div className="statItem" key={priority}>          {Object.entries(stats.byPriority).map(([priority, count]) => (          </div>            <span className="statLabel">Unread</span>            <span className="statValue" style={{ color: 'var(--int-primary)' }}>{stats.unread}</span>          <div className="statItem">          </div>            <span className="statLabel">Total</span>            <span className="statValue">{stats.total}</span>          <div className="statItem">        <div className="statsBar">      {stats && (      {/* Stats */}      </div>        </div>          </button>            Clear all            {Icons.trash}          <button className="actionBtn danger" onClick={handleClearAll}>          )}            </button>              Mark all read              {Icons.checkAll}            <button className="actionBtn" onClick={handleMarkAllAsRead}>          {stats && stats.unread > 0 && (          </Link>            Settings            {Icons.settings}          <Link href="/internal/admin/settings?tab=notifications" className="actionBtn">        <div className="headerActions">        </div>          )}            <span className="unreadBadge">{stats.unread} unread</span>          {stats && stats.unread > 0 && (          <h1>Notifications</h1>          {Icons.bell}        <div className="titleSection">      <div className="header">      {/* Header */}      `}</style>        }          color: var(--int-text-secondary);          font-size: 12px;        .statLabel {        }          color: var(--int-text-primary);          font-weight: 600;          font-size: 24px;        .statValue {        }          flex-direction: column;          display: flex;        .statItem {        }          margin-bottom: 20px;          border-radius: 12px;          border: 1px solid var(--int-border);          background: var(--int-bg-secondary);          padding: 16px;          gap: 24px;          display: flex;        .statsBar {        }          margin-bottom: 16px;          opacity: 0.3;          height: 64px;          width: 64px;        .empty svg {        }          text-align: center;          color: var(--int-text-tertiary);          padding: 64px 24px;          justify-content: center;          align-items: center;          flex-direction: column;          display: flex;        .empty {        }          color: var(--int-text-secondary);          padding: 48px;          justify-content: center;          align-items: center;          flex-direction: column;          display: flex;        .loading {        }          text-transform: uppercase;          border-radius: 4px;          font-weight: 600;          font-size: 10px;          color: white;          background: var(--int-danger);          padding: 2px 8px;          margin-left: 8px;          display: inline-block;        .urgentBadge {        }          color: var(--int-primary);          border-color: var(--int-primary);        .itemActionsBtn:hover {        }          transition: all 0.2s ease;          cursor: pointer;          font-size: 12px;          color: var(--int-text-secondary);          border-radius: 4px;          border: 1px solid var(--int-border);          background: transparent;          padding: 4px 10px;        .itemActionsBtn {        }          margin-top: 8px;          gap: 8px;          display: flex;        .itemActions {        }          line-height: 1.4;          margin: 0;          color: var(--int-text-secondary);          font-size: 14px;        .itemMessage {        }          white-space: nowrap;          color: var(--int-text-tertiary);          font-size: 12px;        .itemTime {        }          font-weight: 600;        .listItem.unread .itemTitle {        }          color: var(--int-text-primary);          font-weight: 500;          font-size: 15px;        .itemTitle {        }          margin-bottom: 4px;          gap: 12px;          justify-content: space-between;          align-items: flex-start;          display: flex;        .itemHeader {        }          min-width: 0;          flex: 1;        .itemContent {        }          color: white;          background: var(--int-primary);        .listItem.unread .itemIcon {        }          flex-shrink: 0;          border-radius: 50%;          background: var(--int-bg-tertiary);          justify-content: center;          align-items: center;          display: flex;          height: 40px;          width: 40px;        .itemIcon {        }          accent-color: var(--int-primary);          cursor: pointer;          height: 18px;          width: 18px;        .checkbox {        }          background: var(--int-primary-bg-hover);        .listItem.unread:hover {        }          background: var(--int-primary-bg);        .listItem.unread {        }          background: var(--int-bg-tertiary);        .listItem:hover {        }          border-bottom: none;        .listItem:last-child {        }          transition: background 0.2s ease;          border-bottom: 1px solid var(--int-border-light);          padding: 16px;          gap: 12px;          align-items: flex-start;          display: flex;        .listItem {        }          overflow: hidden;          border-radius: 12px;          border: 1px solid var(--int-border);          background: var(--int-bg-secondary);        .list {        }          font-size: 14px;          color: var(--int-text-primary);          flex: 1;        .bulkActions span {        }          margin-bottom: 16px;          border-radius: 8px;          background: var(--int-primary-bg);          padding: 12px 16px;          gap: 8px;          display: flex;        .bulkActions {        }          font-size: 13px;          color: var(--int-text-primary);          border-radius: 8px;          border: 1px solid var(--int-border);          background: var(--int-bg-secondary);          padding: 8px 12px;        .filterSelect {        }          color: white;          border-color: var(--int-primary);          background: var(--int-primary);        .filterBtn.active {        }          color: var(--int-primary);          border-color: var(--int-primary);        .filterBtn:hover {        }          transition: all 0.2s ease;          cursor: pointer;          font-size: 13px;          color: var(--int-text-secondary);          border-radius: 20px;          border: 1px solid var(--int-border);          background: transparent;          padding: 8px 16px;        .filterBtn {        }          gap: 8px;          display: flex;        .filterGroup {        }          border-bottom: 1px solid var(--int-border);          padding-bottom: 16px;          margin-bottom: 20px;          gap: 16px;          display: flex;        .filters {        }          color: var(--int-danger);          border-color: var(--int-danger);        .actionBtn.danger:hover {        }          border-color: var(--int-primary);          background: var(--int-bg-tertiary);        .actionBtn:hover {        }          transition: all 0.2s ease;          cursor: pointer;          font-size: 14px;          color: var(--int-text-primary);          border-radius: 8px;          border: 1px solid var(--int-border);          background: var(--int-bg-secondary);          padding: 8px 16px;          gap: 6px;          align-items: center;          display: flex;        .actionBtn {        }          gap: 8px;          display: flex;        .headerActions {        }          font-weight: 600;          font-size: 13px;          border-radius: 12px;          padding: 4px 10px;          color: white;          background: var(--int-danger);        .unreadBadge {        }          color: var(--int-text-primary);          font-size: 24px;          margin: 0;        .titleSection h1 {        }          color: var(--int-primary);        .titleSection svg {        }          gap: 12px;          align-items: center;          display: flex;        .titleSection {        }          margin-bottom: 24px;          justify-content: space-between;          align-items: center;          display: flex;        .header {        }          margin: 0 auto;          max-width: 1000px;        .notificationsPage {      <style jsx>{`    <div className="notificationsPage">  return (  const notificationTypes = Object.keys(stats?.byType || {});  };    }      console.error('Failed to bulk mark as read:', error);    } catch (error) {      setSelectedIds(new Set());      setNotifications(prev => prev.map(n => selectedIds.has(n.id) ? { ...n, isRead: true } : n));      });        body: JSON.stringify({ action: 'markRead', notificationIds: Array.from(selectedIds) }),        headers: { 'Content-Type': 'application/json' },        method: 'PATCH',      await fetch('/api/internal/notifications', {    try {  const handleBulkMarkRead = async () => {  };    setSelectedIds(newSelected);    }      newSelected.add(id);    } else {      newSelected.delete(id);    if (newSelected.has(id)) {    const newSelected = new Set(selectedIds);  const toggleSelect = (id: string) => {  };    }      console.error('Failed to clear all:', error);    } catch (error) {      setStats({ total: 0, unread: 0, byType: {}, byPriority: {} });      setNotifications([]);      await fetch('/api/internal/notifications', { method: 'DELETE' });    try {    if (!confirm('Are you sure you want to clear all notifications?')) return;  const handleClearAll = async () => {  };    }      console.error('Failed to dismiss:', error);    } catch (error) {      }        setStats({ ...stats, total: stats.total - 1 });      } else if (stats) {        setStats({ ...stats, unread: Math.max(0, stats.unread - 1), total: stats.total - 1 });      if (stats && notification && !notification.isRead) {      setNotifications(prev => prev.filter(n => n.id !== id));      const notification = notifications.find(n => n.id === id);      });        body: JSON.stringify({ action: 'dismiss', notificationId: id }),        headers: { 'Content-Type': 'application/json' },        method: 'PATCH',      await fetch('/api/internal/notifications', {    try {  const handleDismiss = async (id: string) => {  };    }      console.error('Failed to mark all as read:', error);    } catch (error) {      if (stats) setStats({ ...stats, unread: 0 });      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));      });        body: JSON.stringify({ action: 'markAllRead' }),        headers: { 'Content-Type': 'application/json' },        method: 'PATCH',      await fetch('/api/internal/notifications', {    try {  const handleMarkAllAsRead = async () => {  };    }      console.error('Failed to mark as read:', error);    } catch (error) {      if (stats) setStats({ ...stats, unread: Math.max(0, stats.unread - 1) });      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));      });        body: JSON.stringify({ action: 'markRead', notificationId: id }),        headers: { 'Content-Type': 'application/json' },        method: 'PATCH',      await fetch('/api/internal/notifications', {    try {  const handleMarkAsRead = async (id: string) => {  }, [fetchNotifications]);    fetchNotifications();  useEffect(() => {  }, [filter, typeFilter]);    }      setLoading(false);    } finally {      console.error('Failed to fetch notifications:', error);    } catch (error) {      }        setStats(data);        const data = await statsRes.json();      if (statsRes.ok) {      }        setNotifications(data.notifications || []);        const data = await notifRes.json();      if (notifRes.ok) {      ]);        fetch('/api/internal/notifications?action=stats'),        fetch(`/api/internal/notifications?${params}`),      const [notifRes, statsRes] = await Promise.all([      });        ...(typeFilter !== 'all' ? { type: typeFilter } : {}),        ...(filter === 'unread' ? { isRead: 'false' } : {}),        limit: '100',      const params = new URLSearchParams({      setLoading(true);    try {  const fetchNotifications = useCallback(async () => {  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());  const [typeFilter, setTypeFilter] = useState<string>('all');  const [filter, setFilter] = useState<'all' | 'unread'>('all');  const [loading, setLoading] = useState(true);  const [stats, setStats] = useState<NotificationStats | null>(null);  const [notifications, setNotifications] = useState<NotificationData[]>([]);export default function NotificationsPage() {};  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });  if (diffDays < 7) return `${diffDays}d ago`;  if (diffHours < 24) return `${diffHours}h ago`;  if (diffMins < 60) return `${diffMins}m ago`;  const diffDays = Math.floor(diffHours / 24);  const diffHours = Math.floor(diffMins / 60);  const diffMins = Math.floor(diffMs / 60000);  const diffMs = now.getTime() - new Date(date).getTime();  const now = new Date();const formatRelativeTime = (date: Date): string => {};  urgent: 'var(--int-danger)',  high: 'var(--int-warning)',  normal: 'var(--int-primary)',  low: 'var(--int-text-secondary)',const priorityColors: Record<string, string> = {};  system: Icons.system,  sla_breach: Icons.warning,  sla_warning: Icons.warning,  lead_converted: Icons.lead,  lead_assigned: Icons.lead,  project_status_changed: Icons.project,  project_updated: Icons.project,  project_created: Icons.project,  task_overdue: Icons.warning,  task_due_soon: Icons.warning,  task_updated: Icons.task,  task_completed: Icons.task,  task_assigned: Icons.task,const typeIcons: Record<string, React.ReactNode> = {// Type icon mapping};  system: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,  warning: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,  lead: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,  project: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,  task: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,  checkAll: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 6 9 17 4 12" /><polyline points="22 6 13 17 11 15" /></svg>,  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>,  bell: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,const Icons = {// Icons}  byPriority: Record<string, number>;  byType: Record<string, number>;  unread: number;  total: number;interface NotificationStats {}  createdAt: Date;  isRead: boolean;  link?: string | null;  entityId?: string | null;  entityType?: string | null;  priority: 'low' | 'normal' | 'high' | 'urgent';  message?: string | null;  title: string;  type: string;  id: string;interface NotificationData {import Link from 'next/link';import { motion } from 'framer-motion';import React, { useState, useEffect, useCallback } from 'react';import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { tasks, projects, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { 
  notifyTaskAssigned, 
  createNotification, 
  NotificationTemplates 
} from '@/lib/notifications';

// GET /api/internal/tasks/[id] - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const task = await getDb().select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);
    
    if (!task.length) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: task[0]
    });
  } catch (error: any) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/internal/tasks/[id] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await request.json();
    
    // Get existing task first to compare changes
    const existingTask = await getDb().select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);
    
    if (!existingTask.length) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    const oldTask = existingTask[0];
    
    const updated = await getDb().update(tasks)
      .set({
        ...body,
        updatedAt: new Date().getTime()
      })
      .where(eq(tasks.id, id))
      .returning();
    
    if (!updated.length) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    const newTask = updated[0];
    
    // Send notifications for relevant changes
    try {
      // Get project name for context
      let projectName: string | undefined;
      if (newTask.projectId) {
        const project = await getDb().select({ name: projects.name })
          .from(projects)
          .where(eq(projects.id, newTask.projectId))
          .limit(1);
        projectName = project[0]?.name;
      }
      
      // Notify if assignee changed
      if (body.assignedToUserId && 
          body.assignedToUserId !== oldTask.assignedToUserId &&
          body.assignedToUserId !== session?.user?.id) {
        await notifyTaskAssigned(
          body.assignedToUserId,
          id,
          newTask.title,
          projectName,
          session?.user?.id
        );
      }
      
      // Notify previous assignee if task was completed by someone else
      if (body.status === 'done' && oldTask.status !== 'done') {
        // Get actor's name
        let actorName = 'Someone';
        if (session?.user?.id) {
          const actor = await getDb().select({ name: users.name, email: users.email })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);
          actorName = actor[0]?.name || actor[0]?.email?.split('@')[0] || 'Someone';
        }
        
        // Notify task creator or project owner (if different from actor)
        if (oldTask.assignedToUserId && oldTask.assignedToUserId !== session?.user?.id) {
          const template = NotificationTemplates.taskCompleted(newTask.title, actorName);
          await createNotification({
            userId: oldTask.assignedToUserId,
            ...template,
            type: template.type as any,
            title: template.title!,
            entityType: 'task',
            entityId: id,
            link: `/internal/tasks/${id}`,
            actorUserId: session?.user?.id,
          });
        }
      }
    } catch (notifyError) {
      console.error('Failed to send task notification:', notifyError);
      // Don't fail the request if notification fails
    }
    
    return NextResponse.json({
      success: true,
      data: newTask
    });
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/internal/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const deleted = await getDb().delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    
    if (!deleted.length) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task', details: error.message },
      { status: 500 }
    );
  }
}
