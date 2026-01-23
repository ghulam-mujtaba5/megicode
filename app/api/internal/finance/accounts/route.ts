import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getDb } from '@/lib/db';
import { companyAccounts, founders } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';

// GET - List all accounts
export async function GET() {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    
    const accountsList = await db
      .select({
        id: companyAccounts.id,
        name: companyAccounts.name,
        accountType: companyAccounts.accountType,
        founderId: companyAccounts.founderId,
        bankName: companyAccounts.bankName,
        accountNumber: companyAccounts.accountNumber,
        walletProvider: companyAccounts.walletProvider,
        currency: companyAccounts.currency,
        currentBalance: companyAccounts.currentBalance,
        status: companyAccounts.status,
        isPrimary: companyAccounts.isPrimary,
        notes: companyAccounts.notes,
        createdAt: companyAccounts.createdAt,
        founderName: founders.name,
      })
      .from(companyAccounts)
      .leftJoin(founders, eq(companyAccounts.founderId, founders.id))
      .orderBy(desc(companyAccounts.createdAt));
    
    return NextResponse.json({ accounts: accountsList });
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// POST - Create a new account
export async function POST(request: Request) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const body = await request.json();
    
    const now = new Date();
    const newAccount = {
      id: nanoid(),
      name: body.name,
      accountType: body.accountType,
      founderId: body.founderId || null,
      bankName: body.bankName || null,
      accountNumber: body.accountNumber || null,
      walletProvider: body.walletProvider || null,
      currency: body.currency || 'PKR',
      currentBalance: body.currentBalance || 0,
      status: 'active' as const,
      isPrimary: body.isPrimary || false,
      notes: body.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    
    await db.insert(companyAccounts).values(newAccount);
    
    return NextResponse.json({ account: newAccount });
  } catch (error) {
    console.error('Failed to create account:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
