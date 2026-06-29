'use client';
import React, { useEffect, useState } from 'react';

interface CalendlyModalProps {
  url?: string;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_URL = 'https://calendly.com/megicode';

export const CalendlyModal: React.FC<CalendlyModalProps> = ({
  url = DEFAULT_URL,
  isOpen,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Lock body scroll while open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const iframeSrc =
    url +
    (url.includes('?') ? '&' : '?') +
    'embed_domain=' +
    (typeof window !== 'undefined' ? window.location.hostname : '') +
    '&embed_type=Inline';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Schedule a meeting"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.65)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      {/* Modal card — stop propagation so clicking inside doesn't close */}
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          width: '100%',
          maxWidth: 640,
          maxHeight: 'calc(100vh - 32px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.32)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header row with close button — always above the iframe */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '10px 12px 6px',
            flexShrink: 0,
            background: '#fff',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close scheduling modal"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.08)',
              color: '#333',
              fontSize: 22,
              lineHeight: 1,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.16)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.08)';
            }}
          >
            ×
          </button>
        </div>

        {/* Scheduling iframe */}
        <iframe
          src={iframeSrc}
          width="100%"
          style={{
            border: 'none',
            flex: 1,
            minHeight: 480,
            display: 'block',
          }}
          allow="camera; microphone; fullscreen"
          title="Schedule a meeting with Megicode"
        />
      </div>
    </div>
  );
};

export function useCalendlyModal(url?: string): [() => void, React.JSX.Element] {
  const [open, setOpen] = useState(false);
  const modal = <CalendlyModal url={url} isOpen={open} onClose={() => setOpen(false)} />;
  return [() => setOpen(true), modal];
}
