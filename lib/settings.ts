/**
 * System Settings Service
 * 
 * Centralized service for accessing and managing system settings.
 * Provides type-safe access to configuration values.
 */

import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { systemSettings, automationRulesConfig } from '@/lib/db/schema';

// Setting keys for type-safe access
export const SETTING_KEYS = {
  // Automation
  AUTOMATION_GLOBAL_ENABLED: 'automation.global_enabled',
  AUTOMATION_EMAIL_NOTIFICATIONS: 'automation.email_notifications',
  AUTOMATION_AUTO_TASK_CREATION: 'automation.auto_task_creation',
  AUTOMATION_SLA_MONITORING: 'automation.sla_monitoring',
  AUTOMATION_WEBHOOK_NOTIFICATIONS: 'automation.webhook_notifications',
  AUTOMATION_AUTO_ASSIGNMENT: 'automation.auto_assignment',
  AUTOMATION_REMINDER_SYSTEM: 'automation.reminder_system',
  
  // Notifications
  NOTIFICATIONS_IN_APP: 'notifications.in_app',
  NOTIFICATIONS_DAILY_DIGEST: 'notifications.daily_digest',
  NOTIFICATIONS_SLACK: 'notifications.slack_integration',
  
  // Workflows
  WORKFLOWS_REQUIRE_APPROVAL: 'workflows.require_approval',
  WORKFLOWS_AUTO_ADVANCE: 'workflows.auto_advance_steps',
  WORKFLOWS_DEFAULT_PRIORITY: 'workflows.default_priority',
  
  // General
  GENERAL_MAINTENANCE_MODE: 'general.maintenance_mode',
  GENERAL_DEBUG_MODE: 'general.debug_mode',
} as const;

export type SettingKey = typeof SETTING_KEYS[keyof typeof SETTING_KEYS];

// Cache for settings to avoid repeated DB calls
let settingsCache: Map<string, string> | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Get a single setting value
 */
export async function getSetting(key: SettingKey): Promise<string | null> {
  const db = getDb();
  const settingRows = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, key))
    .limit(1);
  const setting = settingRows[0];
  
  return setting?.value ?? null;
}

/**
 * Get a boolean setting value
 */
export async function getBooleanSetting(key: SettingKey, defaultValue = false): Promise<boolean> {
  const value = await getSetting(key);
  if (value === null) return defaultValue;
  return value === 'true';
}

/**
 * Get a number setting value
 */
export async function getNumberSetting(key: SettingKey, defaultValue = 0): Promise<number> {
  const value = await getSetting(key);
  if (value === null) return defaultValue;
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Get all settings as a map (with caching)
 */
export async function getAllSettings(): Promise<Map<string, string>> {
  const now = Date.now();
  
  // Return cached if still valid
  if (settingsCache && now - cacheTimestamp < CACHE_TTL) {
    return settingsCache;
  }
  
  const db = getDb();
  const allSettings = await db.select().from(systemSettings).all();
  
  settingsCache = new Map();
  for (const setting of allSettings) {
    if (setting.value !== null) {
      settingsCache.set(setting.key, setting.value);
    }
  }
  cacheTimestamp = now;
  
  return settingsCache;
}

/**
 * Invalidate settings cache (call after updating settings)
 */
export function invalidateSettingsCache(): void {
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Update a setting value
 */
export async function updateSetting(
  key: SettingKey,
  value: string,
  userId?: string
): Promise<void> {
  const db = getDb();
  const now = new Date();
  
  await db
    .update(systemSettings)
    .set({
      value,
      updatedByUserId: userId,
      updatedAt: now,
    })
    .where(eq(systemSettings.key, key));
  
  invalidateSettingsCache();
}

/**
 * Check if automation is enabled globally and for a specific type
 */
export async function isAutomationEnabled(
  type?: 'email' | 'tasks' | 'sla' | 'webhooks' | 'assignment' | 'reminders'
): Promise<boolean> {
  const settings = await getAllSettings();
  
  // Check global switch first
  const globalEnabled = settings.get(SETTING_KEYS.AUTOMATION_GLOBAL_ENABLED) === 'true';
  if (!globalEnabled) return false;
  
  // If no specific type, just return global status
  if (!type) return globalEnabled;
  
  // Check specific type
  const typeKeyMap: Record<string, SettingKey> = {
    email: SETTING_KEYS.AUTOMATION_EMAIL_NOTIFICATIONS,
    tasks: SETTING_KEYS.AUTOMATION_AUTO_TASK_CREATION,
    sla: SETTING_KEYS.AUTOMATION_SLA_MONITORING,
    webhooks: SETTING_KEYS.AUTOMATION_WEBHOOK_NOTIFICATIONS,
    assignment: SETTING_KEYS.AUTOMATION_AUTO_ASSIGNMENT,
    reminders: SETTING_KEYS.AUTOMATION_REMINDER_SYSTEM,
  };
  
  const typeKey = typeKeyMap[type];
  if (!typeKey) return true;
  
  return settings.get(typeKey) === 'true';
}

/**
 * Get enabled automation rules from database
 */
export async function getEnabledAutomationRules() {
  const db = getDb();
  
  // Check if global automation is enabled
  const globalEnabled = await getBooleanSetting(SETTING_KEYS.AUTOMATION_GLOBAL_ENABLED, true);
  if (!globalEnabled) {
    return [];
  }
  
  const rules = await db
    .select()
    .from(automationRulesConfig)
    .where(eq(automationRulesConfig.enabled, true))
    .all();
  
  return rules.map(rule => ({
    id: rule.id,
    name: rule.name,
    description: rule.description,
    enabled: !!rule.enabled,
    trigger: rule.trigger,
    triggerStepKeys: rule.triggerStepKeys ? JSON.parse(rule.triggerStepKeys) : undefined,
    triggerLanes: rule.triggerLanes ? JSON.parse(rule.triggerLanes) : undefined,
    conditions: rule.conditions ? JSON.parse(rule.conditions) : undefined,
    action: rule.action,
    actionConfig: JSON.parse(rule.actionConfig),
    priority: rule.priority ?? 10,
    isSystem: !!rule.isSystem,
  }));
}

/**
 * Check if system is in maintenance mode
 */
export async function isMaintenanceMode(): Promise<boolean> {
  return getBooleanSetting(SETTING_KEYS.GENERAL_MAINTENANCE_MODE, false);
}

/**
 * Check if debug mode is enabled
 */
export async function isDebugMode(): Promise<boolean> {
  return getBooleanSetting(SETTING_KEYS.GENERAL_DEBUG_MODE, false);
}
