/**
 * ProcessFlowchart - Interactive BPMN Flowchart Visualization
 * 
 * Modern, animated swimlane diagram with:
 * - SVG-based rendering
 * - Interactive nodes
 * - Animated transitions
 * - Zoom and pan controls
 * - Step highlighting
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ProcessFlowchart.module.css';

// Step types with their visual representations
const STEP_ICONS: Record<string, string> = {
  startEvent: '▶',
  endEvent: '⬛',
  task: '☐',
  userTask: '👤',
  serviceTask: '⚙',
  gateway: '◇',
  messageEvent: '✉',
};

const LANE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Client: { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6', text: '#3b82f6' },
  BusinessDevelopment: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', text: '#10b981' },
  AutomationCRM: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', text: '#f59e0b' },
  ProjectManagement: { bg: 'rgba(139, 92, 246, 0.1)', border: '#8b5cf6', text: '#8b5cf6' },
  Development: { bg: 'rgba(6, 182, 212, 0.1)', border: '#06b6d4', text: '#06b6d4' },
};

interface ProcessStep {
  key: string;
  title: string;
  type: string;
  lane: string;
  nextSteps: string[];
  description?: string;
  automations?: Array<{ action: string }>;
}

interface Lane {
  key: string;
  displayName: string;
}

interface ProcessFlowchartProps {
  steps: ProcessStep[];
  lanes: Lane[];
  currentStepKey?: string;
  completedSteps?: string[];
  onStepClick?: (stepKey: string) => void;
  simulationMode?: boolean;
  animatingStep?: string | null;
}

// Calculate node positions in a grid layout
function calculateNodePositions(steps: ProcessStep[], lanes: Lane[]) {
  const laneIndex: Record<string, number> = {};
  lanes.forEach((lane, idx) => {
    laneIndex[lane.key] = idx;
  });

  // Group steps by lane and calculate x positions based on flow order
  const positions: Record<string, { x: number; y: number; lane: string }> = {};
  const laneXCounters: Record<string, number> = {};
  lanes.forEach(lane => { laneXCounters[lane.key] = 0; });

  // BFS to determine horizontal positions
  const visited = new Set<string>();
  const queue: string[] = [];
  
  // Find start event
  const startStep = steps.find(s => s.type === 'startEvent' || s.type === 'start_event');
  if (startStep) {
    queue.push(startStep.key);
  }

  let maxX = 0;
  while (queue.length > 0) {
    const key = queue.shift()!;
    if (visited.has(key)) continue;
    visited.add(key);

    const step = steps.find(s => s.key === key);
    if (!step) continue;

    const laneY = laneIndex[step.lane] ?? 0;
    const x = laneXCounters[step.lane];
    laneXCounters[step.lane] += 1;
    maxX = Math.max(maxX, x);

    positions[key] = { x, y: laneY, lane: step.lane };

    step.nextSteps.forEach(nextKey => {
      if (!visited.has(nextKey)) {
        queue.push(nextKey);
      }
    });
  }

  // Handle any unvisited steps
  steps.forEach(step => {
    if (!positions[step.key]) {
      const laneY = laneIndex[step.lane] ?? 0;
      const x = laneXCounters[step.lane];
      laneXCounters[step.lane] += 1;
      positions[step.key] = { x, y: laneY, lane: step.lane };
    }
  });

  return { positions, maxX: maxX + 1 };
}

export function ProcessFlowchart({
  steps,
  lanes,
  currentStepKey,
  completedSteps = [],
  onStepClick,
  simulationMode = false,
  animatingStep,
}: ProcessFlowchartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const { positions, maxX } = calculateNodePositions(steps, lanes);

  // Dimensions
  const nodeWidth = 160;
  const nodeHeight = 60;
  const laneHeight = 120;
  const horizontalGap = 200;
  const verticalPadding = 60;
  const laneHeaderWidth = 180;

  const svgWidth = laneHeaderWidth + (maxX * horizontalGap) + nodeWidth + 100;
  const svgHeight = (lanes.length * laneHeight) + verticalPadding * 2;

  // Get node center position
  const getNodeCenter = (key: string) => {
    const pos = positions[key];
    if (!pos) return { x: 0, y: 0 };
    return {
      x: laneHeaderWidth + pos.x * horizontalGap + nodeWidth / 2 + 50,
      y: verticalPadding + pos.y * laneHeight + laneHeight / 2,
    };
  };

  // Generate connections
  const connections: Array<{ from: string; to: string; fromPos: { x: number; y: number }; toPos: { x: number; y: number } }> = [];
  steps.forEach(step => {
    step.nextSteps.forEach(nextKey => {
      const fromPos = getNodeCenter(step.key);
      const toPos = getNodeCenter(nextKey);
      connections.push({ from: step.key, to: nextKey, fromPos, toPos });
    });
  });

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Get step status
  const getStepStatus = (stepKey: string) => {
    if (animatingStep === stepKey) return 'animating';
    if (currentStepKey === stepKey) return 'current';
    if (completedSteps.includes(stepKey)) return 'completed';
    return 'pending';
  };

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarBtn} onClick={handleZoomOut} title="Zoom Out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="8" y1="11" x2="14" y2="11" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
          <button className={styles.toolbarBtn} onClick={handleZoomIn} title="Zoom In">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className={styles.toolbarBtn} onClick={handleZoomReset} title="Reset View">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
        
        <div className={styles.legend}>
          {Object.entries(LANE_COLORS).map(([lane, colors]) => (
            <div key={lane} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: colors.border }} />
              <span>{lane.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className={styles.canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          className={styles.svg}
        >
          {/* Definitions */}
          <defs>
            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--int-text-muted)" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--int-primary)" />
            </marker>

            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pulse animation */}
            <filter id="pulse">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Lane backgrounds */}
          {lanes.map((lane, idx) => {
            const colors = LANE_COLORS[lane.key] || LANE_COLORS.Client;
            return (
              <g key={lane.key}>
                {/* Lane background */}
                <rect
                  x={0}
                  y={verticalPadding + idx * laneHeight}
                  width={svgWidth}
                  height={laneHeight}
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                {/* Lane header */}
                <rect
                  x={0}
                  y={verticalPadding + idx * laneHeight}
                  width={laneHeaderWidth}
                  height={laneHeight}
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth="1"
                />
                <text
                  x={laneHeaderWidth / 2}
                  y={verticalPadding + idx * laneHeight + laneHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={colors.text}
                  fontSize="14"
                  fontWeight="600"
                  className={styles.laneLabel}
                >
                  {lane.displayName}
                </text>
              </g>
            );
          })}

          {/* Connections */}
          {connections.map(({ from, to, fromPos, toPos }, idx) => {
            const isActive = getStepStatus(from) === 'current' || getStepStatus(from) === 'animating';
            const isCompleted = completedSteps.includes(from) && completedSteps.includes(to);
            
            // Calculate control points for curved lines
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            
            let path: string;
            if (Math.abs(dy) < 10) {
              // Same lane - straight line
              path = `M ${fromPos.x + nodeWidth/2} ${fromPos.y} L ${toPos.x - nodeWidth/2 - 10} ${toPos.y}`;
            } else {
              // Different lanes - curved path
              const midX = (fromPos.x + toPos.x) / 2;
              path = `M ${fromPos.x + nodeWidth/2} ${fromPos.y} 
                      C ${midX} ${fromPos.y}, ${midX} ${toPos.y}, ${toPos.x - nodeWidth/2 - 10} ${toPos.y}`;
            }

            return (
              <g key={`${from}-${to}-${idx}`}>
                <path
                  d={path}
                  fill="none"
                  stroke={isActive ? 'var(--int-primary)' : isCompleted ? 'var(--int-success)' : 'var(--int-border)'}
                  strokeWidth={isActive ? 2 : 1.5}
                  strokeDasharray={isActive ? '5,5' : 'none'}
                  markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  className={isActive ? styles.connectionActive : ''}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {steps.map(step => {
            const pos = positions[step.key];
            if (!pos) return null;

            const x = laneHeaderWidth + pos.x * horizontalGap + 50;
            const y = verticalPadding + pos.y * laneHeight + (laneHeight - nodeHeight) / 2;
            const status = getStepStatus(step.key);
            const colors = LANE_COLORS[step.lane] || LANE_COLORS.Client;
            const isHovered = hoveredStep === step.key;

            // Node shape based on type
            const isGateway = step.type === 'gateway';
            const isEvent = step.type === 'startEvent' || step.type === 'endEvent' || step.type === 'start_event' || step.type === 'end_event';
            const isEndEvent = step.type === 'endEvent' || step.type === 'end_event';

            return (
              <g
                key={step.key}
                transform={`translate(${x}, ${y})`}
                className={`${styles.node} ${styles[`node${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}
                onClick={() => onStepClick?.(step.key)}
                onMouseEnter={() => setHoveredStep(step.key)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{ cursor: onStepClick ? 'pointer' : 'default' }}
                filter={status === 'animating' ? 'url(#pulse)' : undefined}
              >
                {/* Node background */}
                {isGateway ? (
                  <polygon
                    points={`${nodeWidth/2},0 ${nodeWidth},${nodeHeight/2} ${nodeWidth/2},${nodeHeight} 0,${nodeHeight/2}`}
                    fill={status === 'completed' ? 'var(--int-success)' : status === 'current' || status === 'animating' ? colors.border : 'var(--int-surface)'}
                    stroke={colors.border}
                    strokeWidth="2"
                    className={status === 'animating' ? styles.pulseAnimation : ''}
                  />
                ) : isEvent ? (
                  <circle
                    cx={nodeWidth / 2}
                    cy={nodeHeight / 2}
                    r={nodeHeight / 2 - 5}
                    fill={status === 'completed' ? 'var(--int-success)' : status === 'current' || status === 'animating' ? colors.border : 'var(--int-surface)'}
                    stroke={colors.border}
                    strokeWidth={isEndEvent ? 4 : 2}
                    className={status === 'animating' ? styles.pulseAnimation : ''}
                  />
                ) : (
                  <rect
                    width={nodeWidth}
                    height={nodeHeight}
                    rx="8"
                    fill={status === 'completed' ? 'var(--int-success)' : status === 'current' || status === 'animating' ? colors.border : 'var(--int-surface)'}
                    stroke={colors.border}
                    strokeWidth="2"
                    className={status === 'animating' ? styles.pulseAnimation : ''}
                  />
                )}

                {/* Task icon for service tasks */}
                {step.type === 'serviceTask' && (
                  <g transform={`translate(${nodeWidth - 24}, 4)`}>
                    <rect width="20" height="20" rx="4" fill="rgba(0,0,0,0.1)" />
                    <text x="10" y="14" textAnchor="middle" fontSize="12">⚙</text>
                  </g>
                )}

                {/* Node label */}
                <text
                  x={nodeWidth / 2}
                  y={nodeHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={status === 'completed' || status === 'current' || status === 'animating' ? 'white' : 'var(--int-text)'}
                  fontSize="11"
                  fontWeight="500"
                  className={styles.nodeLabel}
                >
                  {step.title.length > 20 ? step.title.substring(0, 18) + '...' : step.title}
                </text>

                {/* Status indicator */}
                {status === 'completed' && (
                  <g transform={`translate(${nodeWidth - 20}, -8)`}>
                    <circle r="10" fill="var(--int-success)" />
                    <text x="0" y="4" textAnchor="middle" fill="white" fontSize="12">✓</text>
                  </g>
                )}

                {/* Current indicator */}
                {(status === 'current' || status === 'animating') && (
                  <circle
                    cx={nodeWidth / 2}
                    cy={nodeHeight + 15}
                    r="4"
                    fill={colors.border}
                    className={styles.currentIndicator}
                  />
                )}

                {/* Hover tooltip */}
                {isHovered && step.description && (
                  <g transform={`translate(0, ${nodeHeight + 25})`}>
                    <rect
                      width={Math.max(nodeWidth, step.description.length * 6)}
                      height="40"
                      rx="4"
                      fill="var(--int-surface)"
                      stroke="var(--int-border)"
                      filter="url(#glow)"
                    />
                    <text
                      x="10"
                      y="25"
                      fill="var(--int-text-muted)"
                      fontSize="10"
                    >
                      {step.description.substring(0, 40)}...
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mini map */}
      <div className={styles.minimap}>
        <svg width="150" height="80" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {lanes.map((lane, idx) => (
            <rect
              key={lane.key}
              x={0}
              y={verticalPadding + idx * laneHeight}
              width={svgWidth}
              height={laneHeight}
              fill={LANE_COLORS[lane.key]?.bg || '#f3f4f6'}
              stroke={LANE_COLORS[lane.key]?.border || '#9ca3af'}
              strokeWidth="2"
            />
          ))}
          {steps.map(step => {
            const pos = positions[step.key];
            if (!pos) return null;
            const x = laneHeaderWidth + pos.x * horizontalGap + 50;
            const y = verticalPadding + pos.y * laneHeight + (laneHeight - nodeHeight) / 2;
            const status = getStepStatus(step.key);
            return (
              <rect
                key={step.key}
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                rx="4"
                fill={status === 'completed' ? 'var(--int-success)' : status === 'current' ? 'var(--int-primary)' : 'var(--int-surface)'}
              />
            );
          })}
          {/* Viewport indicator */}
          <rect
            x={-pan.x / zoom}
            y={-pan.y / zoom}
            width={(containerRef.current?.clientWidth || 800) / zoom}
            height={(containerRef.current?.clientHeight || 400) / zoom}
            fill="none"
            stroke="var(--int-primary)"
            strokeWidth="4"
          />
        </svg>
      </div>
    </div>
  );
}

export default ProcessFlowchart;
