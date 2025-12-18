'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import s from '../../styles.module.css';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  filter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  chevronDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  barChart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

interface AuditLog {
  event: {
    id: string;
    type: string;
    createdAt: Date;
    payloadJson: any;
    leadId: string | null;
    projectId: string | null;
    instanceId: string | null;
  };
  actor: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  project: {
    id: string;
    name: string;
  } | null;
  lead: {
    id: string;
    name: string;
  } | null;
  instance: {
    id: string;
    status: string;
  } | null;
}

interface AuditLogClientProps {
  logs: AuditLog[];
  eventTypes: string[];
  users: Array<{
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  }>;
  stats: {
    total: number;
    last24Hours: number;
    last7Days: number;
  };
  currentPage: number;
  hasMore: boolean;
  filters: {
    type: string;
    user: string;
    entity: string;
    from: string;
    to: string;
    search: string;
  };
}

export default function AuditLogClient({
  logs,
  eventTypes,
  users,
  stats,
  currentPage,
  hasMore,
  filters,
}: AuditLogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'timeline' | 'analytics'>('table');
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Update URL with new filters
  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  }, [filters, pathname, router, searchParams]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname);
    setLocalSearch('');
  }, [pathname, router]);

  // Export logs
  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('format', format);
      
      const response = await fetch(`/api/internal/audit/export?${params.toString()}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export logs');
    }
  };

  // Helper to safely stringify payload
  const stringifyPayload = (payload: any) => {
    if (payload === null || payload === undefined) return '';
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return payload;
      }
    }
    return JSON.stringify(payload, null, 2);
  };

  // Group logs by date for timeline view
  const groupedLogs = useMemo(() => {
    const groups = new Map<string, AuditLog[]>();
    
    logs.forEach((log) => {
      const date = new Date(log.event.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(log);
    });
    
    return Array.from(groups.entries());
  }, [logs]);

  // Event type analytics
  const eventAnalytics = useMemo(() => {
    const counts = new Map<string, number>();
    logs.forEach((log) => {
      counts.set(log.event.type, (counts.get(log.event.type) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [logs]);

  // User activity analytics
  const userAnalytics = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    logs.forEach((log) => {
      if (log.actor) {
        const key = log.actor.id;
        const existing = counts.get(key);
        if (existing) {
          existing.count++;
        } else {
          counts.set(key, {
            name: log.actor.name || log.actor.email,
            count: 1,
          });
        }
      }
    });
    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [logs]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <style jsx>{`
        .auditHeader {
          padding: 24px;
          background: var(--int-bg-primary);
          border-bottom: 1px solid var(--int-border);
        }

        .headerTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .titleSection {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .pageIcon {
          width: 40px;
          height: 40px;
          background: var(--int-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .pageIcon svg {
          width: 20px;
          height: 20px;
        }

        .titleContent h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: var(--int-text-primary);
        }

        .titleContent p {
          margin: 4px 0 0;
          font-size: 14px;
          color: var(--int-text-secondary);
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .viewTabs {
          display: flex;
          gap: 4px;
          background: var(--int-bg-secondary);
          border-radius: 8px;
          padding: 4px;
        }

        .viewTab {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: var(--int-text-secondary);
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .viewTab:hover {
          background: var(--int-bg-tertiary);
        }

        .viewTab.active {
          background: var(--int-primary);
          color: white;
        }

        .statsRow {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .statCard {
          background: var(--int-bg-secondary);
          border: 1px solid var(--int-border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .statIcon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .statIcon svg {
          width: 20px;
          height: 20px;
        }

        .statContent {
          flex: 1;
        }

        .statLabel {
          font-size: 12px;
          color: var(--int-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .statValue {
          font-size: 24px;
          font-weight: 700;
          color: var(--int-text-primary);
        }

        .filterBar {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .searchBox {
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .searchInput {
          width: 100%;
          padding: 10px 36px 10px 12px;
          border: 1px solid var(--int-border);
          border-radius: 8px;
          background: var(--int-bg-secondary);
          color: var(--int-text-primary);
          font-size: 14px;
        }

        .searchInput::placeholder {
          color: var(--int-text-tertiary);
        }

        .searchIcon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: var(--int-text-tertiary);
          pointer-events: none;
        }

        .btn {
          padding: 10px 16px;
          border: 1px solid var(--int-border);
          border-radius: 8px;
          background: var(--int-bg-secondary);
          color: var(--int-text-primary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .btn:hover {
          background: var(--int-bg-tertiary);
          border-color: var(--int-primary);
        }

        .btn svg {
          width: 16px;
          height: 16px;
        }

        .btn.primary {
          background: var(--int-primary);
          border-color: var(--int-primary);
          color: white;
        }

        .btn.primary:hover {
          background: var(--int-primary-hover);
        }

        .filterBadge {
          background: var(--int-primary);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
        }

        .filterPanel {
          background: var(--int-bg-secondary);
          border: 1px solid var(--int-border);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .filterGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .filterGroup {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filterLabel {
          font-size: 12px;
          font-weight: 600;
          color: var(--int-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filterSelect {
          padding: 10px 12px;
          border: 1px solid var(--int-border);
          border-radius: 8px;
          background: var(--int-bg-primary);
          color: var(--int-text-primary);
          font-size: 14px;
        }

        .filterActions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .contentArea {
          padding: 24px;
        }

        .logTable {
          background: var(--int-bg-primary);
          border: 1px solid var(--int-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .logTable table {
          width: 100%;
          border-collapse: collapse;
        }

        .logTable th {
          background: var(--int-bg-secondary);
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: var(--int-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--int-border);
        }

        .logTable td {
          padding: 16px;
          border-bottom: 1px solid var(--int-border-light);
          color: var(--int-text-primary);
        }

        .logTable tr:hover {
          background: var(--int-bg-secondary);
        }

        .logTable tr:last-child td {
          border-bottom: none;
        }

        .eventType {
          display: inline-block;
          font-family: 'Monaco', 'Courier New', monospace;
          background: var(--int-surface-muted);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .userCell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .userAvatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--int-bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .userAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .userAvatar svg {
          width: 16px;
          height: 16px;
          color: var(--int-text-tertiary);
        }

        .userName {
          font-weight: 500;
        }

        .userEmail {
          font-size: 12px;
          color: var(--int-text-secondary);
        }

        .entityLink {
          color: var(--int-primary);
          text-decoration: none;
          font-weight: 500;
        }

        .entityLink:hover {
          text-decoration: underline;
        }

        .detailsCell {
          max-width: 400px;
        }

        .detailsPreview {
          font-size: 13px;
          color: var(--int-text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }

        .detailsPreview:hover {
          color: var(--int-primary);
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .timelineDay {
          position: relative;
        }

        .dayHeader {
          font-size: 14px;
          font-weight: 600;
          color: var(--int-text-secondary);
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--int-border);
        }

        .timelineItems {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          padding-left: 32px;
        }

        .timelineItems::before {
          content: '';
          position: absolute;
          left: 14px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--int-border);
        }

        .timelineItem {
          position: relative;
          background: var(--int-bg-primary);
          border: 1px solid var(--int-border);
          border-radius: 12px;
          padding: 16px;
        }

        .timelineItem::before {
          content: '';
          position: absolute;
          left: -26px;
          top: 24px;
          width: 12px;
          height: 12px;
          background: var(--int-primary);
          border-radius: 50%;
          border: 3px solid var(--int-bg-secondary);
        }

        .timelineHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .timelineType {
          font-family: 'Monaco', 'Courier New', monospace;
          background: var(--int-surface-muted);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
        }

        .timelineTime {
          font-size: 12px;
          color: var(--int-text-tertiary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .timelineTime svg {
          width: 12px;
          height: 12px;
        }

        .timelineContent {
          color: var(--int-text-secondary);
          font-size: 14px;
        }

        .analytics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .analyticsCard {
          background: var(--int-bg-primary);
          border: 1px solid var(--int-border);
          border-radius: 12px;
          padding: 20px;
        }

        .analyticsHeader {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--int-border);
        }

        .analyticsIcon {
          width: 32px;
          height: 32px;
          background: var(--int-primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .analyticsIcon svg {
          width: 16px;
          height: 16px;
        }

        .analyticsTitle {
          font-size: 16px;
          font-weight: 600;
          color: var(--int-text-primary);
        }

        .analyticsItems {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .analyticsItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          background: var(--int-bg-secondary);
          border-radius: 8px;
        }

        .analyticsLabel {
          font-size: 14px;
          color: var(--int-text-primary);
        }

        .analyticsValue {
          font-size: 16px;
          font-weight: 600;
          color: var(--int-primary);
        }

        .analyticsBar {
          height: 6px;
          background: var(--int-bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 6px;
        }

        .analyticsBarFill {
          height: 100%;
          background: var(--int-primary);
          transition: width 0.3s ease;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: var(--int-bg-secondary);
          border-top: 1px solid var(--int-border);
        }

        .pageInfo {
          font-size: 14px;
          color: var(--int-text-secondary);
        }

        .pageActions {
          display: flex;
          gap: 8px;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modalContent {
          background: var(--int-bg-primary);
          border: 1px solid var(--int-border);
          border-radius: 12px;
          padding: 24px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow: auto;
        }

        .modalHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--int-border);
        }

        .modalTitle {
          font-size: 18px;
          font-weight: 600;
          color: var(--int-text-primary);
        }

        .closeBtn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--int-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .closeBtn:hover {
          background: var(--int-bg-secondary);
          color: var(--int-text-primary);
        }

        .closeBtn svg {
          width: 16px;
          height: 16px;
        }

        .modalBody {
          font-size: 14px;
          color: var(--int-text-primary);
        }

        .jsonView {
          background: var(--int-bg-secondary);
          padding: 16px;
          border-radius: 8px;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 12px;
          white-space: pre-wrap;
          word-break: break-all;
          overflow-x: auto;
        }

        .emptyState {
          text-align: center;
          padding: 80px 20px;
          color: var(--int-text-secondary);
        }

        .emptyIcon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          opacity: 0.3;
        }

        .emptyIcon svg {
          width: 100%;
          height: 100%;
        }

        .emptyText {
          font-size: 16px;
          margin-bottom: 8px;
        }

        .emptyHint {
          font-size: 14px;
          color: var(--int-text-tertiary);
        }
      `}</style>

      <div className="auditHeader">
        <div className="headerTop">
          <div className="titleSection">
            <div className="pageIcon">{Icons.activity}</div>
            <div className="titleContent">
              <h1>Audit Logs</h1>
              <p>Comprehensive system-wide activity tracking and monitoring</p>
            </div>
          </div>
          <div className="headerActions">
            <div className="viewTabs">
              <button
                className={`viewTab ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Table
              </button>
              <button
                className={`viewTab ${viewMode === 'timeline' ? 'active' : ''}`}
                onClick={() => setViewMode('timeline')}
              >
                Timeline
              </button>
              <button
                className={`viewTab ${viewMode === 'analytics' ? 'active' : ''}`}
                onClick={() => setViewMode('analytics')}
              >
                Analytics
              </button>
            </div>
            <button className="btn" onClick={() => handleExport('json')}>
              {Icons.download}
              Export JSON
            </button>
            <button className="btn" onClick={() => handleExport('csv')}>
              {Icons.download}
              Export CSV
            </button>
          </div>
        </div>

        <div className="statsRow">
          <div className="statCard">
            <div className="statIcon" style={{ background: '#3b82f6' }}>
              {Icons.zap}
            </div>
            <div className="statContent">
              <div className="statLabel">Total Events</div>
              <div className="statValue">{stats.total.toLocaleString()}</div>
            </div>
          </div>
          <div className="statCard">
            <div className="statIcon" style={{ background: '#10b981' }}>
              {Icons.clock}
            </div>
            <div className="statContent">
              <div className="statLabel">Last 24 Hours</div>
              <div className="statValue">{stats.last24Hours.toLocaleString()}</div>
            </div>
          </div>
          <div className="statCard">
            <div className="statIcon" style={{ background: '#f59e0b' }}>
              {Icons.barChart}
            </div>
            <div className="statContent">
              <div className="statLabel">Last 7 Days</div>
              <div className="statValue">{stats.last7Days.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="filterBar">
          <div className="searchBox">
            <input
              type="text"
              className="searchInput"
              placeholder="Search logs..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateFilters({ search: localSearch });
                }
              }}
            />
            <div className="searchIcon">{Icons.search}</div>
          </div>
          <button
            className="btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {Icons.filter}
            Filters
            {activeFiltersCount > 0 && (
              <div className="filterBadge">{activeFiltersCount}</div>
            )}
          </button>
          {activeFiltersCount > 0 && (
            <button className="btn" onClick={clearFilters}>
              {Icons.x}
              Clear All
            </button>
          )}
          <button className="btn" onClick={() => router.refresh()}>
            {Icons.refresh}
          </button>
        </div>

        {showFilters && (
          <div className="filterPanel">
            <div className="filterGrid">
              <div className="filterGroup">
                <label className="filterLabel">Event Type</label>
                <select
                  className="filterSelect"
                  value={filters.type}
                  onChange={(e) => updateFilters({ type: e.target.value })}
                >
                  <option value="">All Types</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filterGroup">
                <label className="filterLabel">User</label>
                <select
                  className="filterSelect"
                  value={filters.user}
                  onChange={(e) => updateFilters({ user: e.target.value })}
                >
                  <option value="">All Users</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filterGroup">
                <label className="filterLabel">Entity Type</label>
                <select
                  className="filterSelect"
                  value={filters.entity}
                  onChange={(e) => updateFilters({ entity: e.target.value })}
                >
                  <option value="">All Entities</option>
                  <option value="lead">Lead</option>
                  <option value="project">Project</option>
                  <option value="instance">Process Instance</option>
                </select>
              </div>
              <div className="filterGroup">
                <label className="filterLabel">Date From</label>
                <input
                  type="date"
                  className="filterSelect"
                  value={filters.from}
                  onChange={(e) => updateFilters({ from: e.target.value })}
                />
              </div>
              <div className="filterGroup">
                <label className="filterLabel">Date To</label>
                <input
                  type="date"
                  className="filterSelect"
                  value={filters.to}
                  onChange={(e) => updateFilters({ to: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="contentArea">
        {viewMode === 'table' && (
          <>
            {logs.length > 0 ? (
              <div className="logTable">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '180px' }}>Timestamp</th>
                      <th style={{ width: '200px' }}>Event Type</th>
                      <th style={{ width: '200px' }}>Actor</th>
                      <th style={{ width: '180px' }}>Entity</th>
                      <th>Details</th>
                      <th style={{ width: '80px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(({ event, actor, project, lead, instance }) => (
                      <tr key={event.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {formatDateTime(event.createdAt)}
                        </td>
                        <td>
                          <span className="eventType">{event.type}</span>
                        </td>
                        <td>
                          {actor ? (
                            <div className="userCell">
                              <div className="userAvatar">
                                {actor.image ? (
                                  <img src={actor.image} alt={actor.name || ''} />
                                ) : (
                                  Icons.user
                                )}
                              </div>
                              <div>
                                <div className="userName">
                                  {actor.name || 'Unknown'}
                                </div>
                                <div className="userEmail">{actor.email}</div>
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--int-text-tertiary)' }}>
                              System
                            </span>
                          )}
                        </td>
                        <td>
                          {project && (
                            <Link
                              href={`/internal/projects/${project.id}`}
                              className="entityLink"
                            >
                              {project.name}
                            </Link>
                          )}
                          {lead && (
                            <Link
                              href={`/internal/leads/${lead.id}`}
                              className="entityLink"
                            >
                              {lead.name}
                            </Link>
                          )}
                          {instance && (
                            <Link
                              href={`/internal/admin/process/${instance.id}`}
                              className="entityLink"
                            >
                              Instance {instance.id.slice(0, 8)}
                            </Link>
                          )}
                          {!project && !lead && !instance && (
                            <span style={{ color: 'var(--int-text-tertiary)' }}>
                              —
                            </span>
                          )}
                        </td>
                        <td className="detailsCell">
                          <div
                            className="detailsPreview"
                            onClick={() => setSelectedLog(event.id)}
                          >
                            {stringifyPayload(event.payloadJson).substring(0, 100)}
                            {stringifyPayload(event.payloadJson).length > 100 &&
                              '...'}
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn"
                            style={{ padding: '6px 12px' }}
                            onClick={() => setSelectedLog(event.id)}
                          >
                            {Icons.eye}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="emptyState">
                <div className="emptyIcon">{Icons.activity}</div>
                <div className="emptyText">No audit logs found</div>
                <div className="emptyHint">
                  Try adjusting your filters or check back later
                </div>
              </div>
            )}
          </>
        )}

        {viewMode === 'timeline' && (
          <div className="timeline">
            {groupedLogs.length > 0 ? (
              groupedLogs.map(([date, dayLogs]) => (
                <div key={date} className="timelineDay">
                  <div className="dayHeader">{date}</div>
                  <div className="timelineItems">
                    {dayLogs.map(({ event, actor, project, lead }) => (
                      <div key={event.id} className="timelineItem">
                        <div className="timelineHeader">
                          <span className="timelineType">{event.type}</span>
                          <div className="timelineTime">
                            {Icons.clock}
                            {new Date(event.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <div className="timelineContent">
                          <strong>
                            {actor?.name || actor?.email || 'System'}
                          </strong>{' '}
                          performed action on{' '}
                          {project && (
                            <Link
                              href={`/internal/projects/${project.id}`}
                              className="entityLink"
                            >
                              {project.name}
                            </Link>
                          )}
                          {lead && (
                            <Link
                              href={`/internal/leads/${lead.id}`}
                              className="entityLink"
                            >
                              {lead.name}
                            </Link>
                          )}
                          {!project && !lead && 'the system'}
                        </div>
                        {event.payloadJson && (
                          <div style={{ marginTop: '12px' }}>
                            <div
                              className="detailsPreview"
                              onClick={() => setSelectedLog(event.id)}
                            >
                              View details →
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="emptyState">
                <div className="emptyIcon">{Icons.activity}</div>
                <div className="emptyText">No activity to display</div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="analytics">
            <div className="analyticsCard">
              <div className="analyticsHeader">
                <div className="analyticsIcon">{Icons.barChart}</div>
                <div className="analyticsTitle">Top Event Types</div>
              </div>
              <div className="analyticsItems">
                {eventAnalytics.map(([type, count]) => {
                  const maxCount = Math.max(...eventAnalytics.map((e) => e[1]));
                  const percentage = (count / maxCount) * 100;
                  return (
                    <div key={type}>
                      <div className="analyticsItem">
                        <div className="analyticsLabel">{type}</div>
                        <div className="analyticsValue">{count}</div>
                      </div>
                      <div className="analyticsBar">
                        <div
                          className="analyticsBarFill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="analyticsCard">
              <div className="analyticsHeader">
                <div className="analyticsIcon">{Icons.user}</div>
                <div className="analyticsTitle">Most Active Users</div>
              </div>
              <div className="analyticsItems">
                {userAnalytics.map(({ name, count }) => {
                  const maxCount = Math.max(...userAnalytics.map((u) => u.count));
                  const percentage = (count / maxCount) * 100;
                  return (
                    <div key={name}>
                      <div className="analyticsItem">
                        <div className="analyticsLabel">{name}</div>
                        <div className="analyticsValue">{count}</div>
                      </div>
                      <div className="analyticsBar">
                        <div
                          className="analyticsBarFill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {(hasMore || currentPage > 1) && (
        <div className="pagination">
          <div className="pageInfo">
            Page {currentPage} {hasMore && '(More results available)'}
          </div>
          <div className="pageActions">
            {currentPage > 1 && (
              <Link
                href={`${pathname}?${new URLSearchParams({ ...filters, page: String(currentPage - 1) }).toString()}`}
                className="btn"
              >
                Previous
              </Link>
            )}
            {hasMore && (
              <Link
                href={`${pathname}?${new URLSearchParams({ ...filters, page: String(currentPage + 1) }).toString()}`}
                className="btn primary"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}

      {selectedLog && (
        <div className="modal" onClick={() => setSelectedLog(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div className="modalTitle">Event Details</div>
              <button className="closeBtn" onClick={() => setSelectedLog(null)}>
                {Icons.x}
              </button>
            </div>
            <div className="modalBody">
              {(() => {
                const log = logs.find((l) => l.event.id === selectedLog);
                if (!log) return null;

                return (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--int-text-secondary)', marginBottom: '4px' }}>Event Type</div>
                      <div className="eventType">{log.event.type}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--int-text-secondary)', marginBottom: '4px' }}>Timestamp</div>
                      <div>{formatDateTime(log.event.createdAt)}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--int-text-secondary)', marginBottom: '4px' }}>Actor</div>
                      <div>
                        {log.actor
                          ? `${log.actor.name || 'Unknown'} (${log.actor.email})`
                          : 'System'}
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--int-text-secondary)', marginBottom: '4px' }}>Payload</div>
                      <div className="jsonView">
                        {stringifyPayload(log.event.payloadJson)}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
