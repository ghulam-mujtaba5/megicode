import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { systemSettings } from '@/lib/db/schema';
import { invalidateSettingsCache } from '@/lib/settings';

export async function GET() {
  const db = getDb();
  
  const allSettings = await db
    .select()
    .from(systemSettings)
    .orderBy(systemSettings.category, systemSettings.key)
    .all();
  
  // Group by category
  const grouped = allSettings.reduce((acc, setting) => {
    const cat = setting.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(setting);
    return acc;
  }, {} as Record<string, typeof allSettings>);
  
  return NextResponse.json({
    success: true,
    settings: grouped,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, userId } = body;
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Setting key is required' },
        { status: 400 }
      );
    }
    
    const db = getDb();
    const now = new Date();
    
    // Check if setting exists
    const existing = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, key))
      .get();
    
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Setting not found' },
        { status: 404 }
      );
    }
    
    // Update the setting
    await db
      .update(systemSettings)
      .set({
        value: String(value),
        updatedByUserId: userId || null,
        updatedAt: now,
      })
      .where(eq(systemSettings.key, key));
    
    // Invalidate cache
    invalidateSettingsCache();
    
    return NextResponse.json({
      success: true,
      setting: { key, value },
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, settings } = body;
    
    if (action === 'bulk_update' && Array.isArray(settings)) {
      const db = getDb();
      const now = new Date();
      
      for (const { key, value, userId } of settings) {
        await db
          .update(systemSettings)
          .set({
            value: String(value),
            updatedByUserId: userId || null,
            updatedAt: now,
          })
          .where(eq(systemSettings.key, key));
      }
      
      invalidateSettingsCache();
      
      return NextResponse.json({
        success: true,
        updated: settings.length,
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in settings POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
