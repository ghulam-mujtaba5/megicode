
"use client";
import { useEffect } from "react";

// Add noindex meta for SEO
if (typeof window === 'undefined') {
  const meta = { name: 'robots', content: 'noindex' };
  // For Next.js App Router, use the Head export if available
  // Otherwise, this is a placeholder for frameworks that support custom head tags
}

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Optionally log error to an error reporting service
    // console.error(error);
  }, [error]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
