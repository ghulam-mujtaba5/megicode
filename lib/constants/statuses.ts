/**
 * Centralized Status & Enum Constants
 * 
 * This file contains all status enums and constants used throughout the application.
 * Using these constants instead of magic strings ensures type safety and consistency.
 * 
 * These constants are aligned with the database schema in lib/db/schema.ts
 */

// ============================================================================
// User Roles
// ============================================================================

export const USER_ROLE = {
  ADMIN: 'admin',
  PM: 'pm',
  DEV: 'dev',
  QA: 'qa',
  VIEWER: 'viewer',
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLE.ADMIN, label: 'Admin' },
  { value: USER_ROLE.PM, label: 'Project Manager' },
  { value: USER_ROLE.DEV, label: 'Developer' },
  { value: USER_ROLE.QA, label: 'QA' },
  { value: USER_ROLE.VIEWER, label: 'Viewer' },
] as const;

// ============================================================================
// Lead Statuses (matches schema: 'new' | 'in_review' | 'approved' | 'rejected' | 'converted')
// ============================================================================

export const LEAD_STATUS = {
  NEW: 'new',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CONVERTED: 'converted',
} as const;

export type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];

export const LEAD_STATUS_OPTIONS = [
  { value: LEAD_STATUS.NEW, label: 'New', color: 'info' },
  { value: LEAD_STATUS.IN_REVIEW, label: 'In Review', color: 'warning' },
  { value: LEAD_STATUS.APPROVED, label: 'Approved', color: 'success' },
  { value: LEAD_STATUS.REJECTED, label: 'Rejected', color: 'error' },
  { value: LEAD_STATUS.CONVERTED, label: 'Converted', color: 'success' },
] as const;

// ============================================================================
// Lead Complexity
// ============================================================================

export const LEAD_COMPLEXITY = {
  SIMPLE: 'simple',
  MODERATE: 'moderate',
  COMPLEX: 'complex',
  VERY_COMPLEX: 'very_complex',
} as const;

export type LeadComplexity = typeof LEAD_COMPLEXITY[keyof typeof LEAD_COMPLEXITY];

export const LEAD_COMPLEXITY_OPTIONS = [
  { value: LEAD_COMPLEXITY.SIMPLE, label: 'Simple' },
  { value: LEAD_COMPLEXITY.MODERATE, label: 'Moderate' },
  { value: LEAD_COMPLEXITY.COMPLEX, label: 'Complex' },
  { value: LEAD_COMPLEXITY.VERY_COMPLEX, label: 'Very Complex' },
] as const;

// ============================================================================
// Project Statuses
// ============================================================================

export const PROJECT_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  IN_QA: 'in_qa',
  DELIVERED: 'delivered',
  CLOSED: 'closed',
  REJECTED: 'rejected',
} as const;

export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_OPTIONS = [
  { value: PROJECT_STATUS.NEW, label: 'New', color: 'info' },
  { value: PROJECT_STATUS.IN_PROGRESS, label: 'In Progress', color: 'primary' },
  { value: PROJECT_STATUS.BLOCKED, label: 'Blocked', color: 'error' },
  { value: PROJECT_STATUS.IN_QA, label: 'In QA', color: 'warning' },
  { value: PROJECT_STATUS.DELIVERED, label: 'Delivered', color: 'success' },
  { value: PROJECT_STATUS.CLOSED, label: 'Closed', color: 'default' },
  { value: PROJECT_STATUS.REJECTED, label: 'Rejected', color: 'error' },
] as const;

// ============================================================================
// Task Statuses
// ============================================================================

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  DONE: 'done',
  CANCELED: 'canceled',
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.TODO, label: 'To Do', color: 'default' },
  { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress', color: 'primary' },
  { value: TASK_STATUS.BLOCKED, label: 'Blocked', color: 'error' },
  { value: TASK_STATUS.DONE, label: 'Done', color: 'success' },
  { value: TASK_STATUS.CANCELED, label: 'Canceled', color: 'default' },
] as const;

// ============================================================================
// Proposal Statuses
// ============================================================================

export const PROPOSAL_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  SENT: 'sent',
  REVISED: 'revised',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
} as const;

export type ProposalStatus = typeof PROPOSAL_STATUS[keyof typeof PROPOSAL_STATUS];

