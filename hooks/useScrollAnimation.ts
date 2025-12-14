"use client";

import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

interface ScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

interface ScrollProgress {
  progress: number; // 0 to 1
  isInView: boolean;
  hasAnimated: boolean;
}

/**
 * Hook for scroll-driven animations with progress tracking
 */
export const useScrollAnimation = <T extends HTMLElement = HTMLDivElement>(
  options: ScrollAnimationOptions = {}
): [RefObject<T | null>, ScrollProgress] => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = false,
    delay = 0,
  } = options;

  const ref = useRef<T>(null);
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    isInView: false,
    hasAnimated: false,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isInView = entry.isIntersecting;
          const progress = Math.min(1, Math.max(0, entry.intersectionRatio));

          if (delay > 0 && isInView) {
            timeoutId = setTimeout(() => {
              setScrollProgress((prev) => ({
                progress,
                isInView,
                hasAnimated: triggerOnce ? prev.hasAnimated || isInView : isInView,
              }));
            }, delay);
          } else {
            setScrollProgress((prev) => ({
              progress,
              isInView,
              hasAnimated: triggerOnce ? prev.hasAnimated || isInView : isInView,
            }));
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return [ref, scrollProgress];
};

/**
 * Hook for parallax scroll effects
 */
export const useParallaxScroll = (speed: number = 0.5): number => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setOffset(scrollY * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};

/**
 * Hook for scroll progress through a specific element
 */
export const useElementScrollProgress = <T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T | null>,
  number
] => {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress from when element enters viewport to when it leaves
      const start = rect.top - windowHeight;
      const end = rect.bottom;
      const total = end - start;
      const current = -start;
      
      const rawProgress = current / total;
      const clampedProgress = Math.min(1, Math.max(0, rawProgress));
      
      setProgress(clampedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return [ref, progress];
};

/**
 * Hook for revealing elements on scroll with stagger support
 */
export const useScrollReveal = <T extends HTMLElement = HTMLDivElement>(
  staggerIndex: number = 0,
  baseDelay: number = 100
): [RefObject<T | null>, boolean] => {
  const [ref, { isInView, hasAnimated }] = useScrollAnimation<T>({
    threshold: 0.1,
    triggerOnce: true,
    delay: staggerIndex * baseDelay,
  });

  return [ref, hasAnimated];
};

/**
 * Hook for scroll-linked value interpolation
 */
export const useScrollValue = (
  start: number,
  end: number,
  scrollStart: number = 0,
  scrollEnd: number = 1000
): number => {
  const [value, setValue] = useState(start);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(1, Math.max(0, (scrollY - scrollStart) / (scrollEnd - scrollStart)));
      const interpolated = start + (end - start) * progress;
      setValue(interpolated);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [start, end, scrollStart, scrollEnd]);

  return value;
};

export default useScrollAnimation;
