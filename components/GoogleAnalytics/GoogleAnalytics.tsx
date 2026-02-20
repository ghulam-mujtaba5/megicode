'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const disabled = process.env.NODE_ENV !== 'production' || !measurementId;

  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const consent = localStorage.getItem('cookie_consent');
      setConsentGiven(consent === 'true');
    } catch {
      // localStorage not available
    }

    // Listen for consent changes from CookieConsentBanner
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cookie_consent') {
        setConsentGiven(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);

    // Also listen for custom event (same-tab consent changes)
    const handleConsent = () => {
      try {
        setConsentGiven(localStorage.getItem('cookie_consent') === 'true');
      } catch { /* noop */ }
    };
    window.addEventListener('cookie_consent_change', handleConsent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cookie_consent_change', handleConsent);
    };
  }, []);

  if (disabled || !consentGiven) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // Disable automatic page_view so we control all views manually
          gtag('config', '${measurementId}', {
            send_page_view: false,
            cookie_domain: 'megicode.com',
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}
