'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Types
interface TimeEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  projectId?: string;
  projectName?: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  billable: boolean;
}

interface Task {
  id: string;
  title: string;
  projectId?: string;
  projectName?: string;
}

interface TimeTrackerProps {
  userId: string;
  recentEntries: TimeEntry[];
  assignedTasks: Task[];
  weeklyTotal: number; // in minutes
  dailyTotal: number; // in minutes
  onLogTime?: (entry: Omit<TimeEntry, 'id'>) => Promise<void>;
  onStartTimer?: (taskId: string, description?: string) => Promise<void>;
  onStopTimer?: () => Promise<void>;
  activeTimer?: {
    taskId: string;
    taskTitle: string;
    startTime: Date;
  } | null;
}

// Icons
const Icons = {
  play: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  stop: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12"/></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
};

// Format duration
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

// Format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

// Weekly chart data
const getWeekDays = (): string[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  return [...days.slice(today + 1), ...days.slice(0, today + 1)];
};

export default function TimeTracker({
  recentEntries,
  assignedTasks,
  weeklyTotal,
  dailyTotal,
  onLogTime,
  onStartTimer,
  onStopTimer,
  activeTimer,
}: TimeTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [description, setDescription] = useState('');
  const [manualDuration, setManualDuration] = useState('');
  const [isBillable, setIsBillable] = useState(true);

  // Timer effect
  useEffect(() => {
    if (activeTimer) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeTimer.startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedTime(0);
    }
  }, [activeTimer]);

  // Format elapsed time as HH:MM:SS
  const formatElapsed = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = useCallback(async () => {
    if (selectedTask && onStartTimer) {
      await onStartTimer(selectedTask, description);
      setDescription('');
    }
  }, [selectedTask, description, onStartTimer]);

  const handleStopTimer = useCallback(async () => {
    if (onStopTimer) {
      await onStopTimer();
    }
  }, [onStopTimer]);

  const handleManualEntry = useCallback(async () => {
    if (selectedTask && manualDuration && onLogTime) {
      const durationMinutes = parseInt(manualDuration, 10);
      if (isNaN(durationMinutes) || durationMinutes <= 0) return;

      const task = assignedTasks.find(t => t.id === selectedTask);
      await onLogTime({
        taskId: selectedTask,
        taskTitle: task?.title || 'Unknown Task',
        projectId: task?.projectId,
        projectName: task?.projectName,
        description,
        startTime: new Date(Date.now() - durationMinutes * 60000),
        endTime: new Date(),
        duration: durationMinutes,
        billable: isBillable,
      });
      setManualDuration('');
      setDescription('');
      setShowManualEntry(false);
    }
  }, [selectedTask, manualDuration, description, isBillable, assignedTasks, onLogTime]);

  // Calculate weekly breakdown (simulated from recent entries)
  const weeklyBreakdown = React.useMemo(() => {
    const days = getWeekDays();
    const today = new Date();
    const breakdown: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayMinutes = recentEntries
        .filter(e => {
          const entryDate = new Date(e.startTime);
          return entryDate >= dayStart && entryDate <= dayEnd;
        })
        .reduce((sum, e) => sum + e.duration, 0);
      
      breakdown.push(dayMinutes);
    }
    
    return { days, values: breakdown };
  }, [recentEntries]);

  const maxWeeklyValue = Math.max(...weeklyBreakdown.values, 60);

  return (
    <div className="timeTracker">
      <style jsx>{`
        .timeTracker {
          background: var(--int-bg-secondary);
          border: 1px solid var(--int-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .trackerHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--int-bg-primary);
          border-bottom: 1px solid var(--int-border);
          cursor: pointer;
        }

        .trackerTitle {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: var(--int-text-primary);
        }

        .trackerTitle svg {
          width: 20px;
          height: 20px;
          color: var(--int-primary);
        }

        .trackerStats {
          display: flex;
          gap: 20px;
        }

        .trackerStat {
          text-align: right;
        }

        .trackerStatValue {
          font-size: 18px;
          font-weight: 700;
          color: var(--int-primary);
        }

        .trackerStatLabel {
          font-size: 11px;
          color: var(--int-text-secondary);
          text-transform: uppercase;
        }

        .trackerBody {
          padding: 20px;
        }

        .activeTimerSection {
          background: linear-gradient(135deg, var(--int-primary) 0%, var(--int-primary-dark) 100%);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          color: white;
        }

        .timerDisplay {
          text-align: center;
          margin-bottom: 16px;
        }

        .timerTime {
          font-size: 48px;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }

        .timerTask {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 8px;
        }

        .timerControls {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .timerBtn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .timerBtn svg {
          width: 24px;
          height: 24px;
        }

        .timerBtnStop {
          background: white;
          color: var(--int-error);
        }

        .timerBtnStop:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .startTimerSection {
          background: var(--int-bg-tertiary);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .startTimerRow {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .taskSelect {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid var(--int-border);
          border-radius: 8px;
          background: var(--int-bg-primary);
          color: var(--int-text-primary);
          font-size: 14px;
        }

        .descriptionInput {
          flex: 2;
          padding: 10px 14px;
          border: 1px solid var(--int-border);
          border-radius: 8px;
          background: var(--int-bg-primary);
          color: var(--int-text-primary);
          font-size: 14px;
        }

        .startBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--int-success);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .startBtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .startBtn:not(:disabled):hover {
          filter: brightness(1.1);
        }

        .startBtn svg {
          width: 16px;
          height: 16px;
        }

        .manualEntryToggle {
          font-size: 13px;
          color: var(--int-primary);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .manualEntryToggle svg {
          width: 14px;
          height: 14px;
        }

        .manualEntrySection {
          background: var(--int-bg-tertiary);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .manualEntryRow {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .durationInput {
          width: 100px;
          padding: 10px 14px;
          border: 1px solid var(--int-border);
          border-radius: 8px;
          background: var(--int-bg-primary);
          color: var(--int-text-primary);
          font-size: 14px;
        }

        .billableToggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid var(--int-border);
          border-radius: 8px;
          background: var(--int-bg-primary);
          cursor: pointer;
          font-size: 14px;
          color: var(--int-text-primary);
        }

        .billableToggle.active {
          background: var(--int-success);
          border-color: var(--int-success);
          color: white;
        }

        .billableToggle svg {
          width: 16px;
          height: 16px;
        }

        .weeklyChart {
          margin-bottom: 20px;
        }

        .weeklyChartTitle {
          font-size: 13px;
          font-weight: 600;
          color: var(--int-text-secondary);
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .weeklyBars {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 80px;
        }

        .weeklyBar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .weeklyBarFill {
          width: 100%;
          border-radius: 4px 4px 0 0;
          background: var(--int-primary);
          min-height: 4px;
          transition: height 0.3s ease;
        }

        .weeklyBarLabel {
          font-size: 10px;
          color: var(--int-text-secondary);
        }

        .weeklyBarValue {
          font-size: 10px;
          color: var(--int-text-primary);
          font-weight: 600;
        }

        .recentEntries {
          margin-top: 20px;
        }

        .recentEntriesTitle {
          font-size: 13px;
          font-weight: 600;
          color: var(--int-text-secondary);
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .entryList {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .entryItem {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--int-bg-tertiary);
          border-radius: 8px;
        }

        .entryIcon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--int-bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .entryIcon svg {
          width: 18px;
          height: 18px;
          color: var(--int-text-secondary);
        }

        .entryIcon.billable {
          background: rgba(34, 197, 94, 0.1);
        }

        .entryIcon.billable svg {
          color: var(--int-success);
        }

        .entryContent {
          flex: 1;
          min-width: 0;
        }

        .entryTask {
          font-weight: 500;
          color: var(--int-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .entryMeta {
          font-size: 12px;
          color: var(--int-text-secondary);
          display: flex;
          gap: 8px;
        }

        .entryDuration {
          font-weight: 600;
          color: var(--int-primary);
          font-size: 14px;
        }

        .entryTime {
          font-size: 12px;
          color: var(--int-text-secondary);
        }

        .emptyState {
          text-align: center;
          padding: 24px;
          color: var(--int-text-secondary);
        }

        .emptyStateIcon {
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          opacity: 0.5;
        }
      `}</style>

      <div className="trackerHeader" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="trackerTitle">
          {Icons.clock}
          <span>Time Tracker</span>
          {activeTimer && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ color: 'var(--int-success)', fontSize: '14px' }}
            >
              ● Recording
            </motion.span>
          )}
        </div>
        <div className="trackerStats">
          <div className="trackerStat">
            <div className="trackerStatValue">{formatDuration(dailyTotal)}</div>
            <div className="trackerStatLabel">Today</div>
          </div>
          <div className="trackerStat">
            <div className="trackerStatValue">{formatDuration(weeklyTotal)}</div>
            <div className="trackerStatLabel">This Week</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="trackerBody"
          >
            {/* Active Timer Display */}
            {activeTimer && (
              <div className="activeTimerSection">
                <div className="timerDisplay">
                  <div className="timerTime">{formatElapsed(elapsedTime)}</div>
                  <div className="timerTask">{activeTimer.taskTitle}</div>
                </div>
                <div className="timerControls">
                  <button className="timerBtn timerBtnStop" onClick={handleStopTimer}>
                    {Icons.stop}
                  </button>
                </div>
              </div>
            )}

            {/* Start Timer Section */}
            {!activeTimer && (
              <div className="startTimerSection">
                <div className="startTimerRow">
                  <select
                    className="taskSelect"
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                  >
                    <option value="">Select a task...</option>
                    {assignedTasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.projectName ? `[${task.projectName}] ` : ''}{task.title}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="descriptionInput"
                    placeholder="What are you working on?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button
                    className="startBtn"
                    onClick={handleStartTimer}
                    disabled={!selectedTask}
                  >
                    {Icons.play}
                    Start
                  </button>
                </div>
                <button
                  className="manualEntryToggle"
                  onClick={() => setShowManualEntry(!showManualEntry)}
                >
                  {Icons.plus}
                  {showManualEntry ? 'Hide' : 'Add'} manual entry
                </button>
              </div>
            )}

            {/* Manual Entry Section */}
            <AnimatePresence>
              {showManualEntry && !activeTimer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="manualEntrySection"
                >
                  <div className="manualEntryRow">
                    <input
                      type="number"
                      className="durationInput"
                      placeholder="Minutes"
                      value={manualDuration}
                      onChange={(e) => setManualDuration(e.target.value)}
                      min="1"
                    />
                    <button
                      className={`billableToggle ${isBillable ? 'active' : ''}`}
                      onClick={() => setIsBillable(!isBillable)}
                    >
                      {Icons.dollar}
                      Billable
                    </button>
                    <button
                      className="startBtn"
                      onClick={handleManualEntry}
                      disabled={!selectedTask || !manualDuration}
                    >
                      {Icons.check}
                      Log Time
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Weekly Chart */}
            <div className="weeklyChart">
              <div className="weeklyChartTitle">This Week</div>
              <div className="weeklyBars">
                {weeklyBreakdown.days.map((day, index) => (
                  <div key={day} className="weeklyBar">
                    <div className="weeklyBarValue">
                      {weeklyBreakdown.values[index] > 0 
                        ? formatDuration(weeklyBreakdown.values[index]) 
                        : '-'}
                    </div>
                    <div
                      className="weeklyBarFill"
                      style={{
                        height: `${(weeklyBreakdown.values[index] / maxWeeklyValue) * 60}px`,
                        opacity: index === 6 ? 1 : 0.6
                      }}
                    />
                    <div className="weeklyBarLabel">{day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Entries */}
            <div className="recentEntries">
              <div className="recentEntriesTitle">Recent Entries</div>
              {recentEntries.length > 0 ? (
                <div className="entryList">
                  {recentEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="entryItem">
                      <div className={`entryIcon ${entry.billable ? 'billable' : ''}`}>
                        {entry.billable ? Icons.dollar : Icons.clock}
                      </div>
                      <div className="entryContent">
                        <div className="entryTask">{entry.taskTitle}</div>
                        <div className="entryMeta">
                          {entry.projectName && <span>{entry.projectName}</span>}
                          {entry.description && <span>• {entry.description}</span>}
                        </div>
                      </div>
                      <div className="entryDuration">{formatDuration(entry.duration)}</div>
                      <div className="entryTime">{formatTimeAgo(entry.startTime)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="emptyState">
                  <div className="emptyStateIcon">{Icons.clock}</div>
                  <p>No time entries yet today</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
