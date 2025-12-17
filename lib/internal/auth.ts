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

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function requireInternalApiSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new ApiError('Unauthorized', 401);
  }
  return session;
}

export async function requireActiveUser() {
  const session = await requireInternalSession();
  const status = session.user.status;
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

