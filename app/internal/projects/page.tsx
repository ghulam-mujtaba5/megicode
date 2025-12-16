import Link from 'next/link';
import { desc } from 'drizzle-orm';

import commonStyles from '../internalCommon.module.css';
import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { projectStatusColor, type BadgeColor, formatDateTime } from '@/lib/internal/ui';

function badgeClass(styles: typeof commonStyles, color: BadgeColor) {
  if (color === 'blue') return `${styles.badge} ${styles.badgeBlue}`;
  if (color === 'green') return `${styles.badge} ${styles.badgeGreen}`;
  if (color === 'yellow') return `${styles.badge} ${styles.badgeYellow}`;
  if (color === 'red') return `${styles.badge} ${styles.badgeRed}`;
  return `${styles.badge} ${styles.badgeGray}`;
}

export default async function ProjectsPage() {
  await requireInternalSession();

  const db = getDb();
  const rows = await db.select().from(projects).orderBy(desc(projects.createdAt)).all();
  const userRows = await db.select().from(users).all();
  const usersById = new Map(userRows.map((u) => [u.id, u] as const));

  return (
    <main className={commonStyles.page}>
      <section className={commonStyles.card}>
        <div className={commonStyles.row}>
          <h1>Projects</h1>
          <span className={commonStyles.muted}>Total: {rows.length}</span>
        </div>

        <table className={commonStyles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const owner = p.ownerUserId ? usersById.get(p.ownerUserId) : null;
              return (
                <tr key={p.id}>
                  <td>
                    <div>{p.name}</div>
                    <div className={commonStyles.muted}>Priority: {p.priority}</div>
                  </td>
                  <td>
                    <span className={badgeClass(commonStyles, projectStatusColor(p.status))}>{p.status}</span>
                  </td>
                  <td>{owner?.email ?? ''}</td>
                  <td>{formatDateTime(p.createdAt)}</td>
                  <td>
                    <Link href={`/internal/projects/${p.id}`}>Open</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
