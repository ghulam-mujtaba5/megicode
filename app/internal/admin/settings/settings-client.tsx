'use client';

import { useState, useTransition } from 'react';
import styles from '../../styles.module.css';

interface SystemSetting {
  id: string;
  key: string;
  value: string | null;
  category: string;
  label: string;
  description: string | null;
  type: string;
  options: string | null;
  isAdvanced: boolean | number;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string | null;
  enabled: boolean | number;
  trigger: string;
  triggerStepKeys: string | null;
  triggerLanes: string | null;
  conditions: string | null;
  action: string;
  actionConfig: string;
  priority: number | null;
  isSystem: boolean | number;
}

interface SettingsClientProps {
  settingsByCategory: Record<string, SystemSetting[]>;
  automationRules: AutomationRule[];
  updateSettingAction: (formData: FormData) => Promise<void>;
  toggleAutomationRuleAction: (formData: FormData) => Promise<void>;
  createAutomationRuleAction: (formData: FormData) => Promise<void>;
  deleteAutomationRuleAction: (formData: FormData) => Promise<void>;
}

const CATEGORY_INFO: Record<string, { icon: string; title: string; description: string }> = {
  automation: {
    icon: '🤖',
    title: 'Automation Settings',
    description: 'Control automated workflows, tasks, and notifications',
  },
  notifications: {
    icon: '🔔',
    title: 'Notification Settings',
    description: 'Configure how and when notifications are sent',
  },
  workflows: {
    icon: '📋',
    title: 'Workflow Settings',
    description: 'Customize workflow behavior and defaults',
  },
  integrations: {
    icon: '🔗',
    title: 'Integration Settings',
    description: 'Manage external service connections',
  },
  general: {
    icon: '⚙️',
    title: 'General Settings',
    description: 'System-wide configuration options',
  },
};

const TRIGGER_LABELS: Record<string, string> = {
  'step.entered': 'Step Entered',
  'step.completed': 'Step Completed',
  'step.assigned': 'Step Assigned',
  'step.sla_warning': 'SLA Warning',
  'step.sla_breached': 'SLA Breached',
  'process.started': 'Process Started',
  'process.completed': 'Process Completed',
  'gateway.decision': 'Gateway Decision',
  'data.updated': 'Data Updated',
};

const ACTION_LABELS: Record<string, string> = {
  send_email: 'Send Email',
  create_task: 'Create Task',
  update_data: 'Update Data',
  send_webhook: 'Send Webhook',
  assign_user: 'Assign User',
  send_notification: 'Send Notification',
  schedule_reminder: 'Schedule Reminder',
  execute_script: 'Execute Script',
};

