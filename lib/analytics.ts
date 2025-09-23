// Centralized Google Analytics helpers
// Safe wrappers avoid errors if gtag not yet loaded.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

type GTagEventParams = Record<string, any>;

// (Window interface already augmented elsewhere; avoid redeclaration to prevent TS conflicts.)

const isProd = process.env.NODE_ENV === 'production';
const debug = process.env.NEXT_PUBLIC_GA_DEBUG === 'true';

function logDebug(...args: any[]) {
  if (debug && typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[GA DEBUG]', ...args);
  }
}

export function gtag(...args: any[]) {
  if (!isProd) return;
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag(...args);
    logDebug('gtag call', args);
  } else {
    logDebug('gtag not ready, dropped call', args);
  }
}

export function trackPageView(path: string, search: string, url: string) {
  gtag('event', 'page_view', {
    page_path: path,
    page_search: search,
    page_location: url,
  });
}

export function trackEvent(name: string, params: GTagEventParams = {}) {
  gtag('event', name, params);
}
