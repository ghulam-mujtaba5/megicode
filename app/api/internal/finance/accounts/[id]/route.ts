import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { companyAccounts } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';

// PUT - Update an account
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
      .update(companyAccounts)
      .set({
        name: body.name,
        accountType: body.accountType,
        founderId: body.founderId || null,
        bankName: body.bankName || null,
        accountNumber: body.accountNumber || null,
        walletProvider: body.walletProvider || null,
        currency: body.currency,
        currentBalance: body.currentBalance,
        isPrimary: body.isPrimary || false,
        notes: body.notes || null,
        updatedAt: now,
      })
      .where(eq(companyAccounts.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update account:', error);
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

// DELETE - Deactivate an account
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const { id } = await params;
    
    await db
      .update(companyAccounts)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(companyAccounts.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to deactivate account:', error);
    return NextResponse.json({ error: 'Failed to deactivate account' }, { status: 500 });
  }
}
