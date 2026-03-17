'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const CLARITY_PROJECT_ID = 'vwwx8edouq';

export default function MicrosoftClarity() {
  const disabled = process.env.NODE_ENV !== 'production';
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const consent = localStorage.getItem('cookie_consent');
      setConsentGiven(consent === 'true');
    } catch {
      // localStorage not available
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cookie_consent') {
        setConsentGiven(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);

    const handleConsent = () => {
      try {
        setConsentGiven(localStorage.getItem('cookie_consent') === 'true');
      } catch {
        // noop
      }
    };
    window.addEventListener('cookie_consent_change', handleConsent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cookie_consent_change', handleConsent);
    };
  }, []);

  if (disabled || !consentGiven) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}
