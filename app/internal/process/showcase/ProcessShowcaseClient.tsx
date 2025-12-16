/**
 * Process Showcase Client Component
 * 
 * Handles interactive flowchart and simulation controls
 */
'use client';

import { useState, useCallback } from 'react';
import { ProcessFlowchart } from '@/components/ProcessFlowchart';
import { ProcessSimulator } from '@/components/ProcessSimulator';
import s from '../../styles.module.css';
import type { Lane } from '@/lib/workflow/businessProcess';

interface ProcessStep {
  key: string;
  title: string;
  type: string;
  lane: string;
  nextSteps: string[];
  description?: string;
  estimatedDurationMinutes?: number;
  automations?: Array<{ action: string; params?: Record<string, unknown> }>;
  gatewayConditions?: Array<{ condition: string; targetStepKey: string }>;
}

interface ProcessShowcaseClientProps {
  steps: ProcessStep[];
  lanes: Lane[];
  processName: string;
}

export default function ProcessShowcaseClient({
  steps,
  lanes,
  processName,
}: ProcessShowcaseClientProps) {
  const [currentStepKey, setCurrentStepKey] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [selectedStepKey, setSelectedStepKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'flowchart' | 'split'>('split');

  // Handle step changes from simulator
  const handleStepChange = useCallback((stepKey: string | null, completed: string[]) => {
    setCurrentStepKey(stepKey);
    setCompletedSteps(completed);
  }, []);

  // Handle animating step
  const handleAnimatingStep = useCallback((stepKey: string | null) => {
    setAnimatingStep(stepKey);
  }, []);

  // Handle step click in flowchart
  const handleStepClick = useCallback((stepKey: string) => {
    setSelectedStepKey(stepKey);
  }, []);

  // Get selected step details
  const selectedStep = selectedStepKey ? steps.find(s => s.key === selectedStepKey) : null;

  return (
    <div className={s.processShowcase}>
      {/* View Toggle */}
      <div className={s.viewToggle}>
        <button
          className={`${s.viewToggleBtn} ${viewMode === 'flowchart' ? s.viewToggleBtnActive : ''}`}
          onClick={() => setViewMode('flowchart')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Flowchart Only
        </button>
        <button
          className={`${s.viewToggleBtn} ${viewMode === 'split' ? s.viewToggleBtnActive : ''}`}
          onClick={() => setViewMode('split')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
          Split View
        </button>
      </div>

      {/* Main Content */}
      <div className={viewMode === 'split' ? s.splitView : s.fullView}>
        {/* Flowchart */}
        <section className={`${s.card} ${viewMode === 'split' ? s.splitLeft : ''}`}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Interactive Flowchart
            </h2>
            <span className={s.badge}>{processName}</span>
          </div>
          <div className={s.cardBody}>
            <ProcessFlowchart
              steps={steps}
              lanes={lanes}
              currentStepKey={currentStepKey || undefined}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
              simulationMode={true}
              animatingStep={animatingStep}
            />
          </div>
        </section>

        {/* Simulator Panel (only in split view) */}
        {viewMode === 'split' && (
          <div className={s.splitRight}>
            {/* Simulator */}
            <ProcessSimulator
              steps={steps}
              onStepChange={handleStepChange}
              onAnimatingStep={handleAnimatingStep}
            />

            {/* Selected Step Details */}
            {selectedStep && (
              <section className={s.card}>
                <div className={s.cardHeader}>
                  <h3 className={s.cardTitle}>Step Details</h3>
                  <button 
                    className={s.btnIcon}
                    onClick={() => setSelectedStepKey(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className={s.cardBody}>
                  <h4 className={s.stepDetailTitle}>{selectedStep.title}</h4>
                  <div className={s.stepDetailMeta}>
                    <span className={s.badge}>{selectedStep.lane}</span>
                    <span className={s.badge}>{selectedStep.type}</span>
                    {selectedStep.estimatedDurationMinutes && (
                      <span className={s.textMuted}>
                        ~{selectedStep.estimatedDurationMinutes} min
                      </span>
                    )}
                  </div>
                  {selectedStep.description && (
                    <p className={s.stepDetailDesc}>{selectedStep.description}</p>
                  )}
                  {selectedStep.automations && selectedStep.automations.length > 0 && (
                    <div className={s.stepDetailAutomations}>
                      <h5>Automations:</h5>
                      <ul>
                        {selectedStep.automations.map((auto, idx) => (
                          <li key={idx}>
                            <code>{auto.action}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedStep.nextSteps.length > 0 && (
                    <div className={s.stepDetailNext}>
                      <h5>Next Steps:</h5>
                      <div className={s.nextStepsList}>
                        {selectedStep.nextSteps.map(nextKey => {
                          const nextStep = steps.find(s => s.key === nextKey);
                          return (
                            <button
                              key={nextKey}
                              className={s.nextStepBtn}
                              onClick={() => setSelectedStepKey(nextKey)}
                            >
                              → {nextStep?.title || nextKey}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Full-width Simulator (when in flowchart-only mode) */}
      {viewMode === 'flowchart' && (
        <ProcessSimulator
          steps={steps}
          onStepChange={handleStepChange}
          onAnimatingStep={handleAnimatingStep}
        />
      )}
    </div>
  );
}
