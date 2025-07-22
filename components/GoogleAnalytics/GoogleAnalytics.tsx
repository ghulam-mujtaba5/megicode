'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  // Only render scripts in production
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-LXPDFC5P0R"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-LXPDFC5P0R');
        `}
      </Script>
    </>
  );
}
