"use client";

import React from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Icon emoji or string */
  icon?: string;
  /** Call to action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Size variant */
  size?: "small" | "medium" | "large";
}

const sizeStyles = {
  small: {
    padding: "1.5rem",
    iconSize: "2rem",
    titleSize: "1rem",
    descSize: "0.75rem",
  },
  medium: {
    padding: "2.5rem",
    iconSize: "3rem",
    titleSize: "1.125rem",
    descSize: "0.875rem",
  },
  large: {
    padding: "3.5rem",
    iconSize: "4rem",
    titleSize: "1.25rem",
    descSize: "1rem",
  },
};

const defaultIcons: Record<string, string> = {
  list: "📋",
  tasks: "✅",
  projects: "📁",
  users: "👥",
  search: "🔍",
  inbox: "📥",
  files: "📄",
  data: "📊",
  default: "📭",
};

export default function EmptyState({
  title,
  description,
  icon,
  action,
  size = "medium",
}: EmptyStateProps) {
  const styles = sizeStyles[size];
  const displayIcon = icon || defaultIcons.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: styles.padding,
        background: "var(--bg-secondary, #f9fafb)",
        borderRadius: "12px",
        border: "1px dashed var(--border, #e5e7eb)",
      }}
    >
      {/* Icon */}
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        style={{
          fontSize: styles.iconSize,
          marginBottom: "1rem",
          display: "block",
        }}
        role="img"
        aria-hidden="true"
      >
        {displayIcon}
      </motion.span>

      {/* Title */}
      <h3
        style={{
          fontSize: styles.titleSize,
          fontWeight: 600,
          color: "var(--text-primary, #1f2937)",
          margin: 0,
          marginBottom: description ? "0.5rem" : action ? "1rem" : 0,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: styles.descSize,
            color: "var(--text-secondary, #6b7280)",
            margin: 0,
            maxWidth: "300px",
            marginBottom: action ? "1rem" : 0,
          }}
        >
          {description}
        </p>
      )}

      {/* Action button */}
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          style={{
            padding: "0.5rem 1rem",
            fontSize: styles.descSize,
            fontWeight: 500,
            background: "var(--primary, #3b82f6)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

// Preset empty states for common use cases
export const EmptyStatePresets = {
  NoTasks: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="✅"
      title="No tasks yet"
      description="Create your first task to get started"
      {...props}
    />
  ),
  NoProjects: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="📁"
      title="No projects"
      description="Create a new project or convert a lead"
      {...props}
    />
  ),
  NoResults: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="🔍"
      title="No results found"
      description="Try adjusting your search or filters"
      {...props}
    />
  ),
  NoLeads: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="📥"
      title="No leads yet"
      description="Leads from the contact form will appear here"
      {...props}
    />
  ),
  NoClients: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="👥"
      title="No clients"
      description="Clients are created when leads convert to projects"
      {...props}
    />
  ),
  NoInvoices: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="📄"
      title="No invoices"
      description="Create an invoice for a project to track payments"
      {...props}
    />
  ),
  NoComments: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="💬"
      title="No comments"
      description="Be the first to add a comment"
      size="small"
      {...props}
    />
  ),
  NoNotes: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="📝"
      title="No notes"
      description="Add a note to keep track of important information"
      size="small"
      {...props}
    />
  ),
};
