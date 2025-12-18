'use client';

import { useState } from 'react';
import Image from 'next/image';
import s from '../../styles.module.css';
import type { ProcessLane, BusinessProcessStep } from '@/lib/workflow/businessProcess';

interface ProcessDiagramViewerProps {
  instanceStatus: string;
  currentStepKey?: string;
  completedSteps: string[];
  definition: {
    key: string;
    name: string;
    steps: BusinessProcessStep[];
    lanes: ProcessLane[];
  };
}

export default function ProcessDiagramViewer({
  instanceStatus,
  currentStepKey,
  completedSteps,
  definition,
}: ProcessDiagramViewerProps) {
  const [viewMode, setViewMode] = useState<'timeline' | 'diagram'>('timeline');
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  // Get step status
  const getStepStatus = (stepKey: string) => {
    if (completedSteps.includes(stepKey)) return 'completed';
    if (stepKey === currentStepKey) return 'current';
    return 'pending';
  };

  // Group steps by lane
  const stepsByLane = definition.lanes.map(lane => ({
    lane,
    laneDisplayName: lane.replace(/([A-Z])/g, ' $1').trim(),
    steps: definition.steps.filter(step => step.lane === lane),
  }));

  // Get step type icon
  const getStepIcon = (step: BusinessProcessStep, status: string) => {
    if (status === 'completed') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    }
    if (status === 'current') {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
          <circle cx="12" cy="12" r="6" />
        </svg>
      );
    }
    if (step.type === 'start_event' || step.type === 'end_event') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={step.type === 'end_event' ? 3 : 2} style={{ width: 20, height: 20 }}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    }
    if (step.type === 'gateway') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
          <path d="M12 2L22 12L12 22L2 12Z" />
        </svg>
      );
    }
    if (step.automationAction) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
      </svg>
    );
  };

  // Get lane color
  const getLaneColor = (lane: string): string => {
    const colors: Record<string, string> = {
      Client: 'var(--int-info)',
      BusinessDevelopment: 'var(--int-warning)',
      AutomationCRM: 'var(--int-secondary)',
      ProjectManagement: 'var(--int-primary)',
      Development: 'var(--int-success)',
    };
    return colors[lane] || 'var(--int-text-muted)';
  };

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>Process Diagram</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('timeline')}
            className={viewMode === 'timeline' ? s.btnPrimary : s.btnSecondary}
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('diagram')}
            className={viewMode === 'diagram' ? s.btnPrimary : s.btnSecondary}
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
          >
            Full Diagram
          </button>
        </div>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        {viewMode === 'diagram' ? (
          <div style={{ padding: '1rem', overflowX: 'auto', background: 'var(--int-bg-alt)' }}>
            <div style={{ minWidth: '1200px', margin: '0 auto' }}>
              <Image
                src="/process/software-delivery-process.svg"
                alt="Software Delivery & Project Management Process"
                width={1200}
                height={600}
                style={{ width: '100%', height: 'auto' }}
                priority
              />
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            {/* Swimlane Visualization */}
            <div style={{ minWidth: '800px' }}>
              {stepsByLane.map(({ lane, laneDisplayName, steps }) => (
                <div
                  key={lane}
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--int-border)',
                  }}
                >
                  {/* Lane Header */}
                  <div
                    style={{
                      width: '160px',
                      minWidth: '160px',
                      padding: '1rem',
                      background: 'var(--int-bg-alt)',
                      borderRight: `3px solid ${getLaneColor(lane)}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{laneDisplayName}</div>
                  </div>

                  {/* Steps */}
                  <div
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'nowrap',
                      overflowX: 'auto',
                    }}
                  >
                    {steps.map((step, idx) => {
                      const status = getStepStatus(step.key);
                      const isSelected = selectedStep === step.key;
                      
                      return (
                        <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                          {idx > 0 && (
                            <div
                              style={{
                                width: '24px',
                                height: '2px',
                                background: status === 'completed' ? 'var(--int-success)' : 'var(--int-border)',
                              }}
                            />
                          )}
                          <button
                            onClick={() => setSelectedStep(isSelected ? null : step.key)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.5rem',
                              borderRadius: step.type === 'gateway' ? '0' : step.type === 'start_event' || step.type === 'end_event' ? '50%' : '0.5rem',
                              border: `2px solid ${status === 'completed' ? 'var(--int-success)' : status === 'current' ? 'var(--int-primary)' : 'var(--int-border)'}`,
                              background: status === 'completed' 
                                ? 'rgba(34, 197, 94, 0.1)' 
                                : status === 'current' 
                                  ? 'rgba(99, 102, 241, 0.15)' 
                                  : 'var(--int-surface)',
                              cursor: 'pointer',
                              minWidth: step.type === 'gateway' || step.type === 'start_event' || step.type === 'end_event' ? '50px' : '80px',
                              maxWidth: step.type === 'gateway' || step.type === 'start_event' || step.type === 'end_event' ? '50px' : '120px',
                              minHeight: step.type === 'gateway' || step.type === 'start_event' || step.type === 'end_event' ? '50px' : 'auto',
                              transform: step.type === 'gateway' ? 'rotate(45deg)' : 'none',
                              boxShadow: status === 'current' ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : isSelected ? '0 0 0 2px var(--int-primary)' : 'none',
                              transition: 'all 0.2s',
                              position: 'relative',
                            }}
                            title={step.title}
                          >
                            <span style={{ color: status === 'completed' ? 'var(--int-success)' : status === 'current' ? 'var(--int-primary)' : 'var(--int-text-muted)', transform: step.type === 'gateway' ? 'rotate(-45deg)' : 'none' }}>
                              {getStepIcon(step, status)}
                            </span>
                            {step.type !== 'gateway' && step.type !== 'start_event' && step.type !== 'end_event' && (
                              <span
                                style={{
                                  fontSize: '0.625rem',
                                  fontWeight: 500,
                                  lineHeight: 1.2,
                                  textAlign: 'center',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  maxWidth: '100px',
                                }}
                              >
                                {step.title}
                              </span>
                            )}
                            {step.automationAction && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '-6px',
                                  right: '-6px',
                                  fontSize: '8px',
                                  fontWeight: 700,
                                  background: 'var(--int-warning)',
                                  color: '#000',
                                  padding: '1px 4px',
                                  borderRadius: '999px',
                                  textTransform: 'uppercase',
                                  transform: step.type === 'gateway' ? 'rotate(-45deg)' : 'none',
                                }}
                              >
                                Auto
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Step Details */}
            {selectedStep && (
              <div style={{ padding: '1rem', borderTop: '1px solid var(--int-border)', background: 'var(--int-bg-alt)' }}>
                {(() => {
                  const step = definition.steps.find(s => s.key === selectedStep);
                  if (!step) return null;
                  const status = getStepStatus(step.key);
                  
                  return (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{step.title}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)', marginBottom: '0.5rem' }}>
                          {step.description || 'No description available'}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span className={s.badge} style={{ background: getLaneColor(step.lane), color: '#fff' }}>
                            {step.lane}
                          </span>
                          <span className={s.badge} style={{ background: status === 'completed' ? 'var(--int-success)' : status === 'current' ? 'var(--int-primary)' : 'var(--int-text-muted)', color: '#fff' }}>
                            {status}
                          </span>
                          {step.isManual && (
                            <span className={s.badge}>Manual</span>
                          )}
                          {step.automationAction && (
                            <span className={s.badge} style={{ background: 'var(--int-warning)', color: '#000' }}>
                              {step.automationAction.replace(/_/g, ' ')}
                            </span>
                          )}
                          {step.estimatedMinutes && (
                            <span className={s.badge}>~{step.estimatedMinutes}min</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedStep(null)}
                        className={s.btnIcon}
                        style={{ padding: '0.5rem' }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
