/**
 * ProcessSimulator - Interactive Process Simulation Controls
 * 
 * Provides simulation capabilities:
 * - Play/Pause/Step controls
 * - Speed adjustment
 * - Real-time step highlighting
 * - Execution log
 * - Statistics
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ProcessSimulator.module.css';

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

interface SimulationLog {
  timestamp: Date;
  stepKey: string;
  stepTitle: string;
  lane: string;
  action: 'entered' | 'completed' | 'automated' | 'decision';
  details?: string;
}

interface ProcessSimulatorProps {
  steps: ProcessStep[];
  onStepChange?: (stepKey: string | null, completedSteps: string[]) => void;
  onAnimatingStep?: (stepKey: string | null) => void;
}

export function ProcessSimulator({
  steps,
  onStepChange,
  onAnimatingStep,
}: ProcessSimulatorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5x, 1x, 2x, 4x
  const [currentStepKey, setCurrentStepKey] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Find start event
  const startStep = steps.find(s => s.type === 'startEvent' || s.type === 'start_event');

  // Add log entry
  const addLog = useCallback((stepKey: string, action: SimulationLog['action'], details?: string) => {
    const step = steps.find(s => s.key === stepKey);
    if (!step) return;

    setLogs(prev => [...prev, {
      timestamp: new Date(),
      stepKey,
      stepTitle: step.title,
      lane: step.lane,
      action,
      details,
    }]);
  }, [steps]);

  // Get next step (handles gateways with random selection for simulation)
  const getNextStep = useCallback((currentKey: string): string | null => {
    const current = steps.find(s => s.key === currentKey);
    if (!current || current.nextSteps.length === 0) return null;

    // For gateways, randomly select a path (simulation)
    if (current.type === 'gateway' && current.nextSteps.length > 1) {
      const randomIndex = Math.floor(Math.random() * current.nextSteps.length);
      const selectedKey = current.nextSteps[randomIndex];
      addLog(currentKey, 'decision', `Path selected: ${steps.find(s => s.key === selectedKey)?.title}`);
      return selectedKey;
    }

    return current.nextSteps[0];
  }, [steps, addLog]);

  // Advance to next step
  const advanceStep = useCallback(() => {
    if (!currentStepKey) {
      // Start simulation
      if (startStep) {
        setCurrentStepKey(startStep.key);
        onAnimatingStep?.(startStep.key);
        addLog(startStep.key, 'entered');
        setTotalSteps(1);
      }
      return;
    }

    const current = steps.find(s => s.key === currentStepKey);
    if (!current) return;

    // Complete current step
    setCompletedSteps(prev => [...prev, currentStepKey]);
    addLog(currentStepKey, 'completed');

    // Log automations
    if (current.automations?.length) {
      current.automations.forEach(auto => {
        addLog(currentStepKey, 'automated', `Triggered: ${auto.action}`);
      });
    }

    // Move to next step
    const nextKey = getNextStep(currentStepKey);
    
    if (nextKey) {
      setTimeout(() => {
        setCurrentStepKey(nextKey);
        onAnimatingStep?.(nextKey);
        addLog(nextKey, 'entered');
        setTotalSteps(prev => prev + 1);
      }, 200);
    } else {
      // Simulation complete
      setCurrentStepKey(null);
      onAnimatingStep?.(null);
      setIsPlaying(false);
    }
  }, [currentStepKey, steps, startStep, getNextStep, addLog, onAnimatingStep]);

  // Notify parent of changes
  useEffect(() => {
    onStepChange?.(currentStepKey, completedSteps);
  }, [currentStepKey, completedSteps, onStepChange]);

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying) {
      const baseInterval = 2000 / speed;
      intervalRef.current = setInterval(() => {
        advanceStep();
        setElapsedTime(prev => prev + 1);
      }, baseInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, advanceStep]);

  // Scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Control handlers
  const handlePlay = () => {
    if (!currentStepKey && startStep) {
      setCurrentStepKey(startStep.key);
      onAnimatingStep?.(startStep.key);
      addLog(startStep.key, 'entered');
      setTotalSteps(1);
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleStep = () => {
    if (isPlaying) setIsPlaying(false);
    advanceStep();
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepKey(null);
    setCompletedSteps([]);
    setLogs([]);
    setElapsedTime(0);
    setTotalSteps(0);
    onStepChange?.(null, []);
    onAnimatingStep?.(null);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  // Get current step info
  const currentStep = currentStepKey ? steps.find(s => s.key === currentStepKey) : null;
  const isComplete = completedSteps.length > 0 && !currentStepKey;
  const progress = steps.length > 0 ? Math.round((completedSteps.length / steps.length) * 100) : 0;

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Lane colors for logs
  const laneColors: Record<string, string> = {
    Client: '#3b82f6',
    BusinessDevelopment: '#10b981',
    AutomationCRM: '#f59e0b',
    ProjectManagement: '#8b5cf6',
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Process Simulation
        </h3>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{completedSteps.length}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatTime(elapsedTime)}</span>
            <span className={styles.statLabel}>Elapsed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{progress}%</span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>
      </div>

      {/* Current Step Display */}
      <div className={styles.currentStep}>
        {currentStep ? (
          <>
            <div className={styles.currentStepLabel}>Currently Executing</div>
            <div className={styles.currentStepInfo}>
              <span 
                className={styles.laneBadge}
                style={{ background: laneColors[currentStep.lane] || '#6b7280' }}
              >
                {currentStep.lane.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className={styles.stepTitle}>{currentStep.title}</span>
              {currentStep.automations?.length ? (
                <span className={styles.automationBadge}>
                  ⚙ {currentStep.automations.length} automation{currentStep.automations.length > 1 ? 's' : ''}
                </span>
              ) : null}
            </div>
            {currentStep.description && (
              <p className={styles.stepDescription}>{currentStep.description}</p>
            )}
          </>
        ) : isComplete ? (
          <div className={styles.complete}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--int-success)" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h4>Simulation Complete!</h4>
            <p>All {completedSteps.length} steps have been executed successfully.</p>
          </div>
        ) : (
          <div className={styles.ready}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--int-primary)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <h4>Ready to Simulate</h4>
            <p>Click Play to start the process simulation and watch the workflow execute step by step.</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.playbackControls}>
          <button 
            className={styles.controlBtn}
            onClick={handleReset}
            title="Reset"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>

          <button 
            className={styles.controlBtn}
            onClick={handleStep}
            disabled={isComplete}
            title="Step Forward"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>

          {isPlaying ? (
            <button 
              className={`${styles.controlBtn} ${styles.primaryBtn}`}
              onClick={handlePause}
              title="Pause"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>
          ) : (
            <button 
              className={`${styles.controlBtn} ${styles.primaryBtn}`}
              onClick={handlePlay}
              disabled={isComplete}
              title="Play"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          )}
        </div>

        {/* Speed Controls */}
        <div className={styles.speedControls}>
          <span className={styles.speedLabel}>Speed:</span>
          {[0.5, 1, 2, 4].map(s => (
            <button
              key={s}
              className={`${styles.speedBtn} ${speed === s ? styles.speedBtnActive : ''}`}
              onClick={() => handleSpeedChange(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Execution Log */}
      <div className={styles.logSection}>
        <h4 className={styles.logTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Execution Log
        </h4>
        <div className={styles.logContainer}>
          {logs.length === 0 ? (
            <div className={styles.logEmpty}>
              No activity yet. Start the simulation to see execution logs.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className={styles.logEntry}>
                <span className={styles.logTime}>
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <span 
                  className={styles.logLane}
                  style={{ color: laneColors[log.lane] || '#6b7280' }}
                >
                  [{log.lane}]
                </span>
                <span className={`${styles.logAction} ${styles[`log${log.action.charAt(0).toUpperCase() + log.action.slice(1)}`]}`}>
                  {log.action === 'entered' && '→'}
                  {log.action === 'completed' && '✓'}
                  {log.action === 'automated' && '⚙'}
                  {log.action === 'decision' && '◇'}
                </span>
                <span className={styles.logTitle}>{log.stepTitle}</span>
                {log.details && (
                  <span className={styles.logDetails}>{log.details}</span>
                )}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}

export default ProcessSimulator;
