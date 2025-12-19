'use client';

/**
 * Step Assignment Dialog Component
 * 
 * Provides UI for assigning workflow steps to team members with workload visibility
 */

import { useState, useEffect } from 'react';
import s from '../../app/internal/styles.module.css';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  activeSteps: number;
  completedSteps: number;
  workloadScore: number;
  isOverloaded: boolean;
  skills?: string[];
  averageCompletionTime?: number;
}

interface AssignmentCandidate extends TeamMember {
  score: number;
  reasons: string[];
}

interface StepAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (userId: string) => Promise<void>;
  stepKey: string;
  stepTitle: string;
  processInstanceId: string;
  currentAssigneeId?: string;
  requiredRole?: string;
}

const Icons = {
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  award: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
};

function getWorkloadColor(score: number, isOverloaded: boolean): string {
  if (isOverloaded) return 'var(--int-error)';
  if (score > 80) return 'var(--int-warning)';
  if (score > 50) return 'var(--int-primary)';
  return 'var(--int-success)';
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function StepAssignmentDialog({
  isOpen,
  onClose,
  onAssign,
  stepKey,
  stepTitle,
  processInstanceId,
  currentAssigneeId,
  requiredRole,
}: StepAssignmentDialogProps) {
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<AssignmentCandidate[]>([]);
  const [allMembers, setAllMembers] = useState<TeamMember[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'recommended' | 'all'>('recommended');

  useEffect(() => {
    if (isOpen) {
      fetchCandidates();
    }
  }, [isOpen, stepKey, processInstanceId]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      
      // Fetch recommended candidates
      const candidatesRes = await fetch(
        `/api/internal/process/assignment?type=candidates&stepKey=${stepKey}&processInstanceId=${processInstanceId}`
      );
      if (!candidatesRes.ok) throw new Error('Failed to fetch candidates');
      const candidatesData = await candidatesRes.json();
      setCandidates(candidatesData.candidates || []);

      // Fetch all team members
      const membersRes = await fetch('/api/internal/process/assignment?type=team');
      if (!membersRes.ok) throw new Error('Failed to fetch team members');
      const membersData = await membersRes.json();
      setAllMembers(membersData.members || []);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId) return;
    
    try {
      setAssigning(true);
      await onAssign(selectedUserId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign step');
    } finally {
      setAssigning(false);
    }
  };

  const handleAutoAssign = async () => {
    try {
      setAssigning(true);
      const response = await fetch('/api/internal/process/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto-assign',
          processInstanceId,
          stepKey,
        }),
      });
      
      if (!response.ok) throw new Error('Auto-assignment failed');
      
      const data = await response.json();
      if (data.result?.userId) {
        await onAssign(data.result.userId);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auto-assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  const filteredMembers = allMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className={s.card} style={{ 
        width: '600px', 
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div className={s.cardHeader} style={{ borderBottom: '1px solid var(--int-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className={s.cardIcon} style={{ color: 'var(--int-primary)' }}>{Icons.user}</div>
            <div>
              <h3 className={s.cardTitle} style={{ margin: 0 }}>Assign Step</h3>
              <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>{stepTitle}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--int-text-muted)',
            }}
          >
            {Icons.x}
          </button>
        </div>

        {/* Content */}
        <div className={s.cardBody} style={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className={s.spinner}></div>
              <p style={{ color: 'var(--int-text-muted)', marginTop: '1rem' }}>Finding best matches...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--int-error)' }}>{error}</p>
              <button onClick={fetchCandidates} className={s.btnSecondary} style={{ marginTop: '1rem' }}>
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Quick Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'var(--int-surface)',
                borderRadius: '0.5rem',
              }}>
                <button
                  onClick={handleAutoAssign}
                  className={s.btnPrimary}
                  disabled={assigning}
                  style={{ flex: 1 }}
                >
                  <span className={s.icon}>{Icons.zap}</span>
                  Auto-Assign Best Match
                </button>
              </div>

              {/* View Toggle */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => setViewMode('recommended')}
                  className={viewMode === 'recommended' ? s.btnPrimary : s.btnSecondary}
                  style={{ flex: 1 }}
                >
                  <span className={s.icon}>{Icons.star}</span>
                  Recommended ({candidates.length})
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={viewMode === 'all' ? s.btnPrimary : s.btnSecondary}
                  style={{ flex: 1 }}
                >
                  <span className={s.icon}>{Icons.users}</span>
                  All Members ({allMembers.length})
                </button>
              </div>

              {/* Search (for all members view) */}
              {viewMode === 'all' && (
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={s.input}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <span className={s.icon} style={{ 
                    position: 'absolute', 
                    left: '0.75rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: 'var(--int-text-muted)',
                  }}>
                    {Icons.search}
                  </span>
                </div>
              )}

              {/* Member List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {viewMode === 'recommended' ? (
                  candidates.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--int-text-muted)' }}>
                      No recommended candidates found
                    </div>
                  ) : (
                    candidates.map((candidate, idx) => (
                      <div
                        key={candidate.id}
                        onClick={() => setSelectedUserId(candidate.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1rem',
                          background: selectedUserId === candidate.id ? 'var(--int-primary-bg)' : 'var(--int-surface)',
                          border: selectedUserId === candidate.id ? '2px solid var(--int-primary)' : '2px solid transparent',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {/* Rank Badge */}
                        {idx < 3 && (
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: idx === 0 ? 'var(--int-warning)' : idx === 1 ? '#94a3b8' : '#cd7f32',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                          }}>
                            {idx + 1}
                          </div>
                        )}

                        {/* Avatar */}
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--int-primary)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                        }}>
                          {getInitials(candidate.name)}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {candidate.name}
                            {candidate.id === currentAssigneeId && (
                              <span className={`${s.badge} ${s.badgeDefault}`}>Current</span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
                            {candidate.role} • {candidate.activeSteps} active steps
                          </div>
                          {candidate.reasons.length > 0 && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--int-success)', marginTop: '0.25rem' }}>
                              {candidate.reasons[0]}
                            </div>
                          )}
                        </div>

                        {/* Workload Bar */}
                        <div style={{ width: '80px' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '0.25rem' }}>
                            Workload
                          </div>
                          <div style={{ 
                            width: '100%', 
                            height: '6px', 
                            background: 'var(--int-border)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}>
                            <div style={{ 
                              width: `${Math.min(100, candidate.workloadScore)}%`,
                              height: '100%',
                              background: getWorkloadColor(candidate.workloadScore, candidate.isOverloaded),
                            }} />
                          </div>
                        </div>

                        {/* Score */}
                        <div style={{
                          padding: '0.5rem 0.75rem',
                          background: 'var(--int-bg)',
                          borderRadius: '0.375rem',
                          fontWeight: 600,
                          color: 'var(--int-primary)',
                        }}>
                          {candidate.score}%
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  filteredMembers.map(member => (
                    <div
                      key={member.id}
                      onClick={() => setSelectedUserId(member.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem',
                        background: selectedUserId === member.id ? 'var(--int-primary-bg)' : 'var(--int-surface)',
                        border: selectedUserId === member.id ? '2px solid var(--int-primary)' : '2px solid transparent',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--int-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}>
                        {getInitials(member.name)}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {member.name}
                          {member.id === currentAssigneeId && (
                            <span className={`${s.badge} ${s.badgeDefault}`}>Current</span>
                          )}
                          {member.isOverloaded && (
                            <span className={`${s.badge} ${s.badgeDanger}`}>Overloaded</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
                          {member.role} • {member.activeSteps} active
                        </div>
                      </div>

                      {/* Workload */}
                      <div style={{ 
                        width: '60px', 
                        height: '6px', 
                        background: 'var(--int-border)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}>
                        <div style={{ 
                          width: `${Math.min(100, member.workloadScore)}%`,
                          height: '100%',
                          background: getWorkloadColor(member.workloadScore, member.isOverloaded),
                        }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderTop: '1px solid var(--int-border)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
        }}>
          <button onClick={onClose} className={s.btnSecondary} disabled={assigning}>
            Cancel
          </button>
          <button 
            onClick={handleAssign} 
            className={s.btnPrimary}
            disabled={!selectedUserId || assigning}
          >
            {assigning ? (
              <>
                <span className={s.spinner} style={{ width: '16px', height: '16px' }}></span>
                Assigning...
              </>
            ) : (
              <>
                <span className={s.icon}>{Icons.check}</span>
                Assign Selected
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
