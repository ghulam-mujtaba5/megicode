import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { requireInternalApiSession, ApiError } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';

const VALID_ROLES = new Set(['admin', 'pm', 'dev', 'qa', 'viewer']);
const VALID_STATUSES = new Set(['active', 'pending', 'disabled']);

export async function GET() {
  try {
    const session = await requireInternalApiSession();
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = getDb();
    const list = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .all();

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('List users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireInternalApiSession();
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId, role, status } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (role !== undefined && !VALID_ROLES.has(String(role))) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (status !== undefined && !VALID_STATUSES.has(String(status))) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    if (role === undefined && status === undefined) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const db = getDb();
    await db
      .update(users)
      .set({
        ...(role !== undefined ? { role } : {}),
        ...(status !== undefined ? { status } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
