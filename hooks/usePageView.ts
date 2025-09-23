'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackPageView } from '@/lib/analytics';

export function usePageView() {
  const pathname = usePathname();
  let searchString = '';
  try {
    const searchParams = useSearchParams();
    searchString = searchParams?.toString() || '';
  } catch {}

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sentRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!pathname) return;

    const key = pathname + '?' + searchString;
    let attempts = 0;
    const maxAttempts = 10;

    function trySend() {
      if (typeof window !== 'undefined' && window.gtag) {
        if (sentRef.current !== key) {
          trackPageView(pathname, searchString, window.location.href);
          sentRef.current = key;
        }
        return;
      }
      if (attempts < maxAttempts) {
        attempts += 1;
        timeoutRef.current = setTimeout(trySend, 200);
      } else {
        if (process.env.NEXT_PUBLIC_GA_DEBUG === 'true') {
          // eslint-disable-next-line no-console
          console.warn('[GA] gtag not available after retries');
        }
      }
    }

    trySend();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, searchString]);
}
