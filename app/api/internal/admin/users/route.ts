import { NextResponse } from 'next/server';
import { desc, eq, like, or, sql } from 'drizzle-orm';
import { requireInternalApiSession, ApiError } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';

const VALID_ROLES = new Set(['admin', 'pm', 'dev', 'qa', 'viewer']);
const VALID_STATUSES = new Set(['active', 'pending', 'disabled']);

export async function GET(req: Request) {
  try {
    const session = await requireInternalApiSession();
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    const db = getDb();
    
    let query = db
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
      .orderBy(desc(users.createdAt));

    const list = await query.all();
    
    // Filter in JS for simplicity (small dataset)
    let filtered = list;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(u => 
        u.email.toLowerCase().includes(s) || 
        (u.name && u.name.toLowerCase().includes(s))
      );
    }
    if (role && VALID_ROLES.has(role)) {
      filtered = filtered.filter(u => u.role === role);
    }
    if (status && VALID_STATUSES.has(status)) {
      filtered = filtered.filter(u => u.status === status);
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('List users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create new user (invite)
export async function POST(req: Request) {
  try {
    const session = await requireInternalApiSession();
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { email, name, role, status, skills, capacity } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (role && !VALID_ROLES.has(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (status && !VALID_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const db = getDb();
    
    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.email, normalizedEmail)).get();
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const now = new Date();
    const newUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      name: name || null,
      image: null,
      role: role || 'viewer',
      status: status || 'pending',
      skills: skills || null,
      capacity: capacity || 40,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(users).values(newUser);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireInternalApiSession();
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId, role, status, name, skills, capacity } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (role !== undefined && !VALID_ROLES.has(String(role))) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (status !== undefined && !VALID_STATUSES.has(String(status))) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (name !== undefined) updateData.name = name;
    if (skills !== undefined) updateData.skills = skills;
    if (capacity !== undefined) updateData.capacity = capacity;

    if (Object.keys(updateData).length === 1) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const db = getDb();
    
    // Prevent self-demotion from admin
    if (role !== undefined && role !== 'admin' && userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot demote yourself from admin' }, { status: 400 });
    }
    
    // Prevent disabling yourself
    if (status === 'disabled' && userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot disable your own account' }, { status: 400 });
    }

    await db
      .update(users)
      .set(updateData)
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

// Delete user
export async function DELETE(req: Request) {
  try {
    const session = await requireInternalApiSession();
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent self-deletion
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const db = getDb();
    
    // Check user exists
    const existing = await db.select().from(users).where(eq(users.id, userId)).get();
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