export function SettingsClient({
  settingsByCategory,
  automationRules,
  updateSettingAction,
  toggleAutomationRuleAction,
  createAutomationRuleAction,
  deleteAutomationRuleAction,
}: SettingsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<string>('automation');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<Set<string>>(new Set());

  const handleSettingChange = (key: string, value: string) => {
    setPendingSettings((prev) => new Set(prev).add(key));
    const formData = new FormData();
    formData.set('key', key);
    formData.set('value', value);
    
    startTransition(async () => {
      await updateSettingAction(formData);
      setPendingSettings((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    });
  };

  const handleRuleToggle = (id: string, enabled: boolean) => {
    const formData = new FormData();
    formData.set('id', id);
    formData.set('enabled', String(enabled));
    
    startTransition(() => {
      toggleAutomationRuleAction(formData);
    });
  };

  const handleDeleteRule = (id: string) => {
    if (!confirm('Are you sure you want to delete this automation rule?')) return;
    
    const formData = new FormData();
    formData.set('id', id);
    
    startTransition(() => {
      deleteAutomationRuleAction(formData);
    });
  };

  const handleCreateRule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(() => {
      createAutomationRuleAction(formData);
      setShowCreateRule(false);
    });
  };

  const renderSettingControl = (setting: SystemSetting) => {
    const isLoading = pendingSettings.has(setting.key);
    const value = setting.value ?? '';

    if (setting.type === 'boolean') {
      const isOn = value === 'true';
      return (
        <button
          type="button"
          className={`${styles.toggle} ${isOn ? styles.toggleOn : ''}`}
          onClick={() => handleSettingChange(setting.key, String(!isOn))}
          disabled={isLoading || isPending}
          aria-pressed={isOn}
        >
          <span className={styles.toggleTrack}>
            <span className={styles.toggleThumb} />
          </span>
          <span className={styles.toggleLabel}>{isOn ? 'On' : 'Off'}</span>
        </button>
      );
    }

    if (setting.type === 'select' && setting.options) {
      const options = JSON.parse(setting.options) as string[];
      return (
        <select
          className={styles.select}
          value={value}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          disabled={isLoading || isPending}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    if (setting.type === 'number') {
      return (
        <input
          type="number"
          className={styles.input}
          value={value}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          disabled={isLoading || isPending}
        />
      );
    }

    return (
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
        disabled={isLoading || isPending}
      />
    );
  };

  const categories = Object.keys(settingsByCategory).sort((a, b) => {
    const order = ['automation', 'notifications', 'workflows', 'integrations', 'general'];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className={styles.settingsLayout}>
      {/* Tabs */}
      <div className={styles.tabBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.tabButton} ${activeTab === cat ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            <span>{CATEGORY_INFO[cat]?.icon || '📌'}</span>
            <span>{CATEGORY_INFO[cat]?.title || cat}</span>
          </button>
        ))}
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'rules' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <span>🔧</span>
          <span>Automation Rules</span>
        </button>
      </div>

      {/* Content */}
      <div className={styles.settingsContent}>
        {activeTab !== 'rules' ? (
          <>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <span>{CATEGORY_INFO[activeTab]?.icon || '📌'}</span>
                  {CATEGORY_INFO[activeTab]?.title || activeTab}
                </h2>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                  />
                  Show Advanced
                </label>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.textMuted} style={{ marginBottom: '1.5rem' }}>
                  {CATEGORY_INFO[activeTab]?.description}
                </p>
                
                <div className={styles.settingsList}>
                  {settingsByCategory[activeTab]
                    ?.filter((s) => showAdvanced || !s.isAdvanced)
                    .map((setting) => (
                      <div
                        key={setting.key}
                        className={`${styles.settingItem} ${setting.isAdvanced ? styles.settingItemAdvanced : ''}`}
                      >
                        <div className={styles.settingInfo}>
                          <div className={styles.settingLabel}>
                            {setting.label}
                            {setting.isAdvanced && (
                              <span className={`${styles.badge} ${styles.badgeWarning}`}>Advanced</span>
                            )}
                          </div>
                          <div className={styles.settingDescription}>{setting.description}</div>
                        </div>
                        <div className={styles.settingControl}>
                          {renderSettingControl(setting)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Automation Rules Tab */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <span>🔧</span>
                  Automation Rules
                </h2>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => setShowCreateRule(true)}
                >
                  + Add Rule
                </button>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.textMuted} style={{ marginBottom: '1.5rem' }}>
                  Configure automation rules that trigger actions based on workflow events
                </p>

                {/* Create Rule Modal */}
                {showCreateRule && (
                  <div className={styles.modal}>
                    <div className={styles.modalBackdrop} onClick={() => setShowCreateRule(false)} />
                    <div className={styles.modalContent}>
                      <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Create Automation Rule</h3>
                        <button
                          type="button"
                          className={styles.modalClose}
                          onClick={() => setShowCreateRule(false)}
                        >
                          ×
                        </button>
                      </div>
                      <form onSubmit={handleCreateRule}>
                        <div className={styles.modalBody}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Rule Name</label>
                            <input
                              type="text"
                              name="name"
                              className={styles.input}
                              placeholder="e.g., Notify PM on New Lead"
                              required
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                              name="description"
                              className={styles.textarea}
                              placeholder="What does this rule do?"
                              rows={2}
                            />
                          </div>
                          <div className={styles.grid2}>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>Trigger Event</label>
                              <select name="trigger" className={styles.select} required>
                                {Object.entries(TRIGGER_LABELS).map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>Action</label>
                              <select name="action" className={styles.select} required>
                                {Object.entries(ACTION_LABELS).map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Action Configuration (JSON)</label>
                            <textarea
                              name="actionConfig"
                              className={styles.textarea}
                              placeholder='{"to": "pm", "subject": "New notification"}'
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className={styles.modalFooter}>
                          <button
                            type="button"
                            className={styles.btnSecondary}
                            onClick={() => setShowCreateRule(false)}
                          >
                            Cancel
                          </button>
                          <button type="submit" className={styles.btnPrimary} disabled={isPending}>
                            Create Rule
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Rules List */}
                <div className={styles.rulesList}>
                  {automationRules.length === 0 ? (
                    <div className={styles.emptyState}>
                      <span style={{ fontSize: '2rem' }}>🔧</span>
                      <p>No automation rules configured yet</p>
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={() => setShowCreateRule(true)}
                      >
                        Create Your First Rule
                      </button>
                    </div>
                  ) : (
                    automationRules.map((rule) => (
                      <div key={rule.id} className={styles.ruleCard}>
                        <div className={styles.ruleHeader}>
                          <div className={styles.ruleInfo}>
                            <div className={styles.ruleName}>
                              {rule.name}
                              {rule.isSystem && (
                                <span className={`${styles.badge} ${styles.badgeInfo}`}>System</span>
                              )}
                            </div>
                            <div className={styles.ruleDescription}>{rule.description}</div>
                          </div>
                          <div className={styles.ruleActions}>
                            <button
                              type="button"
                              className={`${styles.toggle} ${rule.enabled ? styles.toggleOn : ''}`}
                              onClick={() => handleRuleToggle(rule.id, !rule.enabled)}
                              disabled={isPending}
                              aria-pressed={!!rule.enabled}
                            >
                              <span className={styles.toggleTrack}>
                                <span className={styles.toggleThumb} />
                              </span>
                              <span className={styles.toggleLabel}>
                                {rule.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </button>
                            {!rule.isSystem && (
                              <button
                                type="button"
                                className={styles.btnDanger}
                                onClick={() => handleDeleteRule(rule.id)}
                                disabled={isPending}
                                title="Delete rule"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                        <div className={styles.ruleMeta}>
                          <span className={`${styles.badge} ${styles.badgePrimary}`}>
                            {TRIGGER_LABELS[rule.trigger] || rule.trigger}
                          </span>
                          <span>→</span>
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            {ACTION_LABELS[rule.action] || rule.action}
                          </span>
                          {rule.priority && (
                            <span className={styles.textMuted}>Priority: {rule.priority}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.card} style={{ marginTop: '1.5rem' }}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <span>⚡</span>
                  Quick Actions
                </h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.quickActions}>
                  <button type="button" className={styles.btnSecondary}>
                    🔄 Sync Default Rules
                  </button>
                  <button type="button" className={styles.btnSecondary}>
                    📋 Export Rules
                  </button>
                  <button type="button" className={styles.btnSecondary}>
                    📥 Import Rules
                  </button>
                  <button type="button" className={`${styles.btnSecondary} ${styles.btnWarning}`}>
                    ⏸️ Pause All Automation
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
