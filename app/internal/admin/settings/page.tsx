
export const dynamic = 'force-dynamic';

import { getDb } from '@/lib/db';
import { systemSettings, automationRulesConfig, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import styles from '../../styles.module.css';
import { SettingsClient } from './settings-client';

// Default settings that should exist
const DEFAULT_SETTINGS = [
  // Automation Settings
  {
    key: 'automation.global_enabled',
    value: 'true',
    category: 'automation' as const,
    label: 'Enable All Automation',
    description: 'Master switch to enable/disable all automation rules globally',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  {
    key: 'automation.email_notifications',
    value: 'true',
    category: 'automation' as const,
    label: 'Email Notifications',
    description: 'Enable automated email notifications for workflow events',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  {
    key: 'automation.auto_task_creation',
    value: 'true',
    category: 'automation' as const,
    label: 'Automatic Task Creation',
    description: 'Automatically create tasks when workflow steps are triggered',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  {
    key: 'automation.sla_monitoring',
    value: 'true',
    category: 'automation' as const,
    label: 'SLA Monitoring',
    description: 'Monitor and alert on SLA breaches and warnings',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  {
    key: 'automation.webhook_notifications',
    value: 'false',
    category: 'automation' as const,
    label: 'Webhook Notifications',
    description: 'Enable outgoing webhooks for external integrations',
    type: 'boolean' as const,
    isAdvanced: true,
  },
  {
    key: 'automation.auto_assignment',
    value: 'true',
    category: 'automation' as const,
    label: 'Auto-Assignment',
    description: 'Automatically assign tasks to team members based on rules',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  {
    key: 'automation.reminder_system',
    value: 'true',
    category: 'automation' as const,
    label: 'Reminder System',
    description: 'Schedule and send automated reminders for pending actions',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  // Notification Settings
  {
    key: 'notifications.in_app',
    value: 'true',
    category: 'notifications' as const,
    label: 'In-App Notifications',
    description: 'Show notifications within the portal interface',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  {
    key: 'notifications.daily_digest',
    value: 'false',
    category: 'notifications' as const,
    label: 'Daily Digest Emails',
    description: 'Send daily summary emails instead of individual notifications',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  {
    key: 'notifications.slack_integration',
    value: 'false',
    category: 'notifications' as const,
    label: 'Slack Integration',
    description: 'Send notifications to Slack channels',
    type: 'boolean' as const,
    isAdvanced: true,
  },
  // Workflow Settings
  {
    key: 'workflows.require_approval',
    value: 'true',
    category: 'workflows' as const,
    label: 'Require Approval for Projects',
    description: 'Projects must be approved before moving to development',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  {
    key: 'workflows.auto_advance_steps',
    value: 'false',
    category: 'workflows' as const,
    label: 'Auto-Advance Steps',
    description: 'Automatically advance to next step when current is completed',
    type: 'boolean' as const,
    isAdvanced: false,
  },
  {
    key: 'workflows.default_priority',
    value: 'medium',
    category: 'workflows' as const,
    label: 'Default Task Priority',
    description: 'Default priority for new tasks',
    type: 'select' as const,
    options: JSON.stringify(['low', 'medium', 'high', 'critical']),
    isAdvanced: false,
  },
  // General Settings
  {
    key: 'general.maintenance_mode',
    value: 'false',
    category: 'general' as const,
    label: 'Maintenance Mode',
    description: 'Put the portal in maintenance mode (admin-only access)',
    type: 'boolean' as const,
    isAdvanced: true,
  },
  {
    key: 'general.debug_mode',
    value: 'false',
    category: 'general' as const,
    label: 'Debug Mode',
    description: 'Enable detailed logging for troubleshooting',
    type: 'boolean' as const,
    isAdvanced: true,
  },
];

// Ensure default settings exist
async function ensureDefaultSettings() {
  const db = getDb();
  const now = new Date();
  
  for (const setting of DEFAULT_SETTINGS) {
    const existing = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, setting.key))
      .get();
    
    if (!existing) {
      await db.insert(systemSettings).values({
        id: crypto.randomUUID(),
        ...setting,
        createdAt: now,
        updatedAt: now,
      });
    }
  }
}

// Server actions for settings
async function updateSetting(formData: FormData) {
  'use server';
  
  const db = getDb();
  const key = formData.get('key') as string;
  const value = formData.get('value') as string;
  const userId = formData.get('userId') as string | null;
  
  if (!key) return;
  
  await db
    .update(systemSettings)
    .set({
      value,
      updatedByUserId: userId || undefined,
      updatedAt: new Date(),
    })
    .where(eq(systemSettings.key, key));
  
  revalidatePath('/internal/admin/settings');
}

async function toggleAutomationRule(formData: FormData) {
  'use server';
  
  const db = getDb();
  const id = formData.get('id') as string;
  const enabled = formData.get('enabled') === 'true';
  const userId = formData.get('userId') as string | null;
  
  if (!id) return;
  
  await db
    .update(automationRulesConfig)
    .set({
      enabled,
      updatedByUserId: userId || undefined,
      updatedAt: new Date(),
    })
    .where(eq(automationRulesConfig.id, id));
  
  revalidatePath('/internal/admin/settings');
}

async function createAutomationRule(formData: FormData) {
  'use server';
  
  const db = getDb();
  const now = new Date();
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const trigger = formData.get('trigger') as string;
  const action = formData.get('action') as string;
  const actionConfig = formData.get('actionConfig') as string;
  const userId = formData.get('userId') as string | null;
  
  if (!name || !trigger || !action) return;
  
  await db.insert(automationRulesConfig).values({
    id: crypto.randomUUID(),
    name,
    description,
    enabled: true,
    trigger,
    action,
    actionConfig: actionConfig || '{}',
    priority: 10,
    isSystem: false,
    createdByUserId: userId || undefined,
    updatedByUserId: userId || undefined,
    createdAt: now,
    updatedAt: now,
  });
  
  revalidatePath('/internal/admin/settings');
}

async function deleteAutomationRule(formData: FormData) {
  'use server';
  
  const db = getDb();
  const id = formData.get('id') as string;
  
  if (!id) return;
  
  // Don't allow deleting system rules
  const rule = await db.select().from(automationRulesConfig).where(eq(automationRulesConfig.id, id)).get();
  if (rule?.isSystem) return;
  
  await db.delete(automationRulesConfig).where(eq(automationRulesConfig.id, id));
  
  revalidatePath('/internal/admin/settings');
}

export default async function AdminSettingsPage() {
  const db = getDb();
  
  // Ensure defaults exist
  await ensureDefaultSettings();
  
  // Fetch all settings
  const allSettings = await db
    .select()
    .from(systemSettings)
    .orderBy(systemSettings.category, systemSettings.key)
    .all();
  
  // Fetch automation rules
  const automationRules = await db
    .select()
    .from(automationRulesConfig)
    .orderBy(automationRulesConfig.priority, automationRulesConfig.name)
    .all();
  
  // Group settings by category
  const settingsByCategory = allSettings.reduce((acc, setting) => {
    const cat = setting.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(setting);
    return acc;
  }, {} as Record<string, typeof allSettings>);
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>
              <span style={{ fontSize: '1.5rem' }}>⚙️</span>
              System Settings
            </h1>
            <p className={styles.pageSubtitle}>
              Manage automation, notifications, workflows, and global configuration
            </p>
          </div>
        </div>
        
        <SettingsClient
          settingsByCategory={settingsByCategory}
          automationRules={automationRules}
          updateSettingAction={updateSetting}
          toggleAutomationRuleAction={toggleAutomationRule}
          createAutomationRuleAction={createAutomationRule}
          deleteAutomationRuleAction={deleteAutomationRule}
        />
      </div>
    </div>
  );
}
