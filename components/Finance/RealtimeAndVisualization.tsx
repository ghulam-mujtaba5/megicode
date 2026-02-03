/**
 * Advanced Real-Time Updates & Data Visualization Ready
 * Real-time data sync, websocket support, chart-ready data
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Real-time data subscription
interface SubscriptionHandler<T> {
  onUpdate: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useRealtimeData<T>(
  dataSource: string,
  initialData: T,
  interval: number = 5000
) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const handlersRef = useRef<SubscriptionHandler<T>[]>([]);

  const subscribe = useCallback((handler: SubscriptionHandler<T>) => {
    handlersRef.current.push(handler);
    return () => {
      handlersRef.current = handlersRef.current.filter((h) => h !== handler);
    };
  }, []);

  const notifySubscribers = useCallback((newData: T) => {
    handlersRef.current.forEach((handler) => {
      try {
        handler.onUpdate(newData);
      } catch (err) {
        handler.onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }, []);

  // Poll for updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(dataSource);
        if (response.ok) {
          const newData = await response.json();
          setData(newData);
          notifySubscribers(newData);
          setError(null);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        notifySubscribers(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, interval);
    return () => clearInterval(intervalId);
  }, [dataSource, interval, notifySubscribers, data]);

  return { data, isLoading, error, subscribe };
}

// Time-series data aggregation
interface TimeSeriesPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export function useTimeSeries(dataPoints: TimeSeriesPoint[]) {
  const aggregateByPeriod = (points: TimeSeriesPoint[], period: 'hour' | 'day' | 'week' | 'month') => {
    const periodMs = {
      hour: 3600000,
      day: 86400000,
      week: 604800000,
      month: 2592000000,
    };

    const buckets: Record<number, number[]> = {};

    points.forEach((point) => {
      const bucketKey = Math.floor(point.timestamp / periodMs[period]);
      if (!buckets[bucketKey]) buckets[bucketKey] = [];
      buckets[bucketKey].push(point.value);
    });

    return Object.entries(buckets).map(([key, values]) => ({
      timestamp: parseInt(key) * periodMs[period],
      value: values.reduce((a, b) => a + b, 0) / values.length, // Average
      count: values.length,
    }));
  };

  const getTrend = (points: TimeSeriesPoint[], windowSize = 5) => {
    if (points.length < 2) return 0;

    const recent = points.slice(-windowSize);
    const older = points.slice(-windowSize * 2, -windowSize);

    const recentAvg = recent.reduce((sum, p) => sum + p.value, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, p) => sum + p.value, 0) / older.length : recentAvg;

    return ((recentAvg - olderAvg) / olderAvg) * 100 || 0;
  };

  const getStats = (points: TimeSeriesPoint[]) => {
    const values = points.map((p) => p.value);
    const sorted = [...values].sort((a, b) => a - b);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      total: values.reduce((a, b) => a + b, 0),
    };
  };

  return {
    aggregateByPeriod,
    getTrend,
    getStats,
  };
}

// Advanced notification system with toast variants
interface AdvancedNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export function AdvancedNotification({
  type,
  title,
  message,
  duration = 4000,
  action,
  onDismiss,
}: AdvancedNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && type !== 'loading') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, type, onDismiss]);

  if (!isVisible) return null;

  const typeStyles = {
    success: { bg: 'var(--int-success-light)', border: 'var(--int-success)', text: 'var(--int-success)', icon: '✓' },
    error: { bg: 'var(--int-error-light)', border: 'var(--int-error)', text: 'var(--int-error)', icon: '✕' },
    warning: { bg: 'var(--int-warning-light)', border: 'var(--int-warning)', text: 'var(--int-warning)', icon: '!' },
    info: { bg: 'var(--int-info-light)', border: 'var(--int-info)', text: 'var(--int-info)', icon: 'ℹ' },
    loading: { bg: 'var(--int-info-light)', border: 'var(--int-info)', text: 'var(--int-info)', icon: '⟳' },
  };

  const style = typeStyles[type];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--int-space-3)',
        padding: 'var(--int-space-4)',
        background: style.bg,
        border: `2px solid ${style.border}`,
        borderRadius: 'var(--int-radius)',
        animation: 'slideInFromRight 300ms ease-out',
      }}
    >
      <div
        style={{
          fontSize: '1.25rem',
          animation: type === 'loading' ? 'spin 1s linear infinite' : 'none',
        }}
      >
        {style.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: style.text, marginBottom: 'var(--int-space-1)' }}>
          {title}
        </div>
        <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text)' }}>
          {message}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            style={{
              marginTop: 'var(--int-space-2)',
              padding: '4px 12px',
              background: style.text,
              color: 'white',
              border: 'none',
              borderRadius: 'var(--int-radius-sm)',
              fontSize: 'var(--int-text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          onDismiss?.();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: style.text,
          cursor: 'pointer',
          fontSize: '1.25rem',
          padding: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}

// Notification center hook
export function useNotificationCenter() {
  const [notifications, setNotifications] = useState<
    Array<AdvancedNotificationProps & { id: string }>
  >([]);

  const add = useCallback((notif: AdvancedNotificationProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { ...notif, id }]);
    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    add,
    remove,
    clear,
  };
}

// CSS animations for advanced effects
export const ADVANCED_ANIMATION_STYLES = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}
`;
