'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './NotificationCenter.module.css';

// Types
export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message?: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  entityType?: string | null;
  entityId?: string | null;
  link?: string | null;
  actorUserId?: string | null;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
  actions?: NotificationAction[] | null;
  metadata?: Record<string, unknown> | null;
}

interface NotificationAction {
  label: string;
  url: string;
  style?: 'primary' | 'secondary' | 'danger';
}

interface NotificationCenterProps {
  collapsed?: boolean;
}

// Icons
const Icons = {
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  checkAll: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18 6 9 17 4 12" />
      <polyline points="22 6 13 17 11 15" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  task: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  project: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  lead: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  system: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
};

// Type to icon mapping
const typeIcons: Record<string, React.ReactNode> = {
  task_assigned: Icons.task,
  task_completed: Icons.task,
  task_updated: Icons.task,
  task_due_soon: Icons.warning,
  task_overdue: Icons.warning,
  project_created: Icons.project,
  project_updated: Icons.project,
  project_status_changed: Icons.project,
  lead_assigned: Icons.lead,
  lead_converted: Icons.lead,
  lead_status_changed: Icons.lead,
  sla_warning: Icons.warning,
  sla_breach: Icons.warning,
  approval_required: Icons.task,
  approval_completed: Icons.check,
  system: Icons.system,
  custom: Icons.bell,
};

// Priority colors
const priorityColors: Record<string, string> = {
  low: 'var(--int-text-secondary)',
  normal: 'var(--int-primary)',
  high: 'var(--int-warning)',
  urgent: 'var(--int-danger)',
};

// Format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function NotificationCenter({ collapsed = false }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '20',
        ...(filter === 'unread' ? { isRead: 'false' } : {}),
      });
      
      const response = await fetch(`/api/internal/notifications?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Fetch unread count periodically
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch('/api/internal/notifications?action=count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Initial load and polling
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, filter, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch('/api/internal/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', notificationId }),
      });
      
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/internal/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Dismiss notification
  const handleDismiss = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await fetch('/api/internal/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss', notificationId }),
      });
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification: NotificationData) => {
    if (!notification.isRead) {
      await fetch('/api/internal/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', notificationId: notification.id }),
      });
      
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    if (notification.link) {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        className={`${styles.bellButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        {Icons.bell}
        {unreadCount > 0 && (
          <motion.span
            className={styles.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={unreadCount}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
        {!collapsed && <span className={styles.bellLabel}>Notifications</span>}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className={styles.dropdown}
            style={{ left: collapsed ? '92px' : '280px' }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <h3 className={styles.title}>Notifications</h3>
              <div className={styles.headerActions}>
                {unreadCount > 0 && (
                  <button
                    className={styles.headerBtn}
                    onClick={handleMarkAllAsRead}
                    title="Mark all as read"
                  >
                    {Icons.checkAll}
                  </button>
                )}
                <Link
                  href="/internal/admin/settings?tab=notifications"
                  className={styles.headerBtn}
                  title="Notification settings"
                  onClick={() => setIsOpen(false)}
                >
                  {Icons.settings}
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
              <button
                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'unread' ? styles.active : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>

            {/* Notification List */}
            <div className={styles.list}>
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>{Icons.bell}</div>
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    className={`${styles.item} ${!notification.isRead ? styles.unread : ''}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    {notification.link ? (
                      <Link
                        href={notification.link}
                        className={styles.itemLink}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <NotificationContent
                          notification={notification}
                          onMarkRead={handleMarkAsRead}
                          onDismiss={handleDismiss}
                        />
                      </Link>
                    ) : (
                      <div
                        className={styles.itemLink}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <NotificationContent
                          notification={notification}
                          onMarkRead={handleMarkAsRead}
                          onDismiss={handleDismiss}
                        />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={styles.footer}>
                <Link
                  href="/internal/notifications"
                  className={styles.viewAllLink}
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Notification content component
function NotificationContent({
  notification,
  onMarkRead,
  onDismiss,
}: {
  notification: NotificationData;
  onMarkRead: (id: string, e: React.MouseEvent) => void;
  onDismiss: (id: string, e: React.MouseEvent) => void;
}) {
  const icon = typeIcons[notification.type] || Icons.bell;
  const priorityColor = priorityColors[notification.priority] || priorityColors.normal;

  return (
    <>
      <div 
        className={styles.itemIcon}
        style={{ color: priorityColor }}
      >
        {icon}
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <span className={styles.itemTitle}>{notification.title}</span>
          <span className={styles.itemTime}>
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        {notification.message && (
          <p className={styles.itemMessage}>{notification.message}</p>
        )}
        {notification.priority === 'urgent' && (
          <span className={styles.urgentBadge}>Urgent</span>
        )}
      </div>
      <div className={styles.itemActions}>
        {!notification.isRead && (
          <button
            className={styles.actionBtn}
            onClick={(e) => onMarkRead(notification.id, e)}
            title="Mark as read"
          >
            {Icons.check}
          </button>
        )}
        <button
          className={styles.actionBtn}
          onClick={(e) => onDismiss(notification.id, e)}
          title="Dismiss"
        >
          {Icons.close}
        </button>
      </div>
    </>
  );
}
