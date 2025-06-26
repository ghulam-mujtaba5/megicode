"use client";
import React from "react";
import CookieConsentBanner from "../components/CookieConsentBanner/CookieConsentBanner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CookieConsentBanner />
      {children}
    </>
  );
}
