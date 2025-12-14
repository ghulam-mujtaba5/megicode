"use client";
import React, { Suspense } from "react";
import CookieConsentBanner from "../components/CookieConsentBanner/CookieConsentBanner";
import { usePageView } from "@/hooks/usePageView";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";

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
      <ScrollProgressBar position="top" height={3} gradient />
      <PageTransition type="fade" duration={0.3}>
        {children}
      </PageTransition>
      <CookieConsentBanner />
    </>
  );
}
