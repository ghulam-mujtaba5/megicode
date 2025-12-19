import Link from 'next/link';
import { eq, sql, and, isNotNull, desc, gte } from 'drizzle-orm';

import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users, tasks, projects } from '@/lib/db/schema';
import s from '../styles.module.css';
import ResourcesClient from './ResourcesClient';
import ResourceSuggester from './ResourceSuggester';

// Icons
const Icons = {
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  task: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

// Workload thresholds
const WORKLOAD_THRESHOLD_HIGH = 10; // More than 10 active tasks = high workload
const WORKLOAD_THRESHOLD_CRITICAL = 15; // More than 15 = critical

export default async function ResourceAllocationPage() {
  await requireInternalSession();
  const db = getDb();

  // Fetch all users
  const usersListRaw = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      skills: users.skills,
    })
    .from(users)
    .all();

  const usersList = usersListRaw.map(u => ({
    ...u,
    skills: typeof u.skills === 'string' ? JSON.parse(u.skills) : (Array.isArray(u.skills) ? u.skills : [])
  }));

  // Fetch active tasks grouped by user
  const taskStats = await db
    .select({
      userId: tasks.assignedToUserId,
      total: sql<number>`count(*)`,
      inProgress: sql<number>`sum(case when status = 'in_progress' then 1 else 0 end)`,
      blocked: sql<number>`sum(case when status = 'blocked' then 1 else 0 end)`,
      todo: sql<number>`sum(case when status = 'todo' then 1 else 0 end)`,
    })
    .from(tasks)
    .where(
      and(
        isNotNull(tasks.assignedToUserId),
        sql`status not in ('done', 'canceled')`
      )
    )
    .groupBy(tasks.assignedToUserId)
    .all();

  // Create a map of user task stats
  const taskStatsMap = new Map<string, typeof taskStats[0]>();
  taskStats.forEach((stat) => {
    if (stat.userId) taskStatsMap.set(stat.userId, stat);
  });

  // Prepare data for suggester
  const usersForSuggester = usersList.map(u => ({
    ...u,
    workload: taskStatsMap.get(u.id)?.total || 0
  }));

  // Fetch projects with owners
  const projectStats = await db
    .select({
      userId: projects.ownerUserId,
      total: sql<number>`count(*)`,
      active: sql<number>`sum(case when status in ('new', 'in_progress', 'in_qa', 'blocked') then 1 else 0 end)`,
    })
    .from(projects)
    .where(isNotNull(projects.ownerUserId))
    .groupBy(projects.ownerUserId)
    .all();

  const projectStatsMap = new Map<string, typeof projectStats[0]>();
  projectStats.forEach((stat) => {
    if (stat.userId) projectStatsMap.set(stat.userId, stat);
  });

  // Fetch recent tasks per user for detail view
  const recentTasksByUser = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      priority: tasks.priority,
      assignedToUserId: tasks.assignedToUserId,
      dueAt: tasks.dueAt,
    })
    .from(tasks)
    .where(
      and(
        isNotNull(tasks.assignedToUserId),
        sql`status not in ('done', 'canceled')`
      )
    )
    .orderBy(desc(tasks.dueAt))
    .all();

  const tasksByUser = new Map<string, typeof recentTasksByUser>();
  recentTasksByUser.forEach((task) => {
    if (!task.assignedToUserId) return;
    const list = tasksByUser.get(task.assignedToUserId) || [];
    list.push(task);
    tasksByUser.set(task.assignedToUserId, list);
  });

  // Developer Velocity - tasks completed in the last 30 days per user
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const velocityStats = await db
    .select({
      userId: tasks.assignedToUserId,
      completed: sql<number>`count(*)`,
      sprint1: sql<number>`sum(case when sprint_number = 1 then 1 else 0 end)`,
      sprint2: sql<number>`sum(case when sprint_number = 2 then 1 else 0 end)`,
      sprint3: sql<number>`sum(case when sprint_number = 3 then 1 else 0 end)`,
      sprint4: sql<number>`sum(case when sprint_number = 4 then 1 else 0 end)`,
    })
    .from(tasks)
    .where(
      and(
        isNotNull(tasks.assignedToUserId),
        eq(tasks.status, 'done'),
        gte(tasks.completedAt, thirtyDaysAgo)
      )
    )
    .groupBy(tasks.assignedToUserId)
    .all();

  const velocityMap = new Map<string, typeof velocityStats[0]>();
  velocityStats.forEach((stat) => {
    if (stat.userId) velocityMap.set(stat.userId, stat);
  });

  // Calculate team average velocity
  const totalCompleted = velocityStats.reduce((sum, v) => sum + (v.completed ?? 0), 0);
  const avgVelocity = velocityStats.length > 0 ? Math.round(totalCompleted / velocityStats.length) : 0;

  // Calculate workload level
  const getWorkloadLevel = (taskCount: number): { level: 'low' | 'medium' | 'high' | 'critical'; color: string; label: string } => {
    if (taskCount >= WORKLOAD_THRESHOLD_CRITICAL) {
      return { level: 'critical', color: 'var(--int-error)', label: 'Overloaded' };
    } else if (taskCount >= WORKLOAD_THRESHOLD_HIGH) {
      return { level: 'high', color: 'var(--int-warning)', label: 'High' };
    } else if (taskCount >= 5) {
      return { level: 'medium', color: 'var(--int-info)', label: 'Normal' };
    }
    return { level: 'low', color: 'var(--int-success)', label: 'Light' };
  };

  const getRoleBadge = (role: string | null) => {
    const map: Record<string, { bg: string; color: string }> = {
      admin: { bg: 'var(--int-error)', color: '#fff' },
      pm: { bg: 'var(--int-secondary)', color: '#fff' },
      dev: { bg: 'var(--int-info)', color: '#fff' },
      qa: { bg: 'var(--int-success)', color: '#fff' },
      viewer: { bg: 'var(--int-text-muted)', color: '#fff' },
    };
    return map[role || 'viewer'] || map.viewer;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      todo: '#6b7280',
      in_progress: '#3b82f6',
      blocked: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  // Sort users by workload (most overloaded first)
  const sortedUsers = [...usersList].sort((a, b) => {
    const aStats = taskStatsMap.get(a.id);
    const bStats = taskStatsMap.get(b.id);
    return (bStats?.total ?? 0) - (aStats?.total ?? 0);
  });

  // Count overloaded users
  const overloadedCount = sortedUsers.filter((u) => {
    const stats = taskStatsMap.get(u.id);
    return (stats?.total ?? 0) >= WORKLOAD_THRESHOLD_HIGH;
  }).length;

  return (
    <main className={s.page}>
      {/* Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.pageHeaderLeft}>
            <h1 className={s.pageTitle}>
              <span style={{ width: '24px', height: '24px', marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>{Icons.users}</span>
              Resource Allocation
            </h1>
            <p className={s.pageSubtitle}>
              {usersList.length} team member{usersList.length !== 1 ? 's' : ''} • View workload distribution
            </p>
          </div>
        </div>
      </div>

      {/* Workload Warning */}
      {overloadedCount > 0 && (
        <section style={{ background: 'var(--int-error-light)', border: '1px solid var(--int-error)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '24px', height: '24px', color: 'var(--int-error)' }}>{Icons.warning}</span>
          <div>
            <strong style={{ color: 'var(--int-error)' }}>{overloadedCount} team member{overloadedCount !== 1 ? 's' : ''} overloaded</strong>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--int-error)', fontSize: '0.875rem' }}>
              Consider reassigning tasks to balance the workload
            </p>
          </div>
        </section>
      )}

      {/* Summary Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className={s.card}>
          <div className={s.cardBody} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{usersList.length}</div>
            <div className={s.textMuted}>Team Members</div>
          </div>
        </div>
        <div className={s.card}>
          <div className={s.cardBody} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{recentTasksByUser.length}</div>
            <div className={s.textMuted}>Active Tasks</div>
          </div>
        </div>
        <div className={s.card}>
          <div className={s.cardBody} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: overloadedCount > 0 ? 'var(--int-error)' : 'var(--int-success)' }}>{overloadedCount}</div>
            <div className={s.textMuted}>Overloaded</div>
          </div>
        </div>
        <div className={s.card}>
          <div className={s.cardBody} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {projectStats.reduce((sum, p) => sum + (p.active ?? 0), 0)}
            </div>
            <div className={s.textMuted}>Active Projects</div>
          </div>
        </div>
      </section>

      {/* Developer Velocity Section */}
      <section className={s.card} style={{ marginBottom: '1.5rem' }}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '20px', height: '20px', color: 'var(--int-primary, #3b82f6)' }}>{Icons.trending}</span>
            Developer Velocity
          </h2>
          <span className={s.textMuted} style={{ fontSize: '0.75rem' }}>Tasks completed in last 30 days</span>
        </div>
        <div className={s.cardBody}>
          {velocityStats.length === 0 ? (
            <p className={s.textMuted} style={{ textAlign: 'center', padding: '1rem' }}>No completed tasks in the last 30 days</p>
          ) : (
            <>
              {/* Team Average */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'var(--int-bg-alt, #f3f4f6)', borderRadius: '8px' }}>
                <div>
                  <div className={s.textMuted} style={{ fontSize: '0.75rem' }}>Team Average</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{avgVelocity} tasks/member</div>
                </div>
                <div>
                  <div className={s.textMuted} style={{ fontSize: '0.75rem' }}>Total Completed</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-success, #10b981)' }}>{totalCompleted}</div>
                </div>
              </div>

              {/* Individual Velocity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {sortedUsers
                  .map((user) => {
                    const velocity = velocityMap.get(user.id);
                    if (!velocity || velocity.completed === 0) return null;
                    const isAboveAvg = (velocity.completed ?? 0) >= avgVelocity;
                    
                    return (
                      <div
                        key={user.id}
                        style={{
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid var(--int-border, #e5e7eb)',
                          background: isAboveAvg ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.name || user.email.split('@')[0]}</div>
                          <span
                            className={s.badge}
                            style={{
                              background: isAboveAvg ? 'var(--int-success)' : 'var(--int-text-muted)',
                              color: 'white',
                              fontSize: '0.625rem',
                            }}
                          >
                            {velocity.completed}
                          </span>
                        </div>
                        
                        {/* Sprint breakdown bar */}
                        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'var(--int-border)' }}>
                          {[velocity.sprint1, velocity.sprint2, velocity.sprint3, velocity.sprint4].map((count, i) => {
                            const pct = velocity.completed ? ((count ?? 0) / velocity.completed) * 100 : 0;
                            const colors = ['var(--int-info)', 'var(--int-secondary)', 'var(--int-success)', 'var(--int-warning)'];
                            return pct > 0 ? (
                              <div
                                key={i}
                                style={{ width: `${pct}%`, height: '100%', background: colors[i] }}
                                title={`Sprint ${i + 1}: ${count ?? 0}`}
                              />
                            ) : null;
                          })}
                        </div>
                        <div className={s.textMuted} style={{ fontSize: '0.625rem', marginTop: '0.25rem' }}>
                          S1: {velocity.sprint1 ?? 0} • S2: {velocity.sprint2 ?? 0} • S3: {velocity.sprint3 ?? 0} • S4: {velocity.sprint4 ?? 0}
                        </div>
                      </div>
                    );
                  })
                  .filter(Boolean)
                }
              </div>
            </>
          )}
        </div>
      </section>

      {/* Team Workload - Collapsible */}
      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Team Workload & Tasks</h2>
        <ResourcesClient
          users={sortedUsers.map((user) => {
            const tStats = taskStatsMap.get(user.id);
            const pStats = projectStatsMap.get(user.id);
            const workload = getWorkloadLevel(tStats?.total ?? 0);
            const roleBadge = getRoleBadge(user.role);
            const userTasks = tasksByUser.get(user.id) || [];

            return {
              ...user,
              taskStats: {
                total: tStats?.total ?? 0,
                inProgress: tStats?.inProgress ?? 0,
                blocked: tStats?.blocked ?? 0,
              },
              tasks: userTasks,
              projectCount: pStats?.active ?? 0,
              workloadLevel: workload.label,
              workloadColor: workload.color,
              roleBg: roleBadge.bg,
              roleColor: roleBadge.color,
            };
          })}
        />
      </section>

      <ResourceSuggester users={usersForSuggester} />
    </main>
  );
}
