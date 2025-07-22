'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_search: searchString,
        page_url: window.location.href,
      });
    }
  }, [pathname, searchString]);
}
