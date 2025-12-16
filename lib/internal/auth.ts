import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import type { UserRole } from '@/lib/db/schema';
import { authOptions } from '@/auth';

export async function requireInternalSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/internal/login');
  return session;
}

export function hasRole(role: unknown, allowed: UserRole[]) {
  return typeof role === 'string' && allowed.includes(role as UserRole);
}

export async function requireRole(allowed: UserRole[]) {
  const session = await requireInternalSession();
  if (!hasRole(session.user.role, allowed)) {
    redirect('/internal?forbidden=1');
  }
  return session;
}

export async function requireActiveUser() {
  const session = await requireInternalSession();
  // @ts-ignore
  const status = session.user.status;
  // @ts-ignore
  const role = session.user.role;

  // Admins always bypass pending status
  if (role === 'admin') {
    return session;
  }

  // Non-admins must be active
  if (status !== 'active') {
    redirect('/internal/onboarding');
  }
  return session;
}

