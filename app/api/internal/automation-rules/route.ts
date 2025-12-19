import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { automationRulesConfig } from '@/lib/db/schema';

export async function GET() {
  const db = getDb();
  
  const rules = await db
    .select()
    .from(automationRulesConfig)
    .orderBy(automationRulesConfig.priority, automationRulesConfig.name)
    .all();
  
  return NextResponse.json({
    success: true,
    rules: rules.map(rule => ({
      ...rule,
      enabled: !!rule.enabled,
      isSystem: !!rule.isSystem,
      triggerStepKeys: rule.triggerStepKeys ? JSON.parse(rule.triggerStepKeys) : null,
      triggerLanes: rule.triggerLanes ? JSON.parse(rule.triggerLanes) : null,
      conditions: rule.conditions ? JSON.parse(rule.conditions) : null,
      actionConfig: JSON.parse(rule.actionConfig),
    })),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, trigger, action, actionConfig, triggerStepKeys, triggerLanes, conditions, userId } = body;
    
    if (!name || !trigger || !action) {
      return NextResponse.json(
        { success: false, error: 'Name, trigger, and action are required' },
        { status: 400 }
      );
    }
    
    const db = getDb();
    const now = new Date();
    const id = crypto.randomUUID();
    
    await db.insert(automationRulesConfig).values({
      id,
      name,
      description: description || null,
      enabled: true,
      trigger,
      triggerStepKeys: triggerStepKeys ? JSON.stringify(triggerStepKeys) : null,
      triggerLanes: triggerLanes ? JSON.stringify(triggerLanes) : null,
      conditions: conditions ? JSON.stringify(conditions) : null,
      action,
      actionConfig: JSON.stringify(actionConfig || {}),
      priority: 10,
      isSystem: false,
      createdByUserId: userId || null,
      updatedByUserId: userId || null,
      createdAt: now,
      updatedAt: now,
    });
    
    return NextResponse.json({
      success: true,
      rule: { id, name, trigger, action },
    });
  } catch (error) {
    console.error('Error creating automation rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create rule' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, enabled, name, description, trigger, action, actionConfig, priority, userId } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rule ID is required' },
        { status: 400 }
      );
    }
    
    const db = getDb();
    const now = new Date();
    
    const existing = await db
      .select()
      .from(automationRulesConfig)
      .where(eq(automationRulesConfig.id, id))
      .get();
    
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }
    
    const updates: Record<string, any> = {
      updatedByUserId: userId || null,
      updatedAt: now,
    };
    
    if (typeof enabled === 'boolean') updates.enabled = enabled;
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (trigger !== undefined) updates.trigger = trigger;
    if (action !== undefined) updates.action = action;
    if (actionConfig !== undefined) updates.actionConfig = JSON.stringify(actionConfig);
    if (priority !== undefined) updates.priority = priority;
    
    await db
      .update(automationRulesConfig)
      .set(updates)
      .where(eq(automationRulesConfig.id, id));
    
    return NextResponse.json({
      success: true,
      rule: { id, ...updates },
    });
  } catch (error) {
    console.error('Error updating automation rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update rule' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rule ID is required' },
        { status: 400 }
      );
    }
    
    const db = getDb();
    
    // Check if it's a system rule
    const rule = await db
      .select()
      .from(automationRulesConfig)
      .where(eq(automationRulesConfig.id, id))
      .get();
    
    if (!rule) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }
    
    if (rule.isSystem) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete system rules' },
        { status: 403 }
      );
    }
    
    await db.delete(automationRulesConfig).where(eq(automationRulesConfig.id, id));
    
    return NextResponse.json({
      success: true,
      deleted: id,
    });
  } catch (error) {
    console.error('Error deleting automation rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete rule' },
      { status: 500 }
    );
  }
}