export const PROPOSAL_STATUS_OPTIONS = [
  { value: PROPOSAL_STATUS.DRAFT, label: 'Draft', color: 'default' },
  { value: PROPOSAL_STATUS.PENDING_APPROVAL, label: 'Pending Approval', color: 'warning' },
  { value: PROPOSAL_STATUS.APPROVED, label: 'Approved', color: 'success' },
  { value: PROPOSAL_STATUS.SENT, label: 'Sent', color: 'info' },
  { value: PROPOSAL_STATUS.REVISED, label: 'Revised', color: 'warning' },
  { value: PROPOSAL_STATUS.ACCEPTED, label: 'Accepted', color: 'success' },
  { value: PROPOSAL_STATUS.DECLINED, label: 'Declined', color: 'error' },
] as const;

// ============================================================================
// Invoice Statuses (matches schema: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'canceled')
// ============================================================================

export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELED: 'canceled',
} as const;

export type InvoiceStatus = typeof INVOICE_STATUS[keyof typeof INVOICE_STATUS];

export const INVOICE_STATUS_OPTIONS = [
  { value: INVOICE_STATUS.DRAFT, label: 'Draft', color: 'default' },
  { value: INVOICE_STATUS.SENT, label: 'Sent', color: 'info' },
  { value: INVOICE_STATUS.PARTIAL, label: 'Partial', color: 'warning' },
  { value: INVOICE_STATUS.PAID, label: 'Paid', color: 'success' },
  { value: INVOICE_STATUS.OVERDUE, label: 'Overdue', color: 'error' },
  { value: INVOICE_STATUS.CANCELED, label: 'Canceled', color: 'default' },
] as const;

// ============================================================================
// Client Statuses
// ============================================================================

export const CLIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CHURNED: 'churned',
} as const;

export type ClientStatus = typeof CLIENT_STATUS[keyof typeof CLIENT_STATUS];

export const CLIENT_STATUS_OPTIONS = [
  { value: CLIENT_STATUS.ACTIVE, label: 'Active', color: 'success' },
  { value: CLIENT_STATUS.INACTIVE, label: 'Inactive', color: 'default' },
  { value: CLIENT_STATUS.CHURNED, label: 'Churned', color: 'error' },
] as const;

// ============================================================================
// Priority Levels
// ============================================================================

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical',
} as const;

export type Priority = typeof PRIORITY[keyof typeof PRIORITY];

export const PRIORITY_OPTIONS = [
  { value: PRIORITY.LOW, label: 'Low', color: 'default' },
  { value: PRIORITY.MEDIUM, label: 'Medium', color: 'info' },
  { value: PRIORITY.HIGH, label: 'High', color: 'warning' },
  { value: PRIORITY.URGENT, label: 'Urgent', color: 'error' },
  { value: PRIORITY.CRITICAL, label: 'Critical', color: 'error' },
] as const;

// ============================================================================
// Health Statuses (RAG)
// ============================================================================

export const HEALTH_STATUS = {
  GREEN: 'green',
  AMBER: 'amber',
  RED: 'red',
} as const;

export type HealthStatus = typeof HEALTH_STATUS[keyof typeof HEALTH_STATUS];

export const HEALTH_STATUS_OPTIONS = [
  { value: HEALTH_STATUS.GREEN, label: 'On Track', color: 'success' },
  { value: HEALTH_STATUS.AMBER, label: 'At Risk', color: 'warning' },
  { value: HEALTH_STATUS.RED, label: 'Critical', color: 'error' },
] as const;

// ============================================================================
// Feasibility Levels
// ============================================================================

export const TECHNICAL_FEASIBILITY = {
  FEASIBLE: 'feasible',
  CHALLENGING: 'challenging',
  NOT_FEASIBLE: 'not_feasible',
  NEEDS_RESEARCH: 'needs_research',
} as const;

export const RESOURCE_AVAILABILITY = {
  AVAILABLE: 'available',
  LIMITED: 'limited',
  NOT_AVAILABLE: 'not_available',
} as const;

export const RISK_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// ============================================================================
// Risk Categories
// ============================================================================

export const RISK_CATEGORY = {
  TECHNICAL: 'technical',
  RESOURCE: 'resource',
  TIMELINE: 'timeline',
  BUDGET: 'budget',
  SCOPE: 'scope',
  EXTERNAL: 'external',
} as const;

export type RiskCategory = typeof RISK_CATEGORY[keyof typeof RISK_CATEGORY];

// ============================================================================
// Feedback Types
// ============================================================================

