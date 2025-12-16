/**
 * ProcessTimeline Component
 * 
 * Displays a BPMN-style swimlane visualization of the business process
 * with steps organized by lane/participant
 */
'use client';

import { useMemo } from 'react';
import s from './ProcessTimeline.module.css';
import type { BusinessProcessStep, Lane, StepType } from '@/lib/workflow/businessProcess';

// Icons for different step types
const StepIcons = {
  start_event: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  end_event: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  ),
  task: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
  ),
  gateway: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L22 12L12 22L2 12Z" />
    </svg>
  ),
  automation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
    </svg>
  ),
  message: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  completed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  current: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="6" />
    </svg>
  ),
};

interface ProcessTimelineProps {
  steps: BusinessProcessStep[];
  lanes: Lane[];
  currentStepKey?: string;
  completedSteps?: string[];
  onStepClick?: (stepKey: string) => void;
}

export function ProcessTimeline({
  steps,
  lanes,
  currentStepKey,
  completedSteps = [],
  onStepClick,
}: ProcessTimelineProps) {
  // Group steps by lane
  const stepsByLane = useMemo(() => {
    const grouped: Record<string, BusinessProcessStep[]> = {};
    lanes.forEach(lane => {
      grouped[lane.key] = steps.filter(step => step.lane === lane.key);
    });
    return grouped;
  }, [steps, lanes]);

  // Determine step status
  const getStepStatus = (stepKey: string): 'completed' | 'current' | 'pending' => {
    if (completedSteps.includes(stepKey)) return 'completed';
    if (stepKey === currentStepKey) return 'current';
    return 'pending';
  };

  // Get icon based on step type and status
  const getStepIcon = (step: BusinessProcessStep, status: string) => {
    if (status === 'completed') return StepIcons.completed;
    if (status === 'current') return StepIcons.current;
    
    switch (step.type) {
      case 'start_event':
        return StepIcons.start_event;
      case 'end_event':
        return StepIcons.end_event;
      case 'gateway':
        return StepIcons.gateway;
      default:
        if (step.automationAction) return StepIcons.automation;
        if (step.isManual) return StepIcons.task;
        return StepIcons.message;
    }
  };

  return (
    <div className={s.timeline}>
      <div className={s.laneContainer}>
        {lanes.map(lane => (
          <div key={lane.key} className={s.lane}>
            <div className={s.laneHeader}>
              <span className={s.laneName}>{lane.displayName}</span>
              <span className={s.laneRole}>{lane.participant}</span>
            </div>
            <div className={s.laneBody}>
              <div className={s.stepsRow}>
                {stepsByLane[lane.key]?.map((step, index) => {
                  const status = getStepStatus(step.key);
                  return (
                    <div key={step.key} className={s.stepWrapper}>
                      {index > 0 && <div className={`${s.connector} ${s[status]}`} />}
                      <button
                        type="button"
                        className={`${s.step} ${s[step.type]} ${s[status]}`}
                        onClick={() => onStepClick?.(step.key)}
                        disabled={status === 'pending'}
                        title={step.title}
                      >
                        <div className={s.stepIcon}>
                          {getStepIcon(step, status)}
                        </div>
                        <span className={s.stepLabel}>{step.title}</span>
                        {step.automationAction && (
                          <span className={s.automationBadge}>Auto</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact version for cards/summaries
interface ProcessTimelineCompactProps {
  steps: BusinessProcessStep[];
  currentStepKey?: string;
  completedSteps?: string[];
  maxVisible?: number;
}

export function ProcessTimelineCompact({
  steps,
  currentStepKey,
  completedSteps = [],
  maxVisible = 5,
}: ProcessTimelineCompactProps) {
  // Filter to main path steps (non-gateways, non-events)
  const mainSteps = steps.filter(
    s => s.type !== 'gateway' && s.type !== 'start_event' && s.type !== 'end_event'
  );

  // Find current step index
  const currentIndex = mainSteps.findIndex(s => s.key === currentStepKey);
  
  // Show steps around current
  const startIdx = Math.max(0, currentIndex - Math.floor(maxVisible / 2));
  const endIdx = Math.min(mainSteps.length, startIdx + maxVisible);
  const visibleSteps = mainSteps.slice(startIdx, endIdx);

  const getStepStatus = (stepKey: string): 'completed' | 'current' | 'pending' => {
    if (completedSteps.includes(stepKey)) return 'completed';
    if (stepKey === currentStepKey) return 'current';
    return 'pending';
  };

  return (
    <div className={s.compactTimeline}>
      {startIdx > 0 && <span className={s.ellipsis}>...</span>}
      {visibleSteps.map((step, index) => {
        const status = getStepStatus(step.key);
        return (
          <div key={step.key} className={s.compactStepWrapper}>
            {index > 0 && <div className={`${s.compactConnector} ${s[status]}`} />}
            <div 
              className={`${s.compactStep} ${s[status]}`}
              title={step.title}
            >
              <div className={s.compactDot} />
              <span className={s.compactLabel}>{step.title}</span>
            </div>
          </div>
        );
      })}
      {endIdx < mainSteps.length && <span className={s.ellipsis}>...</span>}
    </div>
  );
}

export default ProcessTimeline;
