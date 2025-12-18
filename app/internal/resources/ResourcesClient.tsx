'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import s from '../styles.module.css';

// Icons
const Icons = {
  chevronDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  filter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  list: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  trendUp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  barChart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
};

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
}

interface TaskStats {
  total: number;
  inProgress: number;
  blocked: number;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority?: string;
  dueAt?: Date | null;
}

interface ResourceUser extends User {
  taskStats: TaskStats;
  tasks: Task[];
  projectCount: number;
  workloadLevel: string;
  workloadColor: string;
  roleBg: string;
  roleColor: string;
  skills?: string[];
  availability?: number;
  completedThisWeek?: number;
  avgCycleTime?: number;
}

interface ResourcesClientProps {
  users: ResourceUser[];
  showCapacityPlanner?: boolean;
}

type ViewMode = 'list' | 'grid' | 'heatmap';
type FilterRole = 'all' | 'admin' | 'pm' | 'dev' | 'qa' | 'viewer';
type SortOption = 'workload' | 'name' | 'tasks' | 'projects';

export default function ResourcesClient({ users, showCapacityPlanner = false }: ResourcesClientProps) {
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterRole, setFilterRole] = useState<FilterRole>('all');
  const [sortBy, setSortBy] = useState<SortOption>('workload');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCapacity, setShowCapacity] = useState(false);

  const toggleUser = (userId: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      todo: '#6b7280',
      in_progress: '#3b82f6',
      blocked: '#ef4444',
      done: '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      critical: '#dc2626',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#6b7280',
    };
    return colors[priority] || '#6b7280';
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u => 
        (u.name?.toLowerCase().includes(query)) ||
        u.email.toLowerCase().includes(query) ||
        u.role?.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      result = result.filter(u => u.role === filterRole);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || a.email).localeCompare(b.name || b.email);
        case 'tasks':
          return b.taskStats.total - a.taskStats.total;
        case 'projects':
          return b.projectCount - a.projectCount;
        case 'workload':
        default:
          return b.taskStats.total - a.taskStats.total;
      }
    });

    return result;
  }, [users, searchQuery, filterRole, sortBy]);

  // Calculate capacity metrics
  const capacityMetrics = useMemo(() => {
    const totalCapacity = users.length * 10; // Assume 10 tasks per person max
    const totalAssigned = users.reduce((sum, u) => sum + u.taskStats.total, 0);
    const utilization = Math.round((totalAssigned / totalCapacity) * 100);
    const available = users.filter(u => u.taskStats.total < 5).length;
    const overloaded = users.filter(u => u.taskStats.total >= 10).length;
    
    return { totalCapacity, totalAssigned, utilization, available, overloaded };
  }, [users]);

  // Workload distribution for heatmap
  const workloadDistribution = useMemo(() => {
    const buckets = { light: 0, normal: 0, high: 0, critical: 0 };
    users.forEach(u => {
      if (u.taskStats.total < 3) buckets.light++;
      else if (u.taskStats.total < 7) buckets.normal++;
      else if (u.taskStats.total < 12) buckets.high++;
      else buckets.critical++;
    });
    return buckets;
  }, [users]);

  // Get current week dates for capacity calendar
  const getCurrentWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getCurrentWeekDates();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Controls Bar */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '1rem', 
        alignItems: 'center',
        padding: '1rem',
        background: 'var(--int-bg-alt, #f9fafb)',
        borderRadius: '12px',
        border: '1px solid var(--int-border, #e5e7eb)',
      }}>
        {/* Search */}
        <div style={{ 
          position: 'relative', 
          flex: '1 1 200px',
          minWidth: '200px',
        }}>
          <span style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: 'var(--int-text-muted)',
          }}>
            {Icons.search}
          </span>
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem 0.625rem 2.25rem',
              border: '1px solid var(--int-border, #e5e7eb)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              background: 'var(--int-bg, #fff)',
            }}
          />
        </div>

        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as FilterRole)}
          style={{
            padding: '0.625rem 0.75rem',
            border: '1px solid var(--int-border, #e5e7eb)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            background: 'var(--int-bg, #fff)',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="pm">PM</option>
          <option value="dev">Developer</option>
          <option value="qa">QA</option>
          <option value="viewer">Viewer</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          style={{
            padding: '0.625rem 0.75rem',
            border: '1px solid var(--int-border, #e5e7eb)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            background: 'var(--int-bg, #fff)',
            cursor: 'pointer',
          }}
        >
          <option value="workload">Sort: Workload</option>
          <option value="name">Sort: Name</option>
          <option value="tasks">Sort: Tasks</option>
          <option value="projects">Sort: Projects</option>
        </select>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--int-bg, #fff)', borderRadius: '8px', padding: '0.25rem', border: '1px solid var(--int-border, #e5e7eb)' }}>
          {[
            { mode: 'list' as ViewMode, icon: Icons.list, label: 'List View' },
            { mode: 'grid' as ViewMode, icon: Icons.grid, label: 'Grid View' },
            { mode: 'heatmap' as ViewMode, icon: Icons.barChart, label: 'Heatmap' },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={label}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === mode ? 'var(--int-primary, #3b82f6)' : 'transparent',
                color: viewMode === mode ? '#fff' : 'var(--int-text-muted)',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ width: '16px', height: '16px' }}>{icon}</span>
            </button>
          ))}
        </div>

        {/* Capacity Calendar Toggle */}
        <button
          onClick={() => setShowCapacity(!showCapacity)}
          style={{
            padding: '0.625rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--int-border, #e5e7eb)',
            background: showCapacity ? 'var(--int-primary, #3b82f6)' : 'var(--int-bg, #fff)',
            color: showCapacity ? '#fff' : 'var(--int-text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <span style={{ width: '16px', height: '16px' }}>{Icons.calendar}</span>
          Capacity View
        </button>
      </div>

      {/* Capacity Metrics Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
      }}>
        <div className={s.card} style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '0.25rem' }}>Team Utilization</div>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: 700,
            color: capacityMetrics.utilization > 80 ? 'var(--int-error)' : capacityMetrics.utilization > 60 ? 'var(--int-warning)' : 'var(--int-success)',
          }}>
            {capacityMetrics.utilization}%
          </div>
          <div style={{ marginTop: '0.5rem', height: '6px', background: 'var(--int-bg-alt)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${Math.min(capacityMetrics.utilization, 100)}%`, 
              height: '100%',
              background: capacityMetrics.utilization > 80 ? 'var(--int-error)' : capacityMetrics.utilization > 60 ? 'var(--int-warning)' : 'var(--int-success)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        <div className={s.card} style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '0.25rem' }}>Available</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--int-success)' }}>
            {capacityMetrics.available}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Team members</div>
        </div>

        <div className={s.card} style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '0.25rem' }}>Assigned</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {capacityMetrics.totalAssigned}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Total tasks</div>
        </div>

        <div className={s.card} style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '0.25rem' }}>Overloaded</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: capacityMetrics.overloaded > 0 ? 'var(--int-error)' : 'var(--int-text)' }}>
            {capacityMetrics.overloaded}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Need help</div>
        </div>
      </div>

      {/* Capacity Calendar View */}
      {showCapacity && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '20px', height: '20px' }}>{Icons.calendar}</span>
              Team Capacity Calendar
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>
              Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className={s.cardBody} style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--int-border)', width: '180px' }}>Team Member</th>
                  {weekDates.map((date, i) => (
                    <th 
                      key={i} 
                      style={{ 
                        textAlign: 'center', 
                        padding: '0.75rem', 
                        borderBottom: '1px solid var(--int-border)',
                        background: date.getDay() === 0 || date.getDay() === 6 ? 'var(--int-bg-alt)' : 'transparent',
                        minWidth: '80px',
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>{date.getDate()}</div>
                    </th>
                  ))}
                  <th style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid var(--int-border)' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  // Simulate daily task distribution (in real app, this would come from DB)
                  const dailyTasks = weekDates.map((_, i) => {
                    if (i === 0 || i === 6) return 0; // Weekend
                    return Math.floor(user.taskStats.total / 5); // Distribute across weekdays
                  });
                  
                  return (
                    <tr key={user.id}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--int-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--int-bg-alt)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}>
                            {(user.name || user.email).substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{user.name || user.email.split('@')[0]}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>{user.role || 'viewer'}</div>
                          </div>
                        </div>
                      </td>
                      {dailyTasks.map((count, i) => {
                        const intensity = count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : 3;
                        const colors = ['transparent', 'rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.5)', 'rgba(239, 68, 68, 0.6)'];
                        
                        return (
                          <td 
                            key={i}
                            style={{ 
                              textAlign: 'center', 
                              padding: '0.5rem',
                              borderBottom: '1px solid var(--int-border)',
                              background: weekDates[i].getDay() === 0 || weekDates[i].getDay() === 6 ? 'var(--int-bg-alt)' : colors[intensity],
                            }}
                          >
                            {count > 0 ? (
                              <span style={{ 
                                display: 'inline-block',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                              }}>
                                {count}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--int-text-muted)' }}>—</span>
                            )}
                          </td>
                        );
                      })}
                      <td style={{ 
                        textAlign: 'center', 
                        padding: '0.75rem', 
                        borderBottom: '1px solid var(--int-border)',
                        fontWeight: 600,
                      }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          background: user.workloadColor,
                          color: '#fff',
                          fontSize: '0.75rem',
                        }}>
                          {user.taskStats.total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Heatmap View */}
      {viewMode === 'heatmap' && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '20px', height: '20px' }}>{Icons.barChart}</span>
              Workload Distribution Heatmap
            </h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Light (0-2)', count: workloadDistribution.light, color: 'var(--int-success)', pct: Math.round((workloadDistribution.light / users.length) * 100) },
                { label: 'Normal (3-6)', count: workloadDistribution.normal, color: 'var(--int-info)', pct: Math.round((workloadDistribution.normal / users.length) * 100) },
                { label: 'High (7-11)', count: workloadDistribution.high, color: 'var(--int-warning)', pct: Math.round((workloadDistribution.high / users.length) * 100) },
                { label: 'Critical (12+)', count: workloadDistribution.critical, color: 'var(--int-error)', pct: Math.round((workloadDistribution.critical / users.length) * 100) },
              ].map((bucket) => (
                <div key={bucket.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '0.5rem' }}>{bucket.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: bucket.color }}>{bucket.count}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>{bucket.pct}%</div>
                </div>
              ))}
            </div>

            {/* Visual Heatmap Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
              gap: '0.5rem',
              padding: '1rem',
              background: 'var(--int-bg-alt)',
              borderRadius: '8px',
            }}>
              {filteredUsers.map((user) => {
                const intensity = user.taskStats.total < 3 ? 0.2 : user.taskStats.total < 7 ? 0.4 : user.taskStats.total < 12 ? 0.7 : 1;
                const hue = user.taskStats.total < 7 ? 200 : user.taskStats.total < 12 ? 45 : 0;
                
                return (
                  <div
                    key={user.id}
                    title={`${user.name || user.email}: ${user.taskStats.total} tasks`}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '8px',
                      background: `hsla(${hue}, 80%, 50%, ${intensity})`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onClick={() => toggleUser(user.id)}
                  >
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      color: intensity > 0.5 ? '#fff' : 'inherit',
                    }}>
                      {(user.name || user.email).substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ 
                      fontSize: '1rem', 
                      fontWeight: 700,
                      color: intensity > 0.5 ? '#fff' : 'inherit',
                    }}>
                      {user.taskStats.total}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1rem' 
        }}>
          {filteredUsers.map((user) => (
            <div key={user.id} className={s.card} style={{ borderLeft: `4px solid ${user.workloadColor}` }}>
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--int-bg-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                    }}>
                      {(user.name || user.email).substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.name || user.email.split('@')[0]}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                  <span
                    className={s.badge}
                    style={{ background: user.roleBg, color: user.roleColor, fontSize: '0.625rem' }}
                  >
                    {user.role || 'viewer'}
                  </span>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '0.5rem', background: 'var(--int-bg-alt)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.taskStats.total}</div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--int-text-muted)' }}>Tasks</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem', background: 'var(--int-bg-alt)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.projectCount}</div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--int-text-muted)' }}>Projects</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem', background: 'var(--int-bg-alt)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: user.taskStats.blocked > 0 ? 'var(--int-error)' : 'inherit' }}>
                      {user.taskStats.blocked}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--int-text-muted)' }}>Blocked</div>
                  </div>
                </div>

                {/* Workload Bar */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span>Workload</span>
                    <span style={{ color: user.workloadColor, fontWeight: 500 }}>{user.workloadLevel}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--int-bg-alt)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min((user.taskStats.total / 15) * 100, 100)}%`,
                      height: '100%',
                      background: user.workloadColor,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>

                <Link
                  href={`/internal/tasks?assignee=${user.id}`}
                  className={s.btnSecondary}
                  style={{ width: '100%', display: 'block', textAlign: 'center', fontSize: '0.875rem' }}
                >
                  View Tasks
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredUsers.map((user) => (
            <div key={user.id} className={s.card}>
              <button
                onClick={() => toggleUser(user.id)}
                className={s.cardHeader}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '1rem',
                  borderLeftWidth: '4px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: user.workloadColor,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'var(--int-bg-alt)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}>
                    {(user.name || user.email).substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {user.name || user.email.split('@')[0]}
                      <span
                        className={s.badge}
                        style={{ marginLeft: '0.5rem', background: user.roleBg, color: user.roleColor, fontSize: '0.625rem' }}
                      >
                        {user.role || 'viewer'}
                      </span>
                    </div>
                    <div className={s.textMuted} style={{ fontSize: '0.75rem' }}>{user.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.taskStats.total}</div>
                      <div className={s.textMuted} style={{ fontSize: '0.625rem' }}>Tasks</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ width: '14px', height: '14px', opacity: 0.6 }}>{Icons.folder}</span>
                        {user.projectCount}
                      </div>
                      <div className={s.textMuted} style={{ fontSize: '0.625rem' }}>Projects</div>
                    </div>
                    {user.taskStats.inProgress > 0 && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--int-info)' }}>{user.taskStats.inProgress}</div>
                        <div className={s.textMuted} style={{ fontSize: '0.625rem' }}>Active</div>
                      </div>
                    )}
                    {user.taskStats.blocked > 0 && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--int-error)' }}>{user.taskStats.blocked}</div>
                        <div className={s.textMuted} style={{ fontSize: '0.625rem' }}>Blocked</div>
                      </div>
                    )}
                    <span
                      className={s.badge}
                      style={{ background: user.workloadColor, color: '#fff' }}
                    >
                      {user.workloadLevel}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    transform: expandedUsers.has(user.id) ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                    width: '20px',
                    height: '20px',
                    color: 'var(--int-text-muted)',
                  }}
                >
                  {Icons.chevronDown}
                </span>
              </button>
              
              {expandedUsers.has(user.id) && (
                <div className={s.cardBody} style={{ padding: 0, borderTop: '1px solid var(--int-border)' }}>
                  {user.tasks.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                      No active tasks
                    </div>
                  ) : (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {user.tasks.map((task, idx) => (
                        <li
                          key={task.id}
                          style={{
                            padding: '0.75rem 1rem',
                            borderBottom: idx < user.tasks.length - 1 ? '1px solid var(--int-border)' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <Link
                            href={`/internal/tasks/${task.id}`}
                            style={{
                              flex: 1,
                              color: 'inherit',
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                            }}
                          >
                            {task.title}
                          </Link>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {task.priority && (
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: getPriorityColor(task.priority),
                                }}
                                title={`Priority: ${task.priority}`}
                              />
                            )}
                            <span
                              className={s.badge}
                              style={{
                                background: getStatusColor(task.status),
                                color: '#fff',
                                fontSize: '0.625rem',
                                flexShrink: 0,
                              }}
                            >
                              {task.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--int-border)' }}>
                    <Link href={`/internal/tasks?assignee=${user.id}`} className={s.btnSecondary} style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                      View All Tasks
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className={s.card} style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: 'var(--int-text-muted)' }}>
            {Icons.users}
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>No team members found</h3>
          <p style={{ color: 'var(--int-text-muted)' }}>
            {searchQuery || filterRole !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'No team members have been added yet'}
          </p>
        </div>
      )}
    </div>
  );
}
