"use client";
import React from "react";
import CookieConsentBanner from "../components/CookieConsentBanner/CookieConsentBanner";
import { usePageView } from "@/hooks/usePageView";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Track page views
  usePageView();

  return (
    <>
      <CookieConsentBanner />
      {children}
    </>
  );
}
