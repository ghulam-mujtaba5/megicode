/**
 * Advanced Performance Optimizations
 * Debouncing, throttling, lazy loading, memoization
 */
'use client';

import { useCallback, useRef, useEffect, useState, useMemo } from 'react';

// Debounce hook - delays function execution
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

// Throttle hook - limits function execution frequency
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      if (timeSinceLastRun >= delay) {
        callback(...args);
        lastRunRef.current = now;
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          () => {
            callback(...args);
            lastRunRef.current = Date.now();
          },
          delay - timeSinceLastRun
        );
      }
    },
    [callback, delay]
  );
}

// Lazy loading for components
interface LazyComponentProps {
  isVisible: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyLoad({ isVisible, children, fallback }: LazyComponentProps) {
  if (!isVisible) return <>{fallback}</>;
  return <>{children}</>;
}

// Infinite scroll hook
interface UseInfiniteScrollOptions {
  threshold?: number;
  onLoadMore?: () => void;
}

export function useInfiniteScroll({ threshold = 0.1, onLoadMore }: UseInfiniteScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, onLoadMore]);

  return containerRef;
}

// Pagination hook
interface UsePaginationOptions {
  items: any[];
  itemsPerPage?: number;
}

export function usePagination({ items, itemsPerPage = 10 }: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

// Virtual scrolling for large lists
interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

export function VirtualScroll({
  items,
  itemHeight,
  containerHeight,
  renderItem,
}: VirtualScrollProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
  const endIndex = Math.min(items.length, startIndex + Math.ceil(containerHeight / itemHeight) + 1);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      style={{
        height: containerHeight,
        overflow: 'auto',
      }}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Request animation frame debouncer
export function useRafDebounce<T extends (...args: any[]) => any>(callback: T): T {
  const rafIdRef = useRef<number | undefined>(undefined);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: any[]) => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => callbackRef.current(...args));
    },
    []
  ) as T;
}

// Memoization for expensive computations
export function useMemoDeep<T>(factory: () => T, deps: any[]): T {
  const valueRef = useRef<T | undefined>(undefined);
  const depsRef = useRef<any[] | undefined>(undefined);

  const hasDepsChanged = !depsRef.current || deps.length !== depsRef.current.length 
    || deps.some((dep, i) => dep !== depsRef.current![i]);

  if (hasDepsChanged) {
    valueRef.current = factory();
    depsRef.current = deps;
  }

  return valueRef.current!;
}
