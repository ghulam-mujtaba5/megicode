export type BadgeColor = 'gray' | 'blue' | 'green' | 'yellow' | 'red';

export function leadStatusColor(status: string): BadgeColor {
  if (status === 'rejected') return 'red' as const;
  if (status === 'approved' || status === 'converted') return 'green' as const;
  if (status === 'in_review') return 'blue' as const;
  return 'gray' as const;
}

export function projectStatusColor(status: string): BadgeColor {
  if (status === 'rejected') return 'red' as const;
  if (status === 'blocked') return 'yellow' as const;
  if (status === 'delivered' || status === 'closed') return 'green' as const;
  if (status === 'in_qa') return 'blue' as const;
  if (status === 'in_progress') return 'blue' as const;
  return 'gray' as const;
}

export function taskStatusColor(status: string): BadgeColor {
  if (status === 'blocked') return 'yellow' as const;
  if (status === 'done') return 'green' as const;
  if (status === 'in_progress') return 'blue' as const;
  if (status === 'canceled') return 'red' as const;
  return 'gray' as const;
}

export function formatDateTime(value?: Date | number | null) {
  if (!value) return '';
  const date = typeof value === 'number' ? new Date(value) : value;
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
