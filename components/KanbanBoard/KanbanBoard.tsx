'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { format } from 'date-fns';

// Types
interface Task {
  id: string;
  key: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueAt: string | Date | null;
  assignedToUserId?: string | null;
  projectId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface KanbanBoardProps {
  tasks: Task[];
  projects?: Record<string, { title: string }>;
  users?: Record<string, { name?: string | null; image?: string | null; email?: string | null }>;
  onStatusChange?: (taskId: string, newStatus: string) => Promise<void>;
}

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  { id: 'blocked', label: 'Blocked', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  { id: 'done', label: 'Done', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
];

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#6b7280',
};

export default function KanbanBoard({ 
  tasks: initialTasks, 
  projects = {}, 
  users = {},
  onStatusChange 
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!showCompleted && task.status === 'done') return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.key.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [tasks, searchQuery, showCompleted]);

  // Group tasks by status
  const columnTasks = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    COLUMNS.forEach(col => {
      grouped[col.id] = filteredTasks
        .filter(t => t.status === col.id)
        .sort((a, b) => {
          // Sort by priority first
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          if (bPriority !== aPriority) return bPriority - aPriority;
          // Then by due date
          if (a.dueAt && b.dueAt) {
            return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
          }
          return 0;
        });
    });
    return grouped;
  }, [filteredTasks]);

  // Drag handlers
  const handleDragStart = useCallback((task: Task) => {
    setDraggedTask(task);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(async (columnId: string) => {
    if (!draggedTask || draggedTask.status === columnId) {
      setDraggedTask(null);
      setDragOverColumn(null);
      return;
    }

    setIsUpdating(draggedTask.id);

    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === draggedTask.id ? { ...t, status: columnId } : t
    ));

    try {
      if (onStatusChange) {
        await onStatusChange(draggedTask.id, columnId);
      }
    } catch (error) {
      // Rollback on error
      setTasks(prev => prev.map(t => 
        t.id === draggedTask.id ? { ...t, status: draggedTask.status } : t
      ));
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(null);
      setDraggedTask(null);
      setDragOverColumn(null);
    }
  }, [draggedTask, onStatusChange]);

  // Calculate column stats
  const columnStats = useMemo(() => {
    const stats: Record<string, { count: number; overdue: number }> = {};
    COLUMNS.forEach(col => {
      const colTasks = columnTasks[col.id] || [];
      stats[col.id] = {
        count: colTasks.length,
        overdue: colTasks.filter(t => t.dueAt && new Date(t.dueAt) < new Date()).length,
      };
    });
    return stats;
  }, [columnTasks]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        padding: '0.75rem',
        background: 'var(--bg-surface-alt, #f9fafb)',
        borderRadius: '12px',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 2.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-surface, #fff)',
              fontSize: '0.875rem',
            }}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.5,
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Toggle completed */}
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--int-primary)' }}
          />
          Show completed
        </label>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
          <span style={{ color: '#6b7280' }}>{filteredTasks.length} tasks</span>
          <span style={{ color: '#ef4444' }}>
            {Object.values(columnStats).reduce((sum, s) => sum + s.overdue, 0)} overdue
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(280px, 1fr))`,
        gap: '1rem',
        flex: 1,
        overflowX: 'auto',
        paddingBottom: '1rem',
      }}>
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(column.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: dragOverColumn === column.id ? column.bgColor : 'var(--bg-surface-alt, #f9fafb)',
              borderRadius: '12px',
              padding: '0.75rem',
              minHeight: '400px',
              transition: 'background 0.2s ease',
              border: dragOverColumn === column.id 
                ? `2px dashed ${column.color}` 
                : '2px solid transparent',
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
              padding: '0.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: column.color,
                }} />
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  margin: 0,
                  color: 'var(--text-primary, #111827)',
                }}>
                  {column.label}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {columnStats[column.id]?.overdue > 0 && (
                  <span style={{
                    fontSize: '0.625rem',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    background: '#ef4444',
                    color: '#fff',
                    fontWeight: 600,
                  }}>
                    {columnStats[column.id].overdue} overdue
                  </span>
                )}
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: column.color,
                  color: '#fff',
                  fontWeight: 600,
                }}>
                  {columnStats[column.id]?.count || 0}
                </span>
              </div>
            </div>

            {/* Task Cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              flex: 1,
              overflowY: 'auto',
            }}>
              <AnimatePresence mode="popLayout">
                {columnTasks[column.id]?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={projects[task.projectId || '']}
                    user={users[task.assignedToUserId || '']}
                    onDragStart={() => handleDragStart(task)}
                    isDragging={draggedTask?.id === task.id}
                    isUpdating={isUpdating === task.id}
                  />
                ))}
              </AnimatePresence>

              {columnTasks[column.id]?.length === 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  color: 'var(--text-secondary, #9ca3af)',
                  fontSize: '0.875rem',
                  fontStyle: 'italic',
                }}>
                  Drop tasks here
                </div>
              )}
            </div>

            {/* Quick add (placeholder) */}
            <button
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px dashed var(--border-color, #e5e7eb)',
                background: 'transparent',
                color: 'var(--text-secondary, #9ca3af)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = column.color;
                e.currentTarget.style.color = column.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color, #e5e7eb)';
                e.currentTarget.style.color = 'var(--text-secondary, #9ca3af)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  project,
  user,
  onDragStart,
  isDragging,
  isUpdating,
}: {
  task: Task;
  project?: { title: string };
  user?: { name?: string | null; image?: string | null; email?: string | null };
  onDragStart: () => void;
  isDragging: boolean;
  isUpdating: boolean;
}) {
  const isOverdue = task.dueAt && new Date(task.dueAt) < new Date() && task.status !== 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        scale: isDragging ? 0.98 : 1,
        boxShadow: isDragging 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      draggable
      onDragStart={onDragStart}
      style={{
        background: 'var(--bg-surface, #fff)',
        borderRadius: '10px',
        padding: '0.875rem',
        cursor: isUpdating ? 'wait' : 'grab',
        borderLeft: `3px solid ${PRIORITY_COLORS[task.priority] || '#6b7280'}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Updating overlay */}
      {isUpdating && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--int-primary)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.5rem',
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: 'var(--text-secondary, #6b7280)',
          background: 'var(--bg-surface-alt, #f3f4f6)',
          padding: '2px 6px',
          borderRadius: '4px',
        }}>
          {task.key}
        </span>
        {task.priority === 'critical' && (
          <span style={{
            fontSize: '0.625rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: '#ef4444',
            color: '#fff',
            fontWeight: 600,
          }}>
            CRITICAL
          </span>
        )}
      </div>

      {/* Title */}
      <Link
        href={`/internal/tasks/${task.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 style={{
          fontSize: '0.9375rem',
          fontWeight: 500,
          margin: '0 0 0.5rem 0',
          lineHeight: 1.4,
          color: 'var(--text-primary, #111827)',
        }}>
          {task.title}
        </h4>
      </Link>

      {/* Project */}
      {project && (
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-secondary, #6b7280)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '0.5rem',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          {project.title}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.5rem',
        borderTop: '1px solid var(--border-color, #f3f4f6)',
      }}>
        {task.dueAt ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            color: isOverdue ? '#ef4444' : 'var(--text-secondary, #6b7280)',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            {format(new Date(task.dueAt), 'MMM d')}
            {isOverdue && <span style={{ fontWeight: 600 }}>!</span>}
          </div>
        ) : (
          <span />
        )}

        {/* User Avatar */}
        {user ? (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--int-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.625rem',
            fontWeight: 600,
          }} title={user.name || user.email || 'Assigned'}>
            {user.image ? (
              <img 
                src={user.image} 
                alt="" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              (user.name || user.email || '?').charAt(0).toUpperCase()
            )}
          </div>
        ) : (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '1px dashed var(--border-color, #e5e7eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary, #9ca3af)',
          }} title="Unassigned">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
