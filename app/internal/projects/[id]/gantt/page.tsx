import Link from 'next/link';
import { eq } from 'drizzle-orm';

import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { projects, tasks, milestones } from '@/lib/db/schema';
import s from '../../../styles.module.css';
import GanttClient from './GanttClient';

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

  // Prepare data for client component
  const projectData = {
    id: project.id,
    name: project.name,
    startAt: project.startAt ? project.startAt.toString() : null,
    dueAt: project.dueAt ? project.dueAt.toString() : null,
  };

  const tasksData = tasksList.map(t => ({
    id: t.id,
    title: t.title,
    status: t.status,
    priority: t.priority,
    dueAt: t.dueAt ? t.dueAt.toString() : null,
    startAt: null, // Add if available in schema
    sprintNumber: t.sprintNumber,
    estimatedHours: null,
    completedHours: null,
    dependencies: [], // Add if available in schema
  }));

  const milestonesData = milestonesList.map(m => ({
    id: m.id,
    title: m.title,
    dueAt: m.dueAt ? m.dueAt.toString() : null,
    completedAt: m.completedAt ? m.completedAt.toString() : null,
  }));

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

      {/* Interactive Gantt Chart */}
      <GanttClient 
        project={projectData} 
        tasks={tasksData} 
        milestones={milestonesData} 
      />

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
                        style={{ 
                          background: task.status === 'done' ? '#10b981' : 
                                     task.status === 'in_progress' ? '#3b82f6' : 
                                     task.status === 'blocked' ? '#ef4444' : '#6b7280', 
                          color: 'white' 
                        }}
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