export const FEEDBACK_TYPE = {
  BUG: 'bug',
  ENHANCEMENT: 'enhancement',
  QUESTION: 'question',
  PRAISE: 'praise',
  COMPLAINT: 'complaint',
} as const;

export type FeedbackType = typeof FEEDBACK_TYPE[keyof typeof FEEDBACK_TYPE];

export const FEEDBACK_STATUS = {
  NEW: 'new',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  WONT_FIX: 'wont_fix',
} as const;

export type FeedbackStatus = typeof FEEDBACK_STATUS[keyof typeof FEEDBACK_STATUS];

// ============================================================================
// QA Signoff Statuses
// ============================================================================

export const QA_SIGNOFF_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type QaSignoffStatus = typeof QA_SIGNOFF_STATUS[keyof typeof QA_SIGNOFF_STATUS];

// ============================================================================
// Bug Statuses (matches schema: 'open' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix')
// ============================================================================

export const BUG_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  WONT_FIX: 'wont_fix',
} as const;

export type BugStatus = typeof BUG_STATUS[keyof typeof BUG_STATUS];

export const BUG_STATUS_OPTIONS = [
  { value: BUG_STATUS.OPEN, label: 'Open', color: 'error' },
  { value: BUG_STATUS.IN_PROGRESS, label: 'In Progress', color: 'warning' },
  { value: BUG_STATUS.RESOLVED, label: 'Resolved', color: 'success' },
  { value: BUG_STATUS.CLOSED, label: 'Closed', color: 'default' },
  { value: BUG_STATUS.WONT_FIX, label: "Won't Fix", color: 'default' },
] as const;

// ============================================================================
// Bug Severity (matches schema: 'low' | 'medium' | 'high' | 'critical')
// ============================================================================

export const BUG_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type BugSeverity = typeof BUG_SEVERITY[keyof typeof BUG_SEVERITY];

export const BUG_SEVERITY_OPTIONS = [
  { value: BUG_SEVERITY.LOW, label: 'Low', color: 'default' },
  { value: BUG_SEVERITY.MEDIUM, label: 'Medium', color: 'info' },
  { value: BUG_SEVERITY.HIGH, label: 'High', color: 'warning' },
  { value: BUG_SEVERITY.CRITICAL, label: 'Critical', color: 'error' },
] as const;

// ============================================================================
// Process Instance Statuses (matches schema: 'running' | 'completed' | 'canceled')
// ============================================================================

export const PROCESS_INSTANCE_STATUS = {
  RUNNING: 'running',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
} as const;

export type ProcessInstanceStatus = typeof PROCESS_INSTANCE_STATUS[keyof typeof PROCESS_INSTANCE_STATUS];

// ============================================================================
// Project Risk Statuses (matches schema: 'open' | 'mitigated' | 'closed')
// ============================================================================

export const PROJECT_RISK_STATUS = {
  OPEN: 'open',
  MITIGATED: 'mitigated',
  CLOSED: 'closed',
} as const;

export type ProjectRiskStatus = typeof PROJECT_RISK_STATUS[keyof typeof PROJECT_RISK_STATUS];

export const PROJECT_RISK_STATUS_OPTIONS = [
  { value: PROJECT_RISK_STATUS.OPEN, label: 'Open', color: 'error' },
  { value: PROJECT_RISK_STATUS.MITIGATED, label: 'Mitigated', color: 'warning' },
  { value: PROJECT_RISK_STATUS.CLOSED, label: 'Closed', color: 'success' },
] as const;

// ============================================================================
// Proposal Cost Models (matches schema: 'fixed' | 'hourly' | 'retainer')
// ============================================================================

export const COST_MODEL = {
  FIXED: 'fixed',
  HOURLY: 'hourly',
  RETAINER: 'retainer',
} as const;

export type CostModel = typeof COST_MODEL[keyof typeof COST_MODEL];

export const COST_MODEL_OPTIONS = [
  { value: COST_MODEL.FIXED, label: 'Fixed Price' },
  { value: COST_MODEL.HOURLY, label: 'Hourly Rate' },
  { value: COST_MODEL.RETAINER, label: 'Retainer' },
] as const;

// ============================================================================
// Email Log Statuses (matches schema: 'sent' | 'failed' | 'bounced')
// ============================================================================

export const EMAIL_STATUS = {
  SENT: 'sent',
  FAILED: 'failed',
  BOUNCED: 'bounced',
} as const;

export type EmailStatus = typeof EMAIL_STATUS[keyof typeof EMAIL_STATUS];
