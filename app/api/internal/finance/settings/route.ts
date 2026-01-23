import { NextResponse } from 'next/server';
import { eq, isNull } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { financialSettings } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';
import { nanoid } from 'nanoid';

// GET - Fetch active financial settings
export async function GET() {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    
    // Get all active settings (where effectiveTo is null)
    const settings = await db
      .select()
      .from(financialSettings)
      .where(isNull(financialSettings.effectiveTo));
    
    // Convert to key-value object
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.settingKey] = s.settingValue;
    }
    
    // Return with defaults if not set
    return NextResponse.json({
      settings: {
        companyRetentionPercentage: parseInt(settingsMap['company_retention_percentage'] || '10'),
        defaultCurrency: settingsMap['default_currency'] || 'PKR',
      }
    });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST - Create or update financial settings
export async function POST(request: Request) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const body = await request.json();
    
    const now = new Date();
    
    // Update existing settings to have an effectiveTo date
    if (body.companyRetentionPercentage !== undefined) {
      // Expire old setting
      await db
        .update(financialSettings)
        .set({ effectiveTo: now })
        .where(eq(financialSettings.settingKey, 'company_retention_percentage'));
      
      // Create new setting
      await db.insert(financialSettings).values({
        id: nanoid(),
        settingKey: 'company_retention_percentage',
        settingValue: body.companyRetentionPercentage.toString(),
        description: 'Percentage of profit retained by company',
        effectiveFrom: now,
        createdByUserId: body.createdByUserId || null,
        createdAt: now,
      });
    }
    
    if (body.defaultCurrency) {
      await db
        .update(financialSettings)
        .set({ effectiveTo: now })
        .where(eq(financialSettings.settingKey, 'default_currency'));
      
      await db.insert(financialSettings).values({
        id: nanoid(),
        settingKey: 'default_currency',
        settingValue: body.defaultCurrency,
        description: 'Default currency for financial transactions',
        effectiveFrom: now,
        createdByUserId: body.createdByUserId || null,
        createdAt: now,
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
