"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function InternalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("[Internal Portal Error]", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "var(--error-bg, #fee)",
          border: "1px solid var(--error-border, #f00)",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "var(--int-error)" }}>
          ⚠️ Something went wrong
        </h2>
        <p style={{ marginBottom: "1rem", color: "var(--int-text-secondary)" }}>
          An error occurred while loading this page. This has been logged for investigation.
        </p>
        {error.digest && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--int-text-muted)",
              marginBottom: "1rem",
            }}
          >
            Error ID: {error.digest}
          </p>
        )}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              background: "var(--int-primary)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/internal"
            style={{
              padding: "0.5rem 1rem",
              background: "var(--int-text-muted)",
              color: "white",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
