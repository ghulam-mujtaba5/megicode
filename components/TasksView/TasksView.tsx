"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import IconWrapper from "@/components/IconSystem/IconWrapper";
import { UserAvatar } from "@/components/UserAvatar";
import { InlineEdit } from "@/components/InlineEdit";
import { updateTaskTitle } from "@/app/internal/tasks/actions";

// Types
import { type Task } from "@/lib/db/schema";

type ViewMode = "list" | "board";
type SortOption = "updatedAt" | "createdAt" | "priority" | "dueAt";

interface TasksViewProps {
  tasks: Task[];
  projects?: Record<string, { title: string }>;
  users?: Record<string, { name?: string | null; image?: string | null; email?: string | null }>;
}

const PRIORITY_ORDER = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Tasks" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

const SORT_OPTIONS = [
  { value: "updatedAt", label: "Last Updated" },
  { value: "createdAt", label: "Created Date" },
  { value: "priority", label: "Priority" },
  { value: "dueAt", label: "Due Date" },
];

export default function TasksView({ tasks, projects = {}, users = {} }: TasksViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("updatedAt");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and Sort Logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status Filter
        if (statusFilter !== "all" && task.status !== statusFilter) return false;

        // Search Filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query) ||
            task.key.toLowerCase().includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "priority":
            return (
              (PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] || 0) -
              (PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] || 0)
            );
          case "dueAt":
            if (!a.dueAt) return 1;
            if (!b.dueAt) return -1;
            return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
          case "createdAt":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "updatedAt":
          default:
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
      });
  }, [tasks, statusFilter, searchQuery, sortBy]);

  // Group by status for Kanban
  const kanbanColumns = useMemo(() => {
    const columns = {
      todo: [] as Task[],
      in_progress: [] as Task[],
      blocked: [] as Task[],
      done: [] as Task[],
    };

    filteredTasks.forEach((task) => {
      if (task.status in columns) {
        columns[task.status as keyof typeof columns].push(task);
      }
    });

    return columns;
  }, [filteredTasks]);

  return (
    <div className="tasks-view">
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: "300px" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "6px",
                border: "1px solid var(--border-color, #e5e7eb)",
                background: "var(--bg-surface, #fff)",
                color: "var(--text-primary, #111827)",
              }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary, #6b7280)",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border-color, #e5e7eb)",
              background: "var(--bg-surface, #fff)",
              color: "var(--text-primary, #111827)",
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border-color, #e5e7eb)",
              background: "var(--bg-surface, #fff)",
              color: "var(--text-primary, #111827)",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggles */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-surface-alt, #f3f4f6)",
            padding: "4px",
            borderRadius: "6px",
          }}
        >
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              background: viewMode === "list" ? "var(--bg-surface, #fff)" : "transparent",
              color:
                viewMode === "list"
                  ? "var(--text-primary, #111827)"
                  : "var(--text-secondary, #6b7280)",
              boxShadow:
                viewMode === "list" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            List
          </button>
          <button
            onClick={() => setViewMode("board")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              background: viewMode === "board" ? "var(--bg-surface, #fff)" : "transparent",
              color:
                viewMode === "board"
                  ? "var(--text-primary, #111827)"
                  : "var(--text-secondary, #6b7280)",
              boxShadow:
                viewMode === "board" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            Board
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredTasks.length === 0 ? (
        <EmptyState 
          title="No Tasks Found"
          description="There are no tasks matching your current filters."
          icon="📋"
        />
      ) : viewMode === "list" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              project={projects[task.projectId || ""]}
              user={users[task.assignedToUserId || ""]}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {Object.entries(kanbanColumns).map(([status, tasks]) => (
            <div key={status} style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  padding: "0 4px",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                    color: "var(--text-secondary, #6b7280)",
                  }}
                >
                  {status.replace("_", " ")}
                </h3>
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "var(--bg-surface-alt, #f3f4f6)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    color: "var(--text-secondary, #6b7280)",
                  }}
                >
                  {tasks.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={projects[task.projectId || ""]}
                    user={users[task.assignedToUserId || ""]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  project,
  user,
}: {
  task: Task;
  project?: { title: string };
  user?: { name?: string | null; image?: string | null; email?: string | null };
}) {
  const handleTitleSave = async (newTitle: string) => {
    await updateTaskTitle(task.id, newTitle);
  };

  return (
    <Link
      href={`/internal/tasks/${task.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
        style={{
          background: "var(--bg-surface, #fff)",
          border: "1px solid var(--border-color, #e5e7eb)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          transition: "box-shadow 0.2s",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontFamily: "monospace",
                color: "var(--text-secondary, #6b7280)",
              }}
            >
              {task.key}
            </span>
            {project && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary, #6b7280)",
                  background: "var(--bg-surface-alt, #f3f4f6)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {project.title}
              </span>
            )}
          </div>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <InlineEdit value={task.title} onSave={handleTitleSave} />
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {task.dueAt && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.875rem",
                color:
                  new Date(task.dueAt) < new Date()
                    ? "var(--danger, #ef4444)"
                    : "var(--text-secondary, #6b7280)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              {format(new Date(task.dueAt), "MMM d")}
            </div>
          )}
          <UserAvatar user={user} size="sm" />
          <StatusBadge label={task.status.replace('_', ' ')} variant={task.status === 'done' ? 'success' : task.status === 'blocked' ? 'error' : 'default'} />
        </div>
      </motion.div>
    </Link>
  );
}

function TaskCard({
  task,
  project,
  user,
}: {
  task: Task;
  project?: { title: string };
  user?: { name?: string | null; image?: string | null; email?: string | null };
}) {
  const handleTitleSave = async (newTitle: string) => {
    await updateTaskTitle(task.id, newTitle);
  };

  return (
    <Link
      href={`/internal/tasks/${task.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
        style={{
          background: "var(--bg-surface, #fff)",
          border: "1px solid var(--border-color, #e5e7eb)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          transition: "box-shadow 0.2s",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "monospace",
              color: "var(--text-secondary, #6b7280)",
            }}
          >
            {task.key}
          </span>
          {task.priority === "critical" || task.priority === "high" ? (
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: task.priority === "critical" ? "#ef4444" : "#f59e0b",
              }}
              title={`Priority: ${task.priority}`}
            />
          ) : null}
        </div>

        <h3
          style={{
            fontSize: "0.9375rem",
            fontWeight: 500,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          <InlineEdit value={task.title} onSave={handleTitleSave} />
        </h3>

        {project && (
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary, #6b7280)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            {project.title}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: "8px",
            borderTop: "1px solid var(--border-color, #f3f4f6)",
          }}
        >
          {task.dueAt ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.75rem",
                color:
                  new Date(task.dueAt) < new Date()
                    ? "var(--danger, #ef4444)"
                    : "var(--text-secondary, #6b7280)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              {format(new Date(task.dueAt), "MMM d")}
            </div>
          ) : (
            <span />
          )}
          
          <UserAvatar user={user} size="xs" />
        </div>
      </motion.div>
    </Link>
  );
}
