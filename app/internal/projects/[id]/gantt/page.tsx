import Link from 'next/link';
import { eq } from 'drizzle-orm';

import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { projects, tasks, milestones } from '@/lib/db/schema';
import s from '../../../styles.module.css';

// Icons
const Icons = {
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  arrowLeft: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  task: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  milestone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
};

interface PageParams {
  id: string;
}

export default async function GanttChartPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const session = await requireInternalSession();
  const db = getDb();
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  // Fetch project
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .get();

  if (!project) {
    return (
      <main className={s.page}>
        <div className={s.emptyState}>
          <h2>Project not found</h2>
          <Link href="/internal/projects" className={s.btnPrimary}>Back to Projects</Link>
        </div>
      </main>
    );
  }

  // Fetch tasks with dates
  const tasksList = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      priority: tasks.priority,
      dueAt: tasks.dueAt,
      sprintNumber: tasks.sprintNumber,
    })
    .from(tasks)
    .where(eq(tasks.projectId, projectId))
    .all();

  // Fetch milestones
  const milestonesList = await db
    .select({
      id: milestones.id,
      title: milestones.title,
      dueAt: milestones.dueAt,
      completedAt: milestones.completedAt,
    })
    .from(milestones)
    .where(eq(milestones.projectId, projectId))
    .all();

  // Calculate date range for Gantt view
  const now = new Date();
  const allDates: number[] = [];
  
  if (project.startAt) allDates.push(new Date(project.startAt).getTime());
  if (project.dueAt) allDates.push(new Date(project.dueAt).getTime());
  
  tasksList.forEach((t) => {
    if (t.dueAt) allDates.push(new Date(t.dueAt).getTime());
  });
  
  milestonesList.forEach((m) => {
    if (m.dueAt) allDates.push(new Date(m.dueAt).getTime());
  });

  // Default to 4 weeks if no dates
  const minDate = allDates.length > 0 
    ? new Date(Math.min(...allDates)) 
    : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const maxDate = allDates.length > 0 
    ? new Date(Math.max(...allDates)) 
    : new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

  // Add buffer
  const startDate = new Date(minDate.getTime() - 3 * 24 * 60 * 60 * 1000);
  const endDate = new Date(maxDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Generate weeks for header
  const weeks: { label: string; start: Date; days: Date[] }[] = [];
  const current = new Date(startDate);
  current.setDate(current.getDate() - current.getDay()); // Start from Sunday
  
  while (current <= endDate) {
    const weekStart = new Date(current);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push({
      label: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      start: weekStart,
      days,
    });
  }

  // Calculate total days for width
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  const dayWidth = 40; // pixels per day

  // Helper to calculate position
  const getPosition = (date: Date | null): number => {
    if (!date) return 0;
    const diff = new Date(date).getTime() - startDate.getTime();
    return Math.floor(diff / (24 * 60 * 60 * 1000)) * dayWidth;
  };

  // Helper for status color
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      todo: '#6b7280',
      in_progress: '#3b82f6',
      blocked: '#ef4444',
      done: '#10b981',
      canceled: '#9ca3af',
      pending: '#f59e0b',
      completed: '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <main className={s.page}>
      {/* Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.pageHeaderLeft}>
            <Link href={`/internal/projects/${projectId}`} className={s.backLink}>
              <span style={{ width: '16px', height: '16px' }}>{Icons.arrowLeft}</span>
              Back to Project
            </Link>
            <h1 className={s.pageTitle}>
              <span style={{ width: '24px', height: '24px', marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>{Icons.calendar}</span>
              Gantt Chart: {project.name}
            </h1>
            <p className={s.pageSubtitle}>
              {tasksList.length} task{tasksList.length !== 1 ? 's' : ''} • {milestonesList.length} milestone{milestonesList.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <section className={s.section}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '16px', height: '16px', borderRadius: '2px', background: 'var(--int-text-muted)' }}></span>
            <span>Todo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '16px', height: '16px', borderRadius: '2px', background: 'var(--int-info)' }}></span>
            <span>In Progress</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '16px', height: '16px', borderRadius: '2px', background: 'var(--int-error)' }}></span>
            <span>Blocked</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '16px', height: '16px', borderRadius: '2px', background: 'var(--int-success)' }}></span>
            <span>Done</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '16px', height: '16px', borderRadius: '0', background: 'transparent', border: '2px solid var(--int-warning)', transform: 'rotate(45deg)' }}></span>
            <span>Milestone</span>
          </div>
        </div>
      </section>

      {/* Gantt Chart */}
      <section className={s.card}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', minWidth: `${250 + totalDays * dayWidth}px` }}>
            {/* Task names column */}
            <div style={{ width: '250px', flexShrink: 0, borderRight: '1px solid var(--border-color, #e5e7eb)' }}>
              {/* Header */}
              <div style={{ height: '60px', borderBottom: '1px solid var(--border-color, #e5e7eb)', padding: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                Task Name
              </div>
              {/* Task rows */}
              {tasksList.map((task) => (
                <div
                  key={task.id}
                  style={{
                    height: '40px',
                    padding: '0 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color, #e5e7eb)',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ width: '14px', height: '14px', opacity: 0.6 }}>{Icons.task}</span>
                  <Link
                    href={`/internal/tasks/${task.id}`}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                    }}
                    title={task.title}
                  >
                    {task.title}
                  </Link>
                </div>
              ))}
              {/* Milestone rows */}
              {milestonesList.map((ms) => (
                <div
                  key={ms.id}
                  style={{
                    height: '40px',
                    padding: '0 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color, #e5e7eb)',
                    gap: '0.5rem',
                    fontWeight: 500,
                    color: 'var(--int-warning)',
                  }}
                >
                  <span style={{ width: '14px', height: '14px' }}>{Icons.milestone}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                    {ms.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div style={{ flex: 1 }}>
              {/* Week headers */}
              <div style={{ height: '60px', display: 'flex', borderBottom: '1px solid var(--border-color, #e5e7eb)' }}>
                {weeks.map((week, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${7 * dayWidth}px`,
                      borderRight: '1px solid var(--border-color, #e5e7eb)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ padding: '0.25rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid var(--border-color, #e5e7eb)' }}>
                      {week.label}
                    </div>
                    <div style={{ display: 'flex', flex: 1 }}>
                      {week.days.map((day, j) => (
                        <div
                          key={j}
                          style={{
                            width: `${dayWidth}px`,
                            borderRight: '1px solid var(--border-color, #e5e7eb)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.625rem',
                            opacity: day.getDay() === 0 || day.getDay() === 6 ? 0.4 : 0.7,
                            background: day.getDay() === 0 || day.getDay() === 6 ? 'rgba(0,0,0,0.03)' : 'transparent',
                          }}
                        >
                          {day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Task bars */}
              {tasksList.map((task) => {
                const hasDueDate = task.dueAt !== null;
                const duePos = hasDueDate ? getPosition(task.dueAt) : 0;
                // Since we don't have startAt, show a point for due date only
                const width = dayWidth;

                return (
                  <div
                    key={task.id}
                    style={{
                      height: '40px',
                      position: 'relative',
                      borderBottom: '1px solid var(--border-color, #e5e7eb)',
                    }}
                  >
                    {hasDueDate ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: `${duePos}px`,
                          top: '8px',
                          width: `${width}px`,
                          height: '24px',
                          background: getStatusColor(task.status),
                          borderRadius: '4px',
                          opacity: 0.85,
                        }}
                        title={`${task.title}\n${task.status.replace(/_/g, ' ')}\nDue: ${new Date(task.dueAt!).toLocaleDateString()}`}
                      />
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
                        No due date
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Milestone markers */}
              {milestonesList.map((ms) => {
                const pos = ms.dueAt ? getPosition(ms.dueAt) : 0;
                return (
                  <div
                    key={ms.id}
                    style={{
                      height: '40px',
                      position: 'relative',
                      borderBottom: '1px solid var(--border-color, #e5e7eb)',
                    }}
                  >
                    {ms.dueAt ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: `${pos}px`,
                          top: '50%',
                          transform: 'translate(-50%, -50%) rotate(45deg)',
                          width: '16px',
                          height: '16px',
                          background: ms.completedAt ? '#10b981' : '#f59e0b',
                          border: '2px solid #fff',
                        }}
                        title={`${ms.title}\n${new Date(ms.dueAt).toLocaleDateString()}`}
                      />
                    ) : (
                      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.625rem', opacity: 0.5 }}>
                        No date
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Today line */}
              {now >= startDate && now <= endDate && (
                <div
                  style={{
                    position: 'absolute',
                    top: '60px',
                    left: `${250 + getPosition(now)}px`,
                    width: '2px',
                    height: `${(tasksList.length + milestonesList.length) * 40}px`,
                    background: '#ef4444',
                    zIndex: 10,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Task Summary Table */}
      <section className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>Task Details</h2>
        </div>
        <div className={s.cardBody}>
          {tasksList.length > 0 ? (
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Sprint</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {tasksList.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <Link href={`/internal/tasks/${task.id}`}>{task.title}</Link>
                    </td>
                    <td>
                      <span
                        className={s.badge}
                        style={{ background: getStatusColor(task.status), color: 'white' }}
                      >
                        {task.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{task.priority}</td>
                    <td>{task.sprintNumber ? `Sprint ${task.sprintNumber}` : 'Backlog'}</td>
                    <td>{task.dueAt ? new Date(task.dueAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={s.emptyState}>
              <div className={s.emptyStateIcon}>{Icons.task}</div>
              <h3>No tasks yet</h3>
              <p>Add tasks to this project to see them on the Gantt chart</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
