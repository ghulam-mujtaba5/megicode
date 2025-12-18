'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Types
export type ActivityType = 
  | 'task_created' 
  | 'task_completed' 
  | 'task_assigned'
  | 'task_status_changed'
  | 'project_created'
  | 'project_status_changed'
  | 'milestone_reached'
  | 'lead_created'
  | 'lead_converted'
  | 'comment_added'
  | 'file_uploaded'
  | 'time_logged'
  | 'invoice_sent'
  | 'invoice_paid';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  entityType: 'task' | 'project' | 'lead' | 'milestone' | 'invoice' | 'comment';
  entityId: string;
  entityName: string;
  projectId?: string;
  projectName?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
  currentUserId: string;
  showFilters?: boolean;
  maxItems?: number;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  loading?: boolean;
}

// Icons
const Icons = {
  task: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  project: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  lead: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  milestone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  invoice: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  comment: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  filter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
};

// Activity type configurations
const activityConfig: Record<ActivityType, {
  icon: React.ReactNode;
  color: string;
  verb: string;
}> = {
  task_created: { icon: Icons.plus, color: 'var(--int-primary)', verb: 'created task' },
  task_completed: { icon: Icons.check, color: 'var(--int-success)', verb: 'completed task' },
  task_assigned: { icon: Icons.lead, color: 'var(--int-info)', verb: 'assigned task' },
  task_status_changed: { icon: Icons.arrow, color: 'var(--int-warning)', verb: 'updated status of' },
  project_created: { icon: Icons.project, color: 'var(--int-primary)', verb: 'created project' },
  project_status_changed: { icon: Icons.arrow, color: 'var(--int-warning)', verb: 'updated project' },
  milestone_reached: { icon: Icons.milestone, color: 'var(--int-success)', verb: 'reached milestone' },
  lead_created: { icon: Icons.lead, color: 'var(--int-info)', verb: 'added lead' },
  lead_converted: { icon: Icons.check, color: 'var(--int-success)', verb: 'converted lead' },
  comment_added: { icon: Icons.comment, color: 'var(--int-text-secondary)', verb: 'commented on' },
  file_uploaded: { icon: Icons.file, color: 'var(--int-primary)', verb: 'uploaded file to' },
  time_logged: { icon: Icons.clock, color: 'var(--int-info)', verb: 'logged time on' },
  invoice_sent: { icon: Icons.invoice, color: 'var(--int-warning)', verb: 'sent invoice for' },
  invoice_paid: { icon: Icons.dollar, color: 'var(--int-success)', verb: 'received payment for' },
};

// Filter options
const filterOptions = [
  { value: 'all', label: 'All Activity' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'projects', label: 'Projects' },
  { value: 'leads', label: 'Leads' },
  { value: 'milestones', label: 'Milestones' },
  { value: 'invoices', label: 'Invoices' },
];

