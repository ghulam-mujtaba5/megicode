/**
 * Acquisition Pipeline Client Component
 * 
 * Interactive pipeline visualization showing leads flowing through
 * the acquisition process
 */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './acquisition.module.css';

interface Stage {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface PipelineItem {
  id: string;
  totalAmount?: number;
  estimatedBudget?: number;
  [key: string]: any;
}

interface PipelineData {
  [key: string]: PipelineItem[];
}

interface ProcessDefinition {
  key: string;
  name: string;
  lanes: string[];
}

interface AcquisitionPipelineClientProps {
  stages: Stage[];
  data: PipelineData;
  definition: ProcessDefinition;
}

// Icons
const Icons = {
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  building: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  filter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  list: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  expand: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
};

const STAGE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6', text: '#3b82f6' },
  green: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', text: '#10b981' },
  cyan: { bg: 'rgba(6, 182, 212, 0.1)', border: '#06b6d4', text: '#06b6d4' },
  orange: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', text: '#f59e0b' },
  purple: { bg: 'rgba(139, 92, 246, 0.1)', border: '#8b5cf6', text: '#8b5cf6' },
  teal: { bg: 'rgba(20, 184, 166, 0.1)', border: '#14b8a6', text: '#14b8a6' },
};

export default function AcquisitionPipelineClient({
  stages,
  data,
  definition,
}: AcquisitionPipelineClientProps) {
  const [viewMode, setViewMode] = useState<'pipeline' | 'funnel'>('pipeline');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Calculate totals for each stage
  const stageTotals = useMemo(() => {
    const totals: Record<string, { count: number; value: number }> = {};
    stages.forEach(stage => {
      const items = data[stage.key] || [];
      totals[stage.key] = {
        count: items.length,
        value: items.reduce((sum: number, item: PipelineItem) => sum + (item.totalAmount || item.estimatedBudget || 0), 0) / 100,
      };
    });
    return totals;
  }, [stages, data]);

  // Calculate funnel conversion rates
  const funnelRates = useMemo(() => {
    const rates: Record<string, number> = {};
    let prevCount = stageTotals[stages[0]?.key]?.count || 0;
    stages.forEach((stage, idx) => {
      const count = stageTotals[stage.key]?.count || 0;
      if (idx === 0) {
        rates[stage.key] = 100;
      } else {
        rates[stage.key] = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;
      }
      prevCount = count > 0 ? count : prevCount;
    });
    return rates;
  }, [stages, stageTotals]);

  return (
    <div className={styles.pipelineContainer}>
      {/* View Mode Toggle */}
      <div className={styles.toolbar}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === 'pipeline' ? styles.active : ''}`}
            onClick={() => setViewMode('pipeline')}
          >
            <span className={styles.icon}>{Icons.grid}</span>
            Pipeline
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === 'funnel' ? styles.active : ''}`}
            onClick={() => setViewMode('funnel')}
          >
            <span className={styles.icon}>{Icons.filter}</span>
            Funnel
          </button>
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        /* Pipeline View */
        <div className={styles.pipelineGrid}>
          {stages.map((stage, idx) => {
            const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue;
            const items = data[stage.key] || [];
            const total = stageTotals[stage.key];
            const isSelected = selectedStage === stage.key;

            return (
              <div
                key={stage.key}
                className={`${styles.stageColumn} ${isSelected ? styles.selected : ''}`}
                style={{ '--stage-color': colors.border } as React.CSSProperties}
              >
                {/* Stage Header */}
                <div
                  className={styles.stageHeader}
                  onClick={() => setSelectedStage(isSelected ? null : stage.key)}
                  style={{ background: colors.bg, borderColor: colors.border }}
                >
                  <div className={styles.stageIcon} style={{ color: colors.text }}>
                    {stage.icon}
                  </div>
                  <div className={styles.stageInfo}>
                    <h3 className={styles.stageTitle} style={{ color: colors.text }}>{stage.label}</h3>
                    <div className={styles.stageMeta}>
                      <span className={styles.stageCount}>{total.count} items</span>
                      {total.value > 0 && (
                        <span className={styles.stageValue}>${total.value.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stage Items */}
                <div className={styles.stageItems}>
                  {items.length === 0 ? (
                    <div className={styles.emptyStage}>
                      <span style={{ opacity: 0.5 }}>No items</span>
                    </div>
                  ) : (
                    items.slice(0, 5).map((item: PipelineItem) => (
                      <Link
                        key={item.id}
                        href={getItemLink(stage.key, item)}
                        className={styles.pipelineCard}
                        style={{ borderLeft: `3px solid ${colors.border}` }}
                      >
                        <div className={styles.cardHeader}>
                          <span className={styles.cardTitle}>
                            {item.name || item.title || 'Untitled'}
                          </span>
                        </div>
                        {item.company && (
                          <div className={styles.cardMeta}>
                            <span className={styles.icon}>{Icons.building}</span>
                            {item.company}
                          </div>
                        )}
                        {item.totalAmount && (
                          <div className={styles.cardMeta}>
                            <span className={styles.icon}>{Icons.dollar}</span>
                            ${(item.totalAmount / 100).toLocaleString()}
                          </div>
                        )}
                        {item.createdAt && (
                          <div className={styles.cardMeta}>
                            <span className={styles.icon}>{Icons.clock}</span>
                            {formatRelativeTime(new Date(item.createdAt))}
                          </div>
                        )}
                      </Link>
                    ))
                  )}
                  {items.length > 5 && (
                    <Link
                      href={getStageLink(stage.key)}
                      className={styles.showMore}
                    >
                      +{items.length - 5} more
                      <span className={styles.icon}>{Icons.arrowRight}</span>
                    </Link>
                  )}
                </div>

                {/* Stage Arrow (except last) */}
                {idx < stages.length - 1 && (
                  <div className={styles.stageArrow}>
                    <span className={styles.icon}>{Icons.arrowRight}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Funnel View */
        <div className={styles.funnelView}>
          {stages.map((stage, idx) => {
            const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue;
            const total = stageTotals[stage.key];
            const rate = funnelRates[stage.key];
            const maxCount = Math.max(...Object.values(stageTotals).map(t => t.count));
            const widthPercent = maxCount > 0 ? Math.max(20, (total.count / maxCount) * 100) : 20;

            return (
              <div key={stage.key} className={styles.funnelStage}>
                <div className={styles.funnelLabel}>
                  <span className={styles.funnelTitle}>{stage.label}</span>
                  {idx > 0 && (
                    <span className={styles.funnelRate}>{rate}% conversion</span>
                  )}
                </div>
                <div
                  className={styles.funnelBar}
                  style={{
                    width: `${widthPercent}%`,
                    background: `linear-gradient(90deg, ${colors.bg}, ${colors.border}40)`,
                    borderColor: colors.border,
                  }}
                >
                  <span className={styles.funnelCount}>{total.count}</span>
                  {total.value > 0 && (
                    <span className={styles.funnelValue}>${total.value.toLocaleString()}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Process Lanes Legend */}
      <div className={styles.lanesLegend}>
        <h4>Workflow Lanes</h4>
        <div className={styles.lanesList}>
          {definition.lanes.map(lane => (
            <span key={lane} className={styles.laneTag}>
              {lane.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function getItemLink(stageKey: string, item: PipelineItem): string {
  switch (stageKey) {
    case 'new_leads':
    case 'qualified':
    case 'discovery':
    case 'onboarding':
      return `/internal/leads/${item.id}`;
    case 'proposal':
    case 'negotiation':
      return `/internal/proposals/${item.id}`;
    case 'active_project':
      return `/internal/projects/${item.id}`;
    default:
      return `/internal/leads/${item.id}`;
  }
}

function getStageLink(stageKey: string): string {
  switch (stageKey) {
    case 'new_leads':
      return '/internal/leads?status=new';
    case 'qualified':
      return '/internal/leads?status=in_review';
    case 'discovery':
      return '/internal/leads?status=approved';
    case 'proposal':
      return '/internal/proposals?status=draft';
    case 'negotiation':
      return '/internal/proposals?status=sent';
    case 'onboarding':
      return '/internal/leads?status=converted';
    case 'active_project':
      return '/internal/projects?status=in_progress';
    default:
      return '/internal/leads';
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
