/**
 * Workflow Step Actions Client Component
 * 
 * Interactive component for executing workflow steps with:
 * - Step-specific action buttons
 * - Gateway decision handling
 * - Data input forms for manual steps
 * - Progress indicators
 */
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './WorkflowActions.module.css';

interface Step {
  key: string;
  title: string;
  type: string;
  lane: string;
  isManual?: boolean;
  automationAction?: string;
  participant?: string;
  description?: string;
  estimatedMinutes?: number;
  gatewayConditions?: Array<{
    label: string;
    targetStepKey: string;
    isDefault?: boolean;
  }>;
}

interface WorkflowStepActionsProps {
  instanceId: string;
  currentStep: Step | null;
  instanceStatus: string;
  userRole: string;
  leadId?: string;
  projectId?: string;
  onStepCompleted?: (nextStep?: Step) => void;
}

// Icons
const Icons = {
  play: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  skip: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>,
  cancel: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  loader: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.spinner}><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

// Step-specific form configurations
const STEP_FORMS: Record<string, Array<{ field: string; label: string; type: string; required?: boolean }>> = {
  schedule_discovery_call: [
    { field: 'discoveryCallScheduledAt', label: 'Call Date & Time', type: 'datetime-local', required: true },
    { field: 'notes', label: 'Notes', type: 'textarea' },
  ],
  gather_client_requirements: [
    { field: 'requirements', label: 'Key Requirements', type: 'textarea', required: true },
    { field: 'srsUrl', label: 'SRS Document URL', type: 'url' },
    { field: 'notes', label: 'Call Notes', type: 'textarea' },
  ],
  prepare_proposal_draft: [
    { field: 'proposalTitle', label: 'Proposal Title', type: 'text', required: true },
    { field: 'proposalAmount', label: 'Total Amount ($)', type: 'number', required: true },
    { field: 'notes', label: 'Proposal Notes', type: 'textarea' },
  ],
  sign_contract_client: [
    { field: 'contractSignedAt', label: 'Signature Date', type: 'date', required: true },
    { field: 'contractUrl', label: 'Signed Contract URL', type: 'url' },
  ],
  assign_project_team: [
    { field: 'teamMemberIds', label: 'Team Members (comma-separated IDs)', type: 'text', required: true },
    { field: 'notes', label: 'Assignment Notes', type: 'textarea' },
  ],
  schedule_kickoff_meeting: [
    { field: 'kickoffMeetingScheduledAt', label: 'Meeting Date & Time', type: 'datetime-local', required: true },
    { field: 'notes', label: 'Meeting Agenda', type: 'textarea' },
  ],
};

