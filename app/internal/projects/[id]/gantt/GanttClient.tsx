'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import s from '../../../styles.module.css';

// Icons
const Icons = {
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  gridView: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  zoomIn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  zoomOut: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  flag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueAt: string | null;
  startAt?: string | null;
  sprintNumber: number | null;
  estimatedHours?: number | null;
  completedHours?: number | null;
  dependencies?: string[]; // Array of task IDs this task depends on
}

interface Milestone {
  id: string;
  title: string;
  dueAt: string | null;
  completedAt: string | null;
}

interface Project {
  id: string;
  name: string;
  startAt: string | null;
  dueAt: string | null;
}

interface GanttClientProps {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
}

type ZoomLevel = 'day' | 'week' | 'month';

export default function GanttClient({ project, tasks: initialTasks, milestones }: GanttClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('week');
  const [showDependencies, setShowDependencies] = useState(true);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate date range
  const { startDate, endDate, totalDays, dayWidth } = useMemo(() => {
    const now = new Date();
    const allDates: number[] = [now.getTime()];
    
    if (project.startAt) allDates.push(new Date(project.startAt).getTime());
    if (project.dueAt) allDates.push(new Date(project.dueAt).getTime());
    
    tasks.forEach((t) => {
      if (t.dueAt) allDates.push(new Date(t.dueAt).getTime());
      if (t.startAt) allDates.push(new Date(t.startAt).getTime());
    });
    
    milestones.forEach((m) => {
      if (m.dueAt) allDates.push(new Date(m.dueAt).getTime());
    });

    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    const startDate = new Date(minDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const endDate = new Date(maxDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    
    const dayWidth = zoomLevel === 'day' ? 60 : zoomLevel === 'week' ? 40 : 20;

    return { startDate, endDate, totalDays, dayWidth };
  }, [project, tasks, milestones, zoomLevel]);

  // Generate time periods for header
  const timePeriods = useMemo(() => {
    const periods: { label: string; start: Date; days: Date[] }[] = [];
    const current = new Date(startDate);
    
    if (zoomLevel === 'week') {
      current.setDate(current.getDate() - current.getDay()); // Start from Sunday
      while (current <= endDate) {
        const weekStart = new Date(current);
        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
          days.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        periods.push({
          label: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          start: weekStart,
          days,
        });
      }
    } else if (zoomLevel === 'month') {
      current.setDate(1);
      while (current <= endDate) {
        const monthStart = new Date(current);
        const days: Date[] = [];
        const month = current.getMonth();
        while (current.getMonth() === month && current <= endDate) {
          days.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        periods.push({
          label: monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          start: monthStart,
          days,
        });
      }
    } else {
      // Day view
      while (current <= endDate) {
        const dayStart = new Date(current);
        periods.push({
          label: dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          start: dayStart,
          days: [new Date(current)],
        });
        current.setDate(current.getDate() + 1);
      }
    }
    return periods;
  }, [startDate, endDate, zoomLevel]);

  // Helper to calculate position
  const getPosition = useCallback((date: Date | string | null): number => {
    if (!date) return 0;
    const d = typeof date === 'string' ? new Date(date) : date;
    const diff = d.getTime() - startDate.getTime();
    return Math.floor(diff / (24 * 60 * 60 * 1000)) * dayWidth;
  }, [startDate, dayWidth]);

  // Helper for status color
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      todo: '#6b7280',
      in_progress: '#3b82f6',
      blocked: '#ef4444',
      done: '#10b981',
      canceled: '#9ca3af',
    };
    return colors[status] || '#6b7280';
  };

  // Calculate progress percentage
  const getProgress = (task: Task): number => {
    if (task.status === 'done') return 100;
    if (task.status === 'todo') return 0;
    if (task.estimatedHours && task.completedHours) {
      return Math.min(Math.round((task.completedHours / task.estimatedHours) * 100), 100);
    }
    // Default progress for in_progress
    if (task.status === 'in_progress') return 50;
    return 0;
  };

  // Calculate critical path (simplified - tasks with blocked status or near deadline)
  const criticalTasks = useMemo(() => {
    const now = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    
    return new Set(tasks
      .filter(t => {
        if (t.status === 'blocked') return true;
        if (t.status === 'done') return false;
        if (t.dueAt && new Date(t.dueAt).getTime() - now.getTime() < threeDays) return true;
        return false;
      })
      .map(t => t.id)
    );
  }, [tasks]);

  // Handle drag start
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  // Handle drop on date
  const handleDropOnDate = (date: Date) => {
    if (!draggedTask) return;
    
    // Update task due date (in real app, this would call an API)
    setTasks(prev => prev.map(t => 
      t.id === draggedTask 
        ? { ...t, dueAt: date.toISOString() }
        : t
    ));
    setDraggedTask(null);
  };

  // Render dependency lines using SVG
  const renderDependencyLines = () => {
    if (!showDependencies) return null;

    const lines: React.ReactElement[] = [];
    
    tasks.forEach((task, taskIndex) => {
      if (!task.dependencies || !task.dueAt) return;
      
      task.dependencies.forEach(depId => {
        const depTask = tasks.find(t => t.id === depId);
        if (!depTask || !depTask.dueAt) return;
        
        const depIndex = tasks.findIndex(t => t.id === depId);
        
        // Calculate positions
        const fromX = getPosition(depTask.dueAt) + dayWidth;
        const fromY = 60 + (depIndex * 40) + 20;
        const toX = getPosition(task.dueAt);
        const toY = 60 + (taskIndex * 40) + 20;
        
        // Create curved path
        const midX = (fromX + toX) / 2;
        const path = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
        
        lines.push(
          <g key={`dep-${depId}-${task.id}`}>
            <path
              d={path}
              fill="none"
              stroke="var(--int-primary)"
              strokeWidth="2"
              strokeDasharray="4,2"
              opacity="0.6"
              markerEnd="url(#arrowhead)"
            />
          </g>
        );
      });
    });

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 250,
          width: totalDays * dayWidth,
          height: (tasks.length + milestones.length) * 40 + 60,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="var(--int-primary)"
              opacity="0.6"
            />
          </marker>
        </defs>
        {lines}
      </svg>
    );
  };

  return (
    <div className={s.card}>
      {/* Toolbar */}
      <div className={s.cardHeader} style={{ borderBottom: '1px solid var(--int-border)', paddingBottom: '1rem' }}>
        <h2 className={s.cardTitle}>Interactive Gantt Chart</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Zoom controls */}
          <div style={{ display: 'flex', border: '1px solid var(--int-border)', borderRadius: '8px', overflow: 'hidden' }}>
            {(['day', 'week', 'month'] as ZoomLevel[]).map(level => (
              <button
                key={level}
                onClick={() => setZoomLevel(level)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: zoomLevel === level ? 'var(--int-primary)' : 'transparent',
                  color: zoomLevel === level ? '#fff' : 'var(--int-text)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {level}
              </button>
            ))}
          </div>
          
          {/* Toggle buttons */}
          <button
            onClick={() => setShowDependencies(!showDependencies)}
            className={s.btnSecondary}
            style={{
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              opacity: showDependencies ? 1 : 0.5,
            }}
            title="Show Dependencies"
          >
            <span style={{ width: '16px', height: '16px' }}>{Icons.link}</span>
          </button>
          
          <button
            onClick={() => setShowCriticalPath(!showCriticalPath)}
            className={s.btnSecondary}
            style={{
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              opacity: showCriticalPath ? 1 : 0.5,
            }}
            title="Show Critical Path"
          >
            <span style={{ width: '16px', height: '16px' }}>{Icons.flag}</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--int-border)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '2px', background: '#6b7280' }}></span>
          <span>Todo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '2px', background: '#3b82f6' }}></span>
          <span>In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '2px', background: '#ef4444' }}></span>
          <span>Blocked</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '2px', background: '#10b981' }}></span>
          <span>Done</span>
        </div>
        {showCriticalPath && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '2px', border: '2px solid #ef4444', background: 'rgba(239,68,68,0.1)' }}></span>
            <span>Critical Path</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '14px', height: '14px', background: 'transparent', border: '2px solid #f59e0b', transform: 'rotate(45deg)' }}></span>
          <span style={{ marginLeft: '0.25rem' }}>Milestone</span>
        </div>
      </div>

      {/* Gantt Container */}
      <div style={{ overflowX: 'auto' }} ref={containerRef}>
        <div style={{ display: 'flex', minWidth: `${250 + totalDays * dayWidth}px`, position: 'relative' }}>
          {/* Task names column */}
          <div style={{ width: '250px', flexShrink: 0, borderRight: '1px solid var(--int-border)', background: 'var(--int-bg)' }}>
            {/* Header */}
            <div style={{ height: '60px', borderBottom: '1px solid var(--int-border)', padding: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
              Task Name
            </div>
            
            {/* Task rows */}
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                draggable
                onDragStart={() => handleDragStart(task.id)}
                style={{
                  height: '40px',
                  padding: '0 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--int-border)',
                  gap: '0.5rem',
                  cursor: 'grab',
                  background: selectedTask === task.id ? 'var(--int-bg-alt)' : 'transparent',
                  borderLeft: showCriticalPath && criticalTasks.has(task.id) ? '3px solid #ef4444' : '3px solid transparent',
                }}
              >
                {showCriticalPath && criticalTasks.has(task.id) && (
                  <span style={{ width: '14px', height: '14px', color: '#ef4444' }}>{Icons.warning}</span>
                )}
                <Link
                  href={`/internal/tasks/${task.id}`}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.875rem',
                    flex: 1,
                  }}
                  title={task.title}
                  onClick={(e) => e.stopPropagation()}
                >
                  {task.title}
                </Link>
                <span style={{
                  fontSize: '0.625rem',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '4px',
                  background: getStatusColor(task.status),
                  color: '#fff',
                }}>
                  {getProgress(task)}%
                </span>
              </div>
            ))}
            
            {/* Milestone rows */}
            {milestones.map((ms) => (
              <div
                key={ms.id}
                style={{
                  height: '40px',
                  padding: '0 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--int-border)',
                  gap: '0.5rem',
                  fontWeight: 500,
                  color: 'var(--int-warning)',
                }}
              >
                <span style={{ width: '14px', height: '14px' }}>{Icons.flag}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                  {ms.title}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Time period headers */}
            <div style={{ height: '60px', display: 'flex', borderBottom: '1px solid var(--int-border)' }}>
              {timePeriods.map((period, i) => (
                <div
                  key={i}
                  style={{
                    width: `${period.days.length * dayWidth}px`,
                    borderRight: '1px solid var(--int-border)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ padding: '0.25rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid var(--int-border)', background: 'var(--int-bg-alt)' }}>
                    {period.label}
                  </div>
                  {zoomLevel !== 'day' && (
                    <div style={{ display: 'flex', flex: 1 }}>
                      {period.days.map((day, j) => (
                        <div
                          key={j}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDropOnDate(day)}
                          style={{
                            width: `${dayWidth}px`,
                            borderRight: '1px solid var(--int-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.625rem',
                            opacity: day.getDay() === 0 || day.getDay() === 6 ? 0.4 : 0.7,
                            background: day.getDay() === 0 || day.getDay() === 6 ? 'rgba(0,0,0,0.03)' : 'transparent',
                          }}
                        >
                          {zoomLevel === 'week' ? day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0) : day.getDate()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Task bars with progress */}
            {tasks.map((task) => {
              const hasDueDate = task.dueAt !== null;
              const hasStartDate = task.startAt !== null;
              const duePos = hasDueDate ? getPosition(task.dueAt) : 0;
              const startPos = hasStartDate ? getPosition(task.startAt) : duePos - dayWidth * 3;
              const barWidth = Math.max(hasDueDate && hasStartDate ? duePos - startPos : dayWidth * 3, dayWidth);
              const progress = getProgress(task);
              const isCritical = showCriticalPath && criticalTasks.has(task.id);

              return (
                <div
                  key={task.id}
                  style={{
                    height: '40px',
                    position: 'relative',
                    borderBottom: '1px solid var(--int-border)',
                    background: selectedTask === task.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  }}
                >
                  {hasDueDate ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${startPos}px`,
                        top: '8px',
                        width: `${barWidth}px`,
                        height: '24px',
                        background: 'var(--int-bg-alt)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: isCritical ? '2px solid #ef4444' : 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                      title={`${task.title}\nStatus: ${task.status.replace(/_/g, ' ')}\nProgress: ${progress}%\nDue: ${new Date(task.dueAt!).toLocaleDateString()}`}
                    >
                      {/* Progress fill */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: `${progress}%`,
                          height: '100%',
                          background: getStatusColor(task.status),
                          transition: 'width 0.3s ease',
                        }}
                      />
                      {/* Task title inside bar */}
                      <span
                        style={{
                          position: 'absolute',
                          left: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: progress > 50 ? '#fff' : 'var(--int-text)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: `${barWidth - 16}px`,
                        }}
                      >
                        {task.title}
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '0.625rem',
                        opacity: 0.5,
                      }}
                    >
                      No due date - drag to schedule
                    </div>
                  )}
                </div>
              );
            })}

            {/* Milestone markers */}
            {milestones.map((ms) => {
              const pos = ms.dueAt ? getPosition(ms.dueAt) : 0;
              return (
                <div
                  key={ms.id}
                  style={{
                    height: '40px',
                    position: 'relative',
                    borderBottom: '1px solid var(--int-border)',
                  }}
                >
                  {ms.dueAt ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${pos}px`,
                        top: '50%',
                        transform: 'translate(-50%, -50%) rotate(45deg)',
                        width: '18px',
                        height: '18px',
                        background: ms.completedAt ? '#10b981' : '#f59e0b',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                      title={`${ms.title}\n${new Date(ms.dueAt).toLocaleDateString()}\n${ms.completedAt ? 'Completed' : 'Pending'}`}
                    />
                  ) : (
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.625rem', opacity: 0.5 }}>
                      No date set
                    </div>
                  )}
                </div>
              );
            })}

            {/* Today line */}
            {(() => {
              const now = new Date();
              const todayPos = getPosition(now);
              return todayPos > 0 && todayPos < totalDays * dayWidth ? (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${todayPos}px`,
                    width: '2px',
                    height: '100%',
                    background: '#ef4444',
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#ef4444',
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Today
                  </div>
                </div>
              ) : null;
            })()}

            {/* Dependency lines */}
            {renderDependencyLines()}
          </div>
        </div>
      </div>

      {/* Task Details Panel (when selected) */}
      {selectedTask && (() => {
        const task = tasks.find(t => t.id === selectedTask);
        if (!task) return null;
        
        return (
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--int-border)',
            background: 'var(--int-bg-alt)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{task.title}</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  <span>Status: <strong>{task.status.replace(/_/g, ' ')}</strong></span>
                  <span>Priority: <strong>{task.priority}</strong></span>
                  <span>Progress: <strong>{getProgress(task)}%</strong></span>
                  {task.dueAt && <span>Due: <strong>{new Date(task.dueAt).toLocaleDateString()}</strong></span>}
                </div>
              </div>
              <Link href={`/internal/tasks/${task.id}`} className={s.btnPrimary} style={{ fontSize: '0.875rem' }}>
                View Details
              </Link>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
