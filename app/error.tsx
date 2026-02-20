"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LOGO_MAIN_LIGHT, LOGO_MAIN_DARK } from "@/lib/logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("[App Error]", error);
  }, [error]);

  // Detect dark mode preference (error boundary may not have ThemeContext)
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: isDark ? "#1d2127" : "var(--bg-primary, #fff)",
        color: isDark ? "#fff" : "var(--text-primary, #333)",
      }}
    >
      <Link href="/" style={{ marginBottom: "2rem" }}>
        <Image
          src={isDark ? LOGO_MAIN_DARK : LOGO_MAIN_LIGHT}
          alt="Megicode"
          height={40}
          width={150}
          style={{ height: "40px", width: "auto" }}
        />
      </Link>
      <h1
        style={{
          fontSize: "1.5rem",
          marginBottom: "1rem",
          color: isDark ? "#f1f5f9" : "var(--text-primary, #333)",
        }}
      >
        Something went wrong!
      </h1>
      <p
        style={{
          marginBottom: "1.5rem",
          color: isDark ? "#94a3b8" : "var(--text-secondary, #666)",
          maxWidth: "400px",
        }}
      >
        We apologize for the inconvenience. Please try again or return to the homepage.
      </p>
      {error.digest && (
        <p
          style={{
            fontSize: "0.75rem",
            color: isDark ? "#64748b" : "var(--text-muted, #999)",
            marginBottom: "1rem",
          }}
        >
          Error ID: {error.digest}
        </p>
      )}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => reset()}
          style={{
            padding: "0.75rem 1.5rem",
            background: "var(--primary, #0070f3)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: "0.75rem 1.5rem",
            background: "transparent",
            color: isDark ? "#f1f5f9" : "var(--text-primary, #333)",
            border: isDark ? "1px solid #334155" : "1px solid var(--border, #ddd)",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
