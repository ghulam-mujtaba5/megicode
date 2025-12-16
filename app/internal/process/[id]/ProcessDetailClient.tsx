/**
 * Process Detail Client Component
 * 
 * Handles interactive process timeline and step execution
 */
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import s from '../../styles.module.css';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { StepCard } from '@/components/StepCard';
import type { BusinessProcessStep, Lane, StepType, ProcessLane } from '@/lib/workflow/businessProcess';

interface ProcessDefinition {
  key: string;
  name: string;
  steps: Array<{
    key: string;
    title: string;
    type: StepType;
    lane: string;
    isManual?: boolean;
    automationAction?: string;
    participant?: string;
    description?: string;
    nextStepKeys?: string[];
  }>;
  lanes: Lane[];
}

interface StepHistoryItem {
  stepKey: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  outputData: Record<string, unknown> | null;
}

interface ProcessDetailClientProps {
  instanceId: string;
  instanceStatus: string;
  currentStepKey?: string;
  definition: ProcessDefinition;
  completedSteps: string[];
  stepHistory: StepHistoryItem[];
  userRole: string;
}

export default function ProcessDetailClient({
  instanceId,
  instanceStatus,
  currentStepKey,
  definition,
  completedSteps,
  stepHistory,
  userRole,
}: ProcessDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedStepKey, setSelectedStepKey] = useState<string | null>(null);

  // Get current step details
  const currentStep = definition.steps.find(step => step.key === currentStepKey);
  
  // Get selected step for viewing
  const selectedStep = selectedStepKey 
    ? definition.steps.find(step => step.key === selectedStepKey)
    : currentStep;

  // Check if user can execute current step
  const canExecuteStep = () => {
    if (instanceStatus !== 'running' || !currentStep) return false;
    
    // Admins can always execute
    if (userRole === 'admin') return true;
    
    // Automation steps can be triggered by PM or admin
    if (currentStep.lane === 'AutomationCRM') {
      return ['admin', 'pm'].includes(userRole);
    }
    
    // Check role matches participant
    if (currentStep.participant) {
      const participantRole = currentStep.participant.toLowerCase();
      return participantRole === userRole || 
             (participantRole === 'pm' && userRole === 'pm') ||
             (participantRole === 'admin' && userRole === 'admin');
    }
    
    return ['admin', 'pm'].includes(userRole);
  };

  // Get available next steps for gateway decisions
  const getAvailableNextSteps = () => {
    if (!currentStep || currentStep.type !== 'gateway') return [];
    
    return (currentStep.nextStepKeys || []).map(key => {
      const step = definition.steps.find(s => s.key === key);
      return {
        key,
        title: step?.title || key,
      };
    });
  };

  // Execute step
  const handleCompleteStep = async (
    outputData?: Record<string, unknown>,
    gatewayDecision?: string
  ) => {
    setError(null);
    
    try {
      const response = await fetch(`/api/internal/process/${instanceId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepKey: currentStepKey,
          outputData,
          gatewayDecision,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to complete step');
      }

      // Refresh page data
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Get step status
  const getStepStatus = (stepKey: string): 'completed' | 'current' | 'pending' => {
    if (completedSteps.includes(stepKey)) return 'completed';
    if (stepKey === currentStepKey) return 'current';
    return 'pending';
  };

  // Get step history item
  const getStepHistoryItem = (stepKey: string) => {
    return stepHistory.find(h => h.stepKey === stepKey);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-6)' }}>
      {/* Error Display */}
      {error && (
        <div className={s.alertDanger}>
          {error}
          <button 
            onClick={() => setError(null)} 
            className={s.alertClose}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Process Timeline */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Process Timeline</h3>
        </div>
        <div className={s.cardBody} style={{ padding: 0 }}>
          <ProcessTimeline
            steps={definition.steps as BusinessProcessStep[]}
            lanes={definition.lanes}
            currentStepKey={currentStepKey}
            completedSteps={completedSteps}
            onStepClick={(key) => setSelectedStepKey(key)}
          />
        </div>
      </div>

      {/* Selected/Current Step Detail */}
      {selectedStep && (
        <StepCard
          step={selectedStep as BusinessProcessStep}
          status={getStepStatus(selectedStep.key)}
          canExecute={selectedStep.key === currentStepKey && canExecuteStep()}
          isLoading={isPending}
          availableNextSteps={
            selectedStep.key === currentStepKey ? getAvailableNextSteps() : []
          }
          onComplete={handleCompleteStep}
          outputData={getStepHistoryItem(selectedStep.key)?.outputData || undefined}
        />
      )}

      {/* Step History List */}
      {stepHistory.length > 0 && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Completed Steps</h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-3)' }}>
              {stepHistory
                .filter(h => h.status === 'completed')
                .map(history => {
                  const step = definition.steps.find(s => s.key === history.stepKey);
                  if (!step) return null;

                  return (
                    <div 
                      key={`${history.stepKey}-${history.completedAt}`}
                      className={s.historyItem}
                      onClick={() => setSelectedStepKey(history.stepKey)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={s.historyCheck}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <div className={s.historyContent}>
                        <div className={s.historyTitle}>{step.title}</div>
                        <div className={s.historyMeta}>
                          <span className={`${s.badge} ${s[`badge${step.lane}`]}`} style={{ fontSize: '0.625rem', padding: '0.125rem 0.375rem' }}>
                            {step.lane}
                          </span>
                          {history.completedAt && (
                            <span style={{ color: 'var(--int-text-muted)', fontSize: '0.75rem' }}>
                              {new Date(history.completedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
