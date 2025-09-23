'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackPageView } from '@/lib/analytics';

export function usePageView() {
  const pathname = usePathname();
  // Make searchParams optional since it requires Suspense
  let searchString = '';
  try {
    const searchParams = useSearchParams();
    searchString = searchParams?.toString() || '';
  } catch (e) {
    // Handle case where searchParams is not available
    console.debug('Search params not available for analytics');
  }

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!pathname) return;

    let attempts = 0;
    const maxAttempts = 10;

    function trySend() {
      if (typeof window !== 'undefined' && window.gtag) {
        trackPageView(pathname, searchString, window.location.href);
        return;
      }
      if (attempts < maxAttempts) {
        attempts += 1;
        timeoutRef.current = setTimeout(trySend, 200);
      }
    }

    trySend();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, searchString]);
}
