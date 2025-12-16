"use client";

import React from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "info";

interface StatusBadgeProps {
  /** The text to display */
  label: string;
  /** The color variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: "small" | "medium" | "large";
  /** Show a dot indicator */
  dot?: boolean;
  /** Custom className */
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string; dotColor: string }> = {
  default: {
    bg: "var(--badge-default-bg, #f3f4f6)",
    color: "var(--badge-default-color, #374151)",
    dotColor: "#9ca3af",
  },
  primary: {
    bg: "var(--badge-primary-bg, #dbeafe)",
    color: "var(--badge-primary-color, #1d4ed8)",
    dotColor: "#3b82f6",
  },
  success: {
    bg: "var(--badge-success-bg, #d1fae5)",
    color: "var(--badge-success-color, #065f46)",
    dotColor: "#10b981",
  },
  warning: {
    bg: "var(--badge-warning-bg, #fef3c7)",
    color: "var(--badge-warning-color, #92400e)",
    dotColor: "#f59e0b",
  },
  error: {
    bg: "var(--badge-error-bg, #fee2e2)",
    color: "var(--badge-error-color, #991b1b)",
    dotColor: "#ef4444",
  },
  info: {
    bg: "var(--badge-info-bg, #e0e7ff)",
    color: "var(--badge-info-color, #3730a3)",
    dotColor: "#6366f1",
  },
};

const sizeStyles = {
  small: {
    padding: "0.125rem 0.375rem",
    fontSize: "0.625rem",
    dotSize: 6,
  },
  medium: {
    padding: "0.25rem 0.5rem",
    fontSize: "0.75rem",
    dotSize: 8,
  },
  large: {
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
    dotSize: 10,
  },
};

export default function StatusBadge({
  label,
  variant = "default",
  size = "medium",
  dot = false,
  className,
}: StatusBadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 500,
        borderRadius: "9999px",
        backgroundColor: variantStyle.bg,
        color: variantStyle.color,
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          style={{
            width: sizeStyle.dotSize,
            height: sizeStyle.dotSize,
            borderRadius: "50%",
            backgroundColor: variantStyle.dotColor,
          }}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}

// Helper to get variant from status string (for use with lib/constants)
export function getStatusVariant(status: string): BadgeVariant {
  const statusMap: Record<string, BadgeVariant> = {
    // Success states
    done: "success",
    completed: "success",
    paid: "success",
    active: "success",
    accepted: "success",
    approved: "success",
    delivered: "success",
    converted: "success",
    resolved: "success",
    mitigated: "success",
    green: "success",

    // Warning states
    in_progress: "warning",
    in_review: "warning",
    pending: "warning",
    pending_approval: "warning",
    partial: "warning",
    revised: "warning",
    amber: "warning",

    // Error states
    blocked: "error",
    overdue: "error",
    canceled: "error",
    cancelled: "error",
    rejected: "error",
    declined: "error",
    failed: "error",
    churned: "error",
    open: "error",
    red: "error",
    wont_fix: "error",
    critical: "error",
    high: "error",

    // Info states
    new: "info",
    draft: "info",
    sent: "info",
    todo: "info",
    viewed: "info",
    running: "info",

    // Primary
    in_qa: "primary",
  };

  return statusMap[status.toLowerCase()] || "default";
}

// Convenience component that auto-detects variant from status
export function StatusBadgeAuto({
  status,
  label,
  ...props
}: { status: string; label?: string } & Omit<StatusBadgeProps, "label" | "variant">) {
  // Convert snake_case to Title Case if no label provided
  const displayLabel = label || status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const variant = getStatusVariant(status);

  return <StatusBadge label={displayLabel} variant={variant} {...props} />;
}
