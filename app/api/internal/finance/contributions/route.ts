import { NextResponse } from 'next/server';
import { eq, desc, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { founderContributions, founders, companyAccounts } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';
import { nanoid } from 'nanoid';

// GET - Fetch all contributions
export async function GET(request: Request) {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const founderId = searchParams.get('founderId');
    
    const baseQuery = db
      .select({
        id: founderContributions.id,
        founderId: founderContributions.founderId,
        founderName: founders.name,
        contributionType: founderContributions.contributionType,
        amount: founderContributions.amount,
        currency: founderContributions.currency,
        purpose: founderContributions.purpose,
        toAccountId: founderContributions.toAccountId,
        accountName: companyAccounts.name,
        contributedAt: founderContributions.contributedAt,
        notes: founderContributions.notes,
        status: founderContributions.status,
        createdAt: founderContributions.createdAt,
      })
      .from(founderContributions)
      .leftJoin(founders, eq(founderContributions.founderId, founders.id))
      .leftJoin(companyAccounts, eq(founderContributions.toAccountId, companyAccounts.id))
      .orderBy(desc(founderContributions.contributedAt));
    
    const contributions = founderId 
      ? await baseQuery.where(eq(founderContributions.founderId, founderId))
      : await baseQuery;
    
    // Get summary by founder
    const summary = await db
      .select({
        founderId: founderContributions.founderId,
        founderName: founders.name,
        totalContributions: sql<number>`COALESCE(SUM(${founderContributions.amount}), 0)`,
        contributionCount: sql<number>`COUNT(*)`,
      })
      .from(founderContributions)
      .leftJoin(founders, eq(founderContributions.founderId, founders.id))
      .where(eq(founderContributions.status, 'confirmed'))
      .groupBy(founderContributions.founderId, founders.name);
    
    return NextResponse.json({ contributions, summary });
  } catch (error) {
    console.error('Failed to fetch contributions:', error);
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 });
  }
}

// POST - Record a new contribution
export async function POST(request: Request) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const body = await request.json();
    
    const now = new Date();
    const contributionId = nanoid();
    
    // Update account balance if deposited to an account
    if (body.toAccountId) {
      await db
        .update(companyAccounts)
        .set({
          currentBalance: sql`${companyAccounts.currentBalance} + ${body.amount}`,
          updatedAt: now,
        })
        .where(eq(companyAccounts.id, body.toAccountId));
    }
    
    await db.insert(founderContributions).values({
      id: contributionId,
      founderId: body.founderId,
      contributionType: body.contributionType || 'initial_investment',
      amount: body.amount,
      currency: body.currency || 'PKR',
      purpose: body.purpose || null,
      toAccountId: body.toAccountId || null,
      status: 'confirmed',
      contributedAt: body.contributedAt ? new Date(body.contributedAt) : now,
      notes: body.notes || null,
      receiptUrl: body.receiptUrl || null,
      createdAt: now,
      updatedAt: now,
    });
    
    return NextResponse.json({ success: true, id: contributionId });
  } catch (error) {
    console.error('Failed to create contribution:', error);
    return NextResponse.json({ error: 'Failed to create contribution' }, { status: 500 });
  }
}
