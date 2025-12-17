import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireInternalApiSession, ApiError } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    const session = await requireInternalApiSession();
    // Onboarding completion - mark timestamp or update profile
    // For now, just return success as user is already in system

    const db = getDb();
    await db
      .update(users)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