export default function WorkflowStepActions({
  instanceId,
  currentStep,
  instanceStatus,
  userRole,
  leadId,
  projectId,
  onStepCompleted,
}: WorkflowStepActionsProps) {
  const router = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const formConfig = currentStep ? STEP_FORMS[currentStep.key] : null;

  const executeAction = useCallback(async (action: string, data?: Record<string, any>) => {
    setIsExecuting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/internal/process/${instanceId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepKey: currentStep?.key,
          action,
          data: { ...formData, ...data },
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to execute action');
      }

      const result = await response.json();

      setSuccess(`Step completed successfully!`);
      setFormData({});
      setShowConfirm(null);

      // Notify parent and refresh
      if (onStepCompleted) {
        onStepCompleted(result.currentStep);
      }
      
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsExecuting(false);
    }
  }, [instanceId, currentStep, formData, onStepCompleted, router]);

  const handleGatewayDecision = useCallback((decision: string) => {
    executeAction('gateway_decision', { decision });
  }, [executeAction]);

  const triggerAutomation = useCallback(async (automationAction: string) => {
    setIsExecuting(true);
    setError(null);

    try {
      const response = await fetch('/api/internal/onboarding/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: automationAction,
          leadId,
          projectId,
          processInstanceId: instanceId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Automation failed');
      }

      setSuccess('Automation triggered successfully!');
      
      // Complete the step after automation
      await executeAction('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Automation failed');
    } finally {
      setIsExecuting(false);
    }
  }, [leadId, projectId, instanceId, executeAction]);

  if (instanceStatus !== 'running') {
    return (
      <div className={styles.container}>
        <div className={styles.statusCard}>
          <span className={styles.icon}>{instanceStatus === 'completed' ? Icons.check : Icons.cancel}</span>
          <span>Process {instanceStatus}</span>
        </div>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className={styles.container}>
        <div className={styles.statusCard}>
          <span className={styles.icon}>{Icons.alert}</span>
          <span>No current step available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Current Step Info */}
      <div className={styles.stepInfo}>
        <div className={styles.stepHeader}>
          <span className={`${styles.laneBadge} ${styles[`lane${currentStep.lane}`]}`}>
            {currentStep.lane.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <h3 className={styles.stepTitle}>{currentStep.title}</h3>
        </div>
        {currentStep.description && (
          <p className={styles.stepDescription}>{currentStep.description}</p>
        )}
        <div className={styles.stepMeta}>
          {currentStep.participant && (
            <span className={styles.metaItem}>
              <span className={styles.icon}>{Icons.user}</span>
              {currentStep.participant.replace(/_/g, ' ')}
            </span>
          )}
          {currentStep.estimatedMinutes && (
            <span className={styles.metaItem}>
              <span className={styles.icon}>{Icons.clock}</span>
              ~{currentStep.estimatedMinutes} min
            </span>
          )}
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.icon}>{Icons.alert}</span>
          {error}
        </div>
      )}
      {success && (
        <div className={styles.successMessage}>
          <span className={styles.icon}>{Icons.check}</span>
          {success}
        </div>
      )}

      {/* Gateway Decision Buttons */}
      {currentStep.type === 'gateway' && currentStep.gatewayConditions && (
        <div className={styles.gatewayActions}>
          <p className={styles.gatewayPrompt}>Select an outcome:</p>
          <div className={styles.gatewayButtons}>
            {currentStep.gatewayConditions.map((condition) => (
              <button
                key={condition.targetStepKey}
                className={`${styles.gatewayBtn} ${condition.isDefault ? styles.gatewayBtnDefault : styles.gatewayBtnPrimary}`}
                onClick={() => handleGatewayDecision(condition.targetStepKey)}
                disabled={isExecuting}
              >
                {condition.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Step Form */}
      {currentStep.isManual && currentStep.type !== 'gateway' && (
        <div className={styles.stepForm}>
          {formConfig && (
            <div className={styles.formFields}>
              {formConfig.map((field) => (
                <div key={field.field} className={styles.formField}>
                  <label htmlFor={`field-${field.field}`} className={styles.fieldLabel}>
                    {field.label}
                    {field.required && <span className={styles.required}>*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={`field-${field.field}`}
                      className={styles.textarea}
                      value={formData[field.field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.field]: e.target.value })}
                      rows={3}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      id={`field-${field.field}`}
                      type={field.type}
                      className={styles.input}
                      value={formData[field.field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.field]: e.target.value })}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={styles.actionButtons}>
            <button
              className={styles.btnPrimary}
              onClick={() => executeAction('complete')}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <span className={styles.spinner}></span>
                  Processing...
                </>
              ) : (
                <>
                  <span className={styles.icon}>{Icons.check}</span>
                  Complete Step
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Automation Step */}
      {!currentStep.isManual && currentStep.automationAction && (
        <div className={styles.automationInfo}>
          <div className={styles.automationBadge}>
            <span className={styles.icon}>{Icons.play}</span>
            Automated Step
          </div>
          <p className={styles.automationDesc}>
            This step will execute automatically: <code>{currentStep.automationAction}</code>
          </p>
          <button
            className={styles.btnPrimary}
            onClick={() => triggerAutomation(currentStep.automationAction!)}
            disabled={isExecuting}
          >
            {isExecuting ? 'Executing...' : 'Trigger Automation'}
          </button>
        </div>
      )}

      {/* Admin Actions */}
      {userRole === 'admin' && (
        <div className={styles.adminActions}>
          <div className={styles.divider} />
          <p className={styles.adminLabel}>Admin Actions</p>
          <div className={styles.adminButtons}>
            <button
              className={styles.btnSecondary}
              onClick={() => setShowConfirm('skip')}
              disabled={isExecuting}
            >
              <span className={styles.icon}>{Icons.skip}</span>
              Skip Step
            </button>
            <button
              className={styles.btnDanger}
              onClick={() => setShowConfirm('cancel')}
              disabled={isExecuting}
            >
              <span className={styles.icon}>{Icons.cancel}</span>
              Cancel Process
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirm(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h4 className={styles.modalTitle}>
              {showConfirm === 'skip' ? 'Skip Step?' : 'Cancel Process?'}
            </h4>
            <p className={styles.modalDesc}>
              {showConfirm === 'skip'
                ? 'This will skip the current step and move to the next one. This action cannot be undone.'
                : 'This will permanently cancel this process instance. This action cannot be undone.'
              }
            </p>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Reason (optional)</label>
              <textarea
                className={styles.textarea}
                value={formData.confirmNotes || ''}
                onChange={(e) => setFormData({ ...formData, confirmNotes: e.target.value })}
                placeholder="Enter reason for this action..."
                rows={2}
              />
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.btnSecondary}
                onClick={() => setShowConfirm(null)}
              >
                Cancel
              </button>
              <button
                className={showConfirm === 'cancel' ? styles.btnDanger : styles.btnPrimary}
                onClick={() => executeAction(showConfirm, { notes: formData.confirmNotes })}
                disabled={isExecuting}
              >
                {isExecuting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
