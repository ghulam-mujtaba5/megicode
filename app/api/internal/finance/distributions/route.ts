import { NextResponse } from 'next/server';
import { eq, desc, sql, and } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { 
  profitDistributions, 
  founderDistributionItems, 
  founders, 
  companyAccounts,
  financialSettings,
} from '@/lib/db/schema';
import type { DistributionStatus } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';
import { nanoid } from 'nanoid';

// GET - Fetch all distributions
export async function GET(request: Request) {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status') as DistributionStatus | null;
    
    const conditions = [];
    if (status) {
      conditions.push(eq(profitDistributions.status, status));
    }
    
    const distributions = await db
      .select()
      .from(profitDistributions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(profitDistributions.createdAt));
    
    // Get distribution items for each distribution
    const distributionsWithItems = await Promise.all(
      distributions.map(async (dist) => {
        const items = await db
          .select({
            id: founderDistributionItems.id,
            founderId: founderDistributionItems.founderId,
            founderName: founders.name,
            sharePercentage: founderDistributionItems.sharePercentage,
            grossAmount: founderDistributionItems.grossAmount,
            deductions: founderDistributionItems.deductions,
            netAmount: founderDistributionItems.netAmount,
            toAccountId: founderDistributionItems.toAccountId,
            accountName: companyAccounts.name,
            status: founderDistributionItems.status,
          })
          .from(founderDistributionItems)
          .leftJoin(founders, eq(founderDistributionItems.founderId, founders.id))
          .leftJoin(companyAccounts, eq(founderDistributionItems.toAccountId, companyAccounts.id))
          .where(eq(founderDistributionItems.distributionId, dist.id));
        
        return { ...dist, items };
      })
    );
    
    return NextResponse.json({ distributions: distributionsWithItems });
  } catch (error) {
    console.error('Failed to fetch distributions:', error);
    return NextResponse.json({ error: 'Failed to fetch distributions' }, { status: 500 });
  }
}

// POST - Create a new profit distribution
export async function POST(request: Request) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const body = await request.json();
    
    const now = new Date();
    const distributionId = nanoid();
    
    // Get financial settings for retention percentage (default 10%)
    const [settings] = await db
      .select()
      .from(financialSettings)
      .where(eq(financialSettings.settingKey, 'company_retention_percentage'))
      .limit(1);
    
    const retentionPercentage = settings ? parseInt(settings.settingValue) : 10;
    
    // Calculate amounts
    const totalProfit = body.totalProfit;
    const companyRetention = Math.round((totalProfit * retentionPercentage) / 100);
    const distributedAmount = totalProfit - companyRetention;
    
    // Create main distribution record
    await db.insert(profitDistributions).values({
      id: distributionId,
      projectId: body.projectId || null,
      period: body.period || null,
      totalProfit: totalProfit,
      companyRetention: companyRetention,
      distributedAmount: distributedAmount,
      currency: body.currency || 'PKR',
      status: 'calculated',
      calculatedAt: now,
      notes: body.notes || null,
      createdByUserId: body.createdByUserId || null,
      createdAt: now,
      updatedAt: now,
    });
    
    // Get active founders and create distribution items
    const activeFounders = await db
      .select()
      .from(founders)
      .where(eq(founders.status, 'active'));
    
    for (const founder of activeFounders) {
      const grossAmount = Math.round((distributedAmount * founder.profitSharePercentage) / 100);
      
      await db.insert(founderDistributionItems).values({
        id: nanoid(),
        distributionId: distributionId,
        founderId: founder.id,
        sharePercentage: founder.profitSharePercentage,
        grossAmount: grossAmount,
        deductions: 0,
        netAmount: grossAmount,
        status: 'pending',
        createdAt: now,
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      id: distributionId,
      summary: {
        totalProfit,
        companyRetention,
        distributedAmount,
        foundersCount: activeFounders.length,
      }
    });
  } catch (error) {
    console.error('Failed to create distribution:', error);
    return NextResponse.json({ error: 'Failed to create distribution' }, { status: 500 });
  }
}
