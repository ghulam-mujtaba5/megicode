import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function PUT(req: Request) {
  try {
    const session = await requireInternalSession();
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = getDb();
    await db
      .update(users)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
