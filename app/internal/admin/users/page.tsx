import { redirect } from 'next/navigation';
import { desc } from 'drizzle-orm';
import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import UsersTable from './UsersTable';

export default async function AdminUsersPage() {
  const session = await requireInternalSession();
  
  if (session.user.role !== 'admin') {
    redirect('/internal');
  }

  const db = getDb();
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).all();

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>User Management</h1>
      <UsersTable users={allUsers as any} />
    </div>
  );
}
