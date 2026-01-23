import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { founders } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';

// PUT - Update a founder
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    
    const now = new Date();
    await db
      .update(founders)
      .set({
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        profitSharePercentage: body.profitSharePercentage,
        notes: body.notes || null,
        updatedAt: now,
      })
      .where(eq(founders.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update founder:', error);
    return NextResponse.json({ error: 'Failed to update founder' }, { status: 500 });
  }
}

// DELETE - Deactivate a founder (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const { id } = await params;
    
    await db
      .update(founders)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(founders.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to deactivate founder:', error);
    return NextResponse.json({ error: 'Failed to deactivate founder' }, { status: 500 });
  }
}
