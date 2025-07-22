"use client";
import React, { Suspense } from "react";
import CookieConsentBanner from "../components/CookieConsentBanner/CookieConsentBanner";
import { usePageView } from "@/hooks/usePageView";

function AnalyticsWrapper() {
  usePageView();
  return null;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsWrapper />
      </Suspense>
      <CookieConsentBanner />
      {children}
    </>
  );
}
