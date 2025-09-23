'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Only render scripts in production and if measurement ID is available
  if (process.env.NODE_ENV !== 'production' || !measurementId) {
    console.warn(
      process.env.NODE_ENV !== 'production'
        ? 'Google Analytics is disabled in development mode.'
        : 'Google Analytics Measurement ID is not set.'
    );
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onLoad={() => {

        }}
        onError={(e) => {
          console.error('Error loading Google Analytics script:', e);
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            cookie_domain: 'megicode.com',
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}
