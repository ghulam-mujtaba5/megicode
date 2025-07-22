"use client";
import React, { useState } from "react";

interface CalendlyModalProps {
  url?: string;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_URL = "https://calendly.com/megicode";

export const CalendlyModal: React.FC<CalendlyModalProps> = ({ url = DEFAULT_URL, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "auto"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        maxWidth: 600,
        width: "95vw",
        minWidth: 320,
        maxHeight: "90vh",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        position: "relative",
        padding: 0,
        display: "flex",
        flexDirection: "column"
      }}>
        <button onClick={onClose} style={{
          position: "absolute",
          top: 8,
          right: 12,
          background: "none",
          border: "none",
          fontSize: 28,
          cursor: "pointer",
          color: "#333",
          zIndex: 2
        }} aria-label="Close">×</button>
        <iframe
          src={url + "?embed_domain=" + (typeof window !== "undefined" ? window.location.hostname : "") + "&embed_type=Inline"}
          width="100%"
          height="600"
          style={{ border: "none", borderRadius: 12, minHeight: 500, minWidth: 320 }}
          allow="camera; microphone; fullscreen"
          title="Schedule with Calendly"
        />
      </div>
    </div>
  );
};

// Example usage hook for opening the modal from any component
export function useCalendlyModal(url?: string): [() => void, React.JSX.Element] {
  const [open, setOpen] = useState(false);
  const modal = (
    <CalendlyModal url={url} isOpen={open} onClose={() => setOpen(false)} />
  );
  return [() => setOpen(true), modal];
}
