import { desc } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import UsersAdminClient from './users-client';

export default async function AdminUsersPage() {
  await requireRole(['admin']);
  const db = getDb();

  const list = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
      role: users.role,
      status: users.status,
      skills: users.skills,
      capacity: users.capacity,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .all();

  return (
    <main className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Users</h1>
            <p className={s.pageSubtitle}>
              Manage roles and approvals (status) for internal access
            </p>
          </div>
        </div>

        <UsersAdminClient initialUsers={list} />
      </div>
    </main>
  );
}
