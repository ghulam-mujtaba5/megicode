/**
 * Performance Optimization Layer
 * Caching, memoization, and calculation optimization for financial operations
 */

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  keyPrefix?: string;
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hits: number;
}

export class CacheManager<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private options: Required<CacheOptions>;
  private cleanupInterval: NodeJS.Timer | null = null;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 500,
      keyPrefix: options.keyPrefix || 'fin_',
    };

    this.startCleanup();
  }

  /**
   * Get value from cache
   */
  public get(key: string): T | undefined {
    const entry = this.cache.get(this.formatKey(key));

    if (!entry) return undefined;

    // Check TTL
    if (Date.now() - entry.timestamp > this.options.ttl) {
      this.cache.delete(this.formatKey(key));
      return undefined;
    }

    // Update hits
    entry.hits++;
    return entry.value;
  }

  /**
   * Set value in cache
   */
  public set(key: string, value: T, ttl?: number): void {
    const formatted = this.formatKey(key);

    // Check size limit
    if (this.cache.size >= this.options.maxSize && !this.cache.has(formatted)) {
      this.evictLRU();
    }

    this.cache.set(formatted, {
      value,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  /**
   * Check if key exists and is not expired
   */
  public has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete specific key
   */
  public delete(key: string): void {
    this.cache.delete(this.formatKey(key));
  }

  /**
   * Clear all cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  public getStats(): { size: number; entries: Array<{ key: string; hits: number; age: number }> } {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        hits: entry.hits,
        age: Date.now() - entry.timestamp,
      }))
      .sort((a, b) => b.hits - a.hits);

    return { size: this.cache.size, entries };
  }

  /**
   * Format cache key with prefix
   */
  private formatKey(key: string): string {
    return `${this.options.keyPrefix}${key}`;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruHits = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < lruHits) {
        lruKey = key;
        lruHits = entry.hits;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  /**
   * Start automatic cleanup
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > this.options.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }

  /**
   * Stop cleanup
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Global cache instance for financial data
export const financialCache = new CacheManager<any>({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 1000,
  keyPrefix: 'financial_',
});

// ============================================================================
// MEMOIZATION UTILITIES
// ============================================================================

export interface MemoizeOptions {
  maxArgs?: number; // Max number of arguments to use as key
  ttl?: number;
}

/**
 * Memoize function results
 */
export function memoize<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  options: MemoizeOptions = {}
): (...args: TArgs) => TResult {
  const cache = new CacheManager<TResult>({ ttl: options.ttl || 5 * 60 * 1000 });
  const maxArgs = options.maxArgs || 3;

  return (...args: TArgs): TResult => {
    // Create cache key from arguments
    const cacheKey = args
      .slice(0, maxArgs)
      .map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg);
        }
        return String(arg);
      })
      .join('::');

    let result = cache.get(cacheKey);

    if (result === undefined) {
      result = fn(...args);
      cache.set(cacheKey, result);
    }

    return result;
  };
}

/**
 * Memoize async function results
 */
export function memoizeAsync<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: MemoizeOptions = {}
): (...args: TArgs) => Promise<TResult> {
  const cache = new CacheManager<Promise<TResult>>({ ttl: options.ttl || 5 * 60 * 1000 });
  const maxArgs = options.maxArgs || 3;

  return (...args: TArgs): Promise<TResult> => {
    const cacheKey = args
      .slice(0, maxArgs)
      .map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg);
        }
        return String(arg);
      })
      .join('::');

    let result = cache.get(cacheKey);

    if (!result) {
      result = fn(...args);
      cache.set(cacheKey, result);
    }

    return result;
  };
}

// ============================================================================
// CALCULATION OPTIMIZATION
// ============================================================================

/**
 * Batch calculation processor
 */
export class BatchCalculationProcessor {
  private queue: Array<{ id: string; data: any; callback: (result: any) => void }> = [];
  private processing = false;
  private batchSize = 100;
  private batchDelay = 50; // ms

