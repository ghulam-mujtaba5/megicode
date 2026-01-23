import { NextResponse } from 'next/server';
import { eq, sql, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getDb } from '@/lib/db';
import { founders, founderContributions, founderDistributionItems } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';

// GET - List all founders with their contribution totals
export async function GET() {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    
    // Get founders with aggregated contribution and distribution totals
    const foundersList = await db
      .select({
        id: founders.id,
        name: founders.name,
        email: founders.email,
        phone: founders.phone,
        profitSharePercentage: founders.profitSharePercentage,
        status: founders.status,
        joinedAt: founders.joinedAt,
        notes: founders.notes,
        createdAt: founders.createdAt,
        updatedAt: founders.updatedAt,
      })
      .from(founders)
      .orderBy(desc(founders.createdAt));
    
    // Get contribution totals per founder
    const contributions = await db
      .select({
        founderId: founderContributions.founderId,
        total: sql<number>`coalesce(sum(${founderContributions.amount}), 0)`,
      })
      .from(founderContributions)
      .where(eq(founderContributions.status, 'confirmed'))
      .groupBy(founderContributions.founderId);
    
    // Get distribution totals per founder
    const distributions = await db
      .select({
        founderId: founderDistributionItems.founderId,
        total: sql<number>`coalesce(sum(${founderDistributionItems.netAmount}), 0)`,
      })
      .from(founderDistributionItems)
      .where(eq(founderDistributionItems.status, 'transferred'))
      .groupBy(founderDistributionItems.founderId);
    
    const contributionMap = new Map(contributions.map(c => [c.founderId, c.total]));
    const distributionMap = new Map(distributions.map(d => [d.founderId, d.total]));
    
    const foundersWithTotals = foundersList.map(f => ({
      ...f,
      totalContributions: contributionMap.get(f.id) || 0,
      totalDistributions: distributionMap.get(f.id) || 0,
    }));
    
    return NextResponse.json({ founders: foundersWithTotals });
  } catch (error) {
    console.error('Failed to fetch founders:', error);
    return NextResponse.json({ error: 'Failed to fetch founders' }, { status: 500 });
  }
}

// POST - Create a new founder
export async function POST(request: Request) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const body = await request.json();
    
    // Validate profit share percentage
    if (body.profitSharePercentage !== undefined) {
      if (body.profitSharePercentage < 0 || body.profitSharePercentage > 100) {
        return NextResponse.json({ 
          error: 'Profit share percentage must be between 0 and 100' 
        }, { status: 400 });
      }
      
      // Check total doesn't exceed 100%
      const existingFounders = await db
        .select({ total: sql<number>`COALESCE(SUM(${founders.profitSharePercentage}), 0)` })
        .from(founders)
        .where(eq(founders.status, 'active'));
      
      const currentTotal = existingFounders[0]?.total || 0;
      if (currentTotal + body.profitSharePercentage > 100) {
        return NextResponse.json({ 
          error: `Total profit share cannot exceed 100%. Current total is ${currentTotal}%, only ${100 - currentTotal}% remaining.` 
        }, { status: 400 });
      }
    }
    
    const now = new Date();
    const newFounder = {
      id: nanoid(),
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      profitSharePercentage: body.profitSharePercentage || 50,
      status: 'active' as const,
      joinedAt: body.joinedAt ? new Date(body.joinedAt) : now,
      notes: body.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    
    await db.insert(founders).values(newFounder);
    
    return NextResponse.json({ founder: newFounder });
  } catch (error) {
    console.error('Failed to create founder:', error);
    return NextResponse.json({ error: 'Failed to create founder' }, { status: 500 });
  }
}
