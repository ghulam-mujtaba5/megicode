"use client";

import React from "react";

interface SkeletonProps {
  /** Width - can be number (px) or string (e.g., "100%") */
  width?: number | string;
  /** Height - can be number (px) or string */
  height?: number | string;
  /** Border radius */
  borderRadius?: number | string;
  /** Animate the skeleton */
  animate?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * A simple loading skeleton with shimmer animation
 */
export default function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 4,
  animate = true,
  className,
  style,
}: SkeletonProps) {
  return (
    <>
      <div
        className={className}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          borderRadius:
            typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
          background: "var(--skeleton-bg, #e5e7eb)",
          animation: animate ? "skeleton-shimmer 1.5s ease-in-out infinite" : "none",
          ...style,
        }}
        aria-hidden="true"
      />
      <style>{`
        @keyframes skeleton-shimmer {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// Preset skeleton components for common layouts

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
}

export function SkeletonText({ lines = 3, lastLineWidth = "70%" }: SkeletonTextProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius="50%" />;
}

export function SkeletonCard() {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <SkeletonAvatar />
        <div style={{ flex: 1 }}>
          <Skeleton height={16} width="60%" style={{ marginBottom: "6px" }} />
          <Skeleton height={12} width="40%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "16px",
          padding: "12px 16px",
          background: "var(--bg-secondary, #f9fafb)",
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={14} width="80%" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "16px",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border, #e5e7eb)",
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height={14} width={colIndex === 0 ? "70%" : "50%"} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            border: "1px solid var(--border, #e5e7eb)",
            borderRadius: "6px",
          }}
        >
          <Skeleton width={20} height={20} borderRadius={4} />
          <div style={{ flex: 1 }}>
            <Skeleton height={14} width="50%" style={{ marginBottom: "6px" }} />
            <Skeleton height={12} width="30%" />
          </div>
          <Skeleton width={60} height={24} borderRadius={12} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonKanban({ columns = 3, cardsPerColumn = 3 }: { columns?: number; cardsPerColumn?: number }) {
  return (
    <div style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div
          key={colIndex}
          style={{
            minWidth: "280px",
            background: "var(--bg-secondary, #f9fafb)",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <Skeleton height={18} width="60%" style={{ marginBottom: "16px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                style={{
                  background: "var(--bg-primary, #fff)",
                  borderRadius: "6px",
                  padding: "12px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <Skeleton height={14} width="80%" style={{ marginBottom: "8px" }} />
                <Skeleton height={12} width="50%" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