  /**
   * Queue a calculation
   */
  public queue<T>(data: T, callback: (result: T) => void): string {
    const id = Math.random().toString(36).substr(2, 9);
    this.queue.push({ id, data, callback });

    if (!this.processing) {
      this.processBatch();
    }

    return id;
  }

  /**
   * Process queued calculations in batches
   */
  private async processBatch(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);

      // Process batch
      for (const item of batch) {
        try {
          item.callback(item.data);
        } catch (error) {
          console.error(`Calculation failed for ${item.id}:`, error);
        }
      }

      // Delay before next batch
      if (this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.batchDelay));
      }
    }

    this.processing = false;
  }

  /**
   * Get queue size
   */
  public getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Clear queue
   */
  public clear(): void {
    this.queue = [];
  }
}

// ============================================================================
// DEBOUNCE & THROTTLE
// ============================================================================

/**
 * Debounce function (wait for activity to stop)
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

/**
 * Throttle function (execute at most once per interval)
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, interval: number): T {
  let lastExecutionTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args) => {
    const now = Date.now();

    if (now - lastExecutionTime >= interval) {
      lastExecutionTime = now;
      fn(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastExecutionTime = Date.now();
        fn(...args);
      }, interval - (now - lastExecutionTime));
    }
  }) as T;
}

// ============================================================================
// LAZY LOADING & PAGINATION
// ============================================================================

export interface PaginationOptions {
  pageSize: number;
  page: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Paginate array
 */
export function paginate<T>(items: T[], options: PaginationOptions): PaginatedResult<T> {
  const { pageSize, page } = options;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    total: items.length,
    page,
    pageSize,
    hasMore: end < items.length,
  };
}

/**
 * Lazy load items
 */
export async function lazyLoad<T>(
  loadFn: (offset: number, limit: number) => Promise<T[]>,
  limit: number = 50
): Promise<T[]> {
  const results: T[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const batch = await loadFn(offset, limit);
    results.push(...batch);
    hasMore = batch.length === limit;
    offset += limit;
  }

  return results;
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

export interface PerformanceMetric {
  name: string;
  duration: number; // milliseconds
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private markers: Map<string, number> = new Map();
  private maxMetrics = 1000;

  /**
   * Start measuring
   */
  public mark(name: string): void {
    this.markers.set(name, performance.now());
  }

  /**
   * End measuring
   */
  public measure(name: string, startMark: string, metadata?: Record<string, any>): number {
    const endTime = performance.now();
    const startTime = this.markers.get(startMark);

    if (startTime === undefined) {
      console.warn(`Start mark "${startMark}" not found`);
      return 0;
    }

    const duration = endTime - startTime;

    this.metrics.push({
      name,
      duration,
      timestamp: new Date(),
      metadata,
    });

    // Trim metrics if too many
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    this.markers.delete(startMark);

    return duration;
  }

  /**
   * Get metrics summary
   */
  public getSummary(): Record<
    string,
    {
      count: number;
      avg: number;
      min: number;
      max: number;
    }
  > {
    const summary: Record<
      string,
      {
        count: number;
        avg: number;
        min: number;
        max: number;
      }
    > = {};

    for (const metric of this.metrics) {
      if (!summary[metric.name]) {
        summary[metric.name] = { count: 0, avg: 0, min: Infinity, max: -Infinity };
      }

      const s = summary[metric.name];
      s.count++;
      s.avg = (s.avg * (s.count - 1) + metric.duration) / s.count;
      s.min = Math.min(s.min, metric.duration);
      s.max = Math.max(s.max, metric.duration);
    }

    return summary;
  }

  /**
   * Clear metrics
   */
  public clear(): void {
    this.metrics = [];
    this.markers.clear();
  }
}

// Global performance monitor
export const performanceMonitor = new PerformanceMonitor();

export default {
  CacheManager,
  financialCache,
  memoize,
  memoizeAsync,
  BatchCalculationProcessor,
  debounce,
  throttle,
  paginate,
  lazyLoad,
  PerformanceMonitor,
  performanceMonitor,
};