// Format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Group activities by date
const groupByDate = (activities: Activity[]): Map<string, Activity[]> => {
  const groups = new Map<string, Activity[]>();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  activities.forEach((activity) => {
    const dateStr = activity.createdAt.toDateString();
    let groupKey: string;
    
    if (dateStr === today) {
      groupKey = 'Today';
    } else if (dateStr === yesterday) {
      groupKey = 'Yesterday';
    } else {
      groupKey = activity.createdAt.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(activity);
  });

  return groups;
};

export default function ActivityFeed({
  activities,
  currentUserId,
  showFilters = true,
  maxItems = 50,
  onLoadMore,
  hasMore = false,
  loading = false,
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Filter activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;
    
    if (filter !== 'all') {
      filtered = activities.filter((a) => {
        switch (filter) {
          case 'tasks':
            return a.entityType === 'task';
          case 'projects':
            return a.entityType === 'project';
          case 'leads':
            return a.entityType === 'lead';
          case 'milestones':
            return a.entityType === 'milestone';
          case 'invoices':
            return a.entityType === 'invoice';
          default:
            return true;
        }
      });
    }
    
    return filtered.slice(0, maxItems);
  }, [activities, filter, maxItems]);

  // Group by date
  const groupedActivities = useMemo(() => {
    return groupByDate(filteredActivities);
  }, [filteredActivities]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getEntityLink = (activity: Activity): string => {
    switch (activity.entityType) {
      case 'task':
        return `/internal/tasks/${activity.entityId}`;
      case 'project':
        return `/internal/projects/${activity.entityId}`;
      case 'lead':
        return `/internal/leads/${activity.entityId}`;
      case 'milestone':
        return activity.projectId 
          ? `/internal/projects/${activity.projectId}?tab=milestones` 
          : '#';
      case 'invoice':
        return `/internal/invoices/${activity.entityId}`;
      default:
        return '#';
    }
  };

  return (
    <div className="activityFeed">
      <style jsx>{`
        .activityFeed {
          background: var(--int-bg-secondary);
          border: 1px solid var(--int-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .feedHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--int-bg-primary);
          border-bottom: 1px solid var(--int-border);
        }

        .feedTitle {
          font-weight: 600;
          color: var(--int-text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feedTitle svg {
          width: 20px;
          height: 20px;
          color: var(--int-primary);
        }

        .feedFilters {
          display: flex;
          gap: 8px;
        }

        .filterBtn {
          padding: 6px 12px;
          border: 1px solid var(--int-border);
          border-radius: 20px;
          background: var(--int-bg-secondary);
          color: var(--int-text-secondary);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filterBtn:hover {
          border-color: var(--int-primary);
          color: var(--int-primary);
        }

        .filterBtn.active {
          background: var(--int-primary);
          border-color: var(--int-primary);
          color: white;
        }

        .feedBody {
          max-height: 600px;
          overflow-y: auto;
        }

        .dateGroup {
          padding: 12px 20px 4px;
        }

        .dateLabel {
          font-size: 12px;
          font-weight: 600;
          color: var(--int-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .activityList {
          padding: 0 12px;
        }

        .activityItem {
          display: flex;
          gap: 12px;
          padding: 12px 8px;
          border-bottom: 1px solid var(--int-border-light);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .activityItem:hover {
          background: var(--int-bg-tertiary);
        }

        .activityItem:last-child {
          border-bottom: none;
        }

        .activityIcon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activityIcon svg {
          width: 16px;
          height: 16px;
          color: white;
        }

        .activityContent {
          flex: 1;
          min-width: 0;
        }

        .activityHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .activityText {
          font-size: 14px;
          color: var(--int-text-primary);
          line-height: 1.4;
        }

        .activityUser {
          font-weight: 600;
          color: var(--int-text-primary);
        }

        .activityUser.self {
          color: var(--int-primary);
        }

        .activityVerb {
          color: var(--int-text-secondary);
        }

        .activityEntity {
          font-weight: 500;
          color: var(--int-primary);
        }

        .activityEntity:hover {
          text-decoration: underline;
        }

        .activityTime {
          font-size: 12px;
          color: var(--int-text-tertiary);
          white-space: nowrap;
        }

        .activityProject {
          font-size: 12px;
          color: var(--int-text-secondary);
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .activityProject svg {
          width: 12px;
          height: 12px;
        }

        .activityDescription {
          font-size: 13px;
          color: var(--int-text-secondary);
          margin-top: 8px;
          padding: 8px 12px;
          background: var(--int-bg-tertiary);
          border-radius: 8px;
          line-height: 1.5;
        }

        .loadMore {
          display: flex;
          justify-content: center;
          padding: 16px;
          border-top: 1px solid var(--int-border);
        }

        .loadMoreBtn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--int-bg-tertiary);
          border: 1px solid var(--int-border);
          border-radius: 8px;
          color: var(--int-text-primary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .loadMoreBtn:hover {
          background: var(--int-bg-primary);
          border-color: var(--int-primary);
        }

        .loadMoreBtn svg {
          width: 16px;
          height: 16px;
        }

        .loadMoreBtn.loading {
          opacity: 0.6;
          cursor: wait;
        }

        .emptyState {
          text-align: center;
          padding: 48px 24px;
          color: var(--int-text-secondary);
        }

        .emptyStateIcon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          opacity: 0.3;
        }

        .emptyStateIcon svg {
          width: 100%;
          height: 100%;
        }

        .emptyStateText {
          font-size: 15px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div className="feedHeader">
        <div className="feedTitle">
          {Icons.refresh}
          <span>Activity Feed</span>
        </div>
        {showFilters && (
          <div className="feedFilters">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`filterBtn ${filter === option.value ? 'active' : ''}`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="feedBody">
        {filteredActivities.length > 0 ? (
          <>
            {Array.from(groupedActivities.entries()).map(([date, dayActivities]) => (
              <div key={date}>
                <div className="dateGroup">
                  <span className="dateLabel">{date}</span>
                </div>
                <div className="activityList">
                  {dayActivities.map((activity, index) => {
                    const config = activityConfig[activity.type];
                    const isExpanded = expandedItems.has(activity.id);
                    const isSelf = activity.userId === currentUserId;

                    return (
                      <motion.div
                        key={activity.id}
                        className="activityItem"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => activity.description && toggleExpand(activity.id)}
                      >
                        <div 
                          className="activityIcon"
                          style={{ background: config.color }}
                        >
                          {config.icon}
                        </div>
                        <div className="activityContent">
                          <div className="activityHeader">
                            <div className="activityText">
                              <span className={`activityUser ${isSelf ? 'self' : ''}`}>
                                {isSelf ? 'You' : activity.userName}
                              </span>
                              {' '}
                              <span className="activityVerb">{config.verb}</span>
                              {' '}
                              <Link 
                                href={getEntityLink(activity)} 
                                className="activityEntity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {activity.entityName}
                              </Link>
                            </div>
                            <span className="activityTime">
                              {formatRelativeTime(activity.createdAt)}
                            </span>
                          </div>
                          {activity.projectName && (
                            <div className="activityProject">
                              {Icons.project}
                              {activity.projectName}
                            </div>
                          )}
                          <AnimatePresence>
                            {isExpanded && activity.description && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="activityDescription"
                              >
                                {activity.description}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="emptyState">
            <div className="emptyStateIcon">{Icons.refresh}</div>
            <p className="emptyStateText">No activity to show</p>
          </div>
        )}
      </div>

      {hasMore && onLoadMore && (
        <div className="loadMore">
          <button 
            className={`loadMoreBtn ${loading ? 'loading' : ''}`}
            onClick={onLoadMore}
            disabled={loading}
          >
            <span className={loading ? 'spinning' : ''}>{Icons.refresh}</span>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
