import Link from 'next/link';
import { desc, eq, sql, notInArray } from 'drizzle-orm';

import s from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users, tasks } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';
import TeamClient from './TeamClient';

export default async function TeamPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();

  const teamStatsRaw = await db
    .select({
      user: users,
      activeTaskCount: sql<number>`count(case when ${tasks.status} not in ('done', 'canceled') then 1 else null end)`,
      completedTaskCount: sql<number>`count(case when ${tasks.status} = 'done' then 1 else null end)`,
    })
    .from(users)
    .leftJoin(tasks, eq(users.id, tasks.assigneeId))
    .groupBy(users.id)
    .orderBy(desc(sql`count(case when ${tasks.status} not in ('done', 'canceled') then 1 else null end)`))
    .all();

  // Parse skills manually since it's stored as text
  const teamStats = teamStatsRaw.map(stat => ({
    ...stat,
    user: {
      ...stat.user,
      skills: typeof stat.user.skills === 'string' 
        ? JSON.parse(stat.user.skills) 
        : (Array.isArray(stat.user.skills) ? stat.user.skills : [])
    }
  }));

  async function updateSkills(userId: string, skills: string[]) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();
    
    await db.update(users)
      .set({ skills: JSON.stringify(skills) as any })
      .where(eq(users.id, userId));
  }

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>Team Workload</h1>
          <p className={s.pageSubtitle}>Overview of team members and their active tasks</p>
        </div>
      </div>

      <TeamClient teamStats={teamStats} updateSkillsAction={updateSkills} />
    </main>
  );
}

