/**
 * StepCard Component
 * 
 * Displays detailed information about a process step
 * with actions for completing/executing the step
 */
'use client';

import { useState } from 'react';
import s from './StepCard.module.css';
import type { BusinessProcessStep } from '@/lib/workflow/businessProcess';

// Icons
const Icons = {
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  bot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <circle cx="15" cy="10" r="2" />
      <path d="M9 16h6" />
      <path d="M12 2v2" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  gateway: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L22 12L12 22L2 12Z" />
    </svg>
  ),
};

interface StepCardProps {
  step: BusinessProcessStep;
  status: 'completed' | 'current' | 'pending';
  canExecute?: boolean;
  isLoading?: boolean;
  availableNextSteps?: Array<{ key: string; title: string; condition?: string }>;
  onComplete?: (outputData?: Record<string, unknown>, gatewayDecision?: string) => void;
  onViewDetails?: () => void;
  outputData?: Record<string, unknown>;
  notes?: string;
}

export function StepCard({
  step,
  status,
  canExecute = false,
  isLoading = false,
  availableNextSteps = [],
  onComplete,
  onViewDetails,
  outputData,
  notes,
}: StepCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [formNotes, setFormNotes] = useState('');
  const [selectedGatewayPath, setSelectedGatewayPath] = useState('');

  const handleComplete = () => {
    onComplete?.(
      formNotes ? { notes: formNotes } : undefined,
      step.type === 'gateway' ? selectedGatewayPath : undefined
    );
    setShowForm(false);
    setFormNotes('');
    setSelectedGatewayPath('');
  };

  const isGateway = step.type === 'gateway';
  const isAutomation = !step.isManual && step.automationAction;

  return (
    <div className={`${s.card} ${s[status]}`}>
      {/* Header */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <span className={`${s.badge} ${s[step.lane]}`}>
            {step.lane.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          {isAutomation && (
            <span className={s.automationBadge}>
              <span className={s.icon}>{Icons.bot}</span>
              Automation
            </span>
          )}
          {step.isManual && (
            <span className={s.manualBadge}>
              <span className={s.icon}>{Icons.user}</span>
              Manual
            </span>
          )}
        </div>
        <div className={s.headerRight}>
          {status === 'completed' && (
            <span className={s.statusBadge}>
              <span className={s.icon}>{Icons.check}</span>
              Completed
            </span>
          )}
          {status === 'current' && (
            <span className={`${s.statusBadge} ${s.active}`}>
              <span className={s.pulse} />
              In Progress
            </span>
          )}
          {status === 'pending' && (
            <span className={`${s.statusBadge} ${s.pending}`}>
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={s.content}>
        <div className={s.titleRow}>
          {isGateway ? (
            <span className={s.gatewayIcon}>{Icons.gateway}</span>
          ) : null}
          <h3 className={s.title}>{step.title}</h3>
        </div>

        {step.description && (
          <p className={s.description}>{step.description}</p>
        )}

        {/* Expected duration */}
        {step.expectedDurationMinutes && (
          <div className={s.meta}>
            <span className={s.icon}>{Icons.clock}</span>
            <span>Expected: {formatDuration(step.expectedDurationMinutes)}</span>
          </div>
        )}

        {/* Participant info */}
        {step.participant && (
          <div className={s.meta}>
            <span className={s.icon}>{Icons.user}</span>
            <span>Assigned to: {step.participant}</span>
          </div>
        )}

        {/* Automation action */}
        {step.automationAction && (
          <div className={s.automationInfo}>
            <span className={s.icon}>{Icons.bot}</span>
            <code>{step.automationAction}</code>
          </div>
        )}

        {/* Completed output */}
        {status === 'completed' && outputData && (
          <div className={s.outputSection}>
            <h4 className={s.sectionTitle}>Output</h4>
            <pre className={s.output}>
              {JSON.stringify(outputData, null, 2)}
            </pre>
          </div>
        )}

        {notes && (
          <div className={s.notesSection}>
            <h4 className={s.sectionTitle}>Notes</h4>
            <p className={s.notes}>{notes}</p>
          </div>
        )}
      </div>

      {/* Gateway Decision Section */}
      {isGateway && status === 'current' && availableNextSteps.length > 0 && (
        <div className={s.gatewaySection}>
          <h4 className={s.sectionTitle}>Select Path</h4>
          <div className={s.gatewayOptions}>
            {availableNextSteps.map(path => (
              <label key={path.key} className={s.gatewayOption}>
                <input
                  type="radio"
                  name="gateway-decision"
                  value={path.key}
                  checked={selectedGatewayPath === path.key}
                  onChange={() => setSelectedGatewayPath(path.key)}
                />
                <span className={s.optionContent}>
                  <span className={s.optionTitle}>{path.title}</span>
                  {path.condition && (
                    <span className={s.optionCondition}>{path.condition}</span>
                  )}
                </span>
                <span className={s.optionIcon}>{Icons.chevronRight}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {status === 'current' && canExecute && (
        <div className={s.actions}>
          {showForm ? (
            <div className={s.form}>
              <textarea
                className={s.textarea}
                placeholder="Add notes (optional)..."
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                rows={3}
              />
              <div className={s.formActions}>
                <button
                  type="button"
                  className={s.cancelBtn}
                  onClick={() => setShowForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={s.completeBtn}
                  onClick={handleComplete}
                  disabled={isLoading || (isGateway && !selectedGatewayPath)}
                >
                  {isLoading ? (
                    <span className={s.spinner} />
                  ) : (
                    <>
                      <span className={s.icon}>{Icons.check}</span>
                      Complete Step
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={s.primaryBtn}
              onClick={() => isAutomation ? onComplete?.() : setShowForm(true)}
              disabled={isLoading || (isGateway && !selectedGatewayPath)}
            >
              {isLoading ? (
                <span className={s.spinner} />
              ) : isAutomation ? (
                <>
                  <span className={s.icon}>{Icons.play}</span>
                  Execute Automation
                </>
              ) : (
                <>
                  <span className={s.icon}>{Icons.check}</span>
                  {isGateway ? 'Confirm Decision' : 'Complete Step'}
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* View details button for completed/pending */}
      {onViewDetails && status !== 'current' && (
        <div className={s.footer}>
          <button
            type="button"
            className={s.detailsBtn}
            onClick={onViewDetails}
          >
            <span className={s.icon}>{Icons.info}</span>
            View Details
          </button>
        </div>
      )}
    </div>
  );
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default StepCard;
