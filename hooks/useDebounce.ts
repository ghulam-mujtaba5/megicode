"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Debounce a value with a specified delay.
 *
 * Usage:
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 *
 *   useEffect(() => {
 *     // This will only run 300ms after the user stops typing
 *     fetchResults(debouncedSearch);
 *   }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Returns a debounced version of a callback function.
 *
 * Usage:
 *   const debouncedSave = useDebouncedCallback((data) => {
 *     saveToServer(data);
 *   }, 500);
 *
 *   // Call it as many times as you want, it will only execute
 *   // 500ms after the last call
 *   debouncedSave(newData);
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Keep the callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

/**
 * Throttle a callback - will execute at most once per interval.
 *
 * Usage:
 *   const throttledScroll = useThrottledCallback((e) => {
 *     handleScroll(e);
 *   }, 100);
 *
 *   window.addEventListener('scroll', throttledScroll);
 */
export function useThrottledCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  interval: number
): (...args: Parameters<T>) => void {
  const lastCalledRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCalledRef.current >= interval) {
        lastCalledRef.current = now;
        callbackRef.current(...args);
      }
    },
    [interval]
  );
}

export default useDebounce;
