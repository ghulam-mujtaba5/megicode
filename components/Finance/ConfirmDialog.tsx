/**
 * Confirmation Dialog Component
 * Safe destructive actions with undo capability
 */
'use client';

import { useState } from 'react';
import s from '../styles.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  const variantColors = {
    danger: { bg: 'var(--int-error-light)', border: 'var(--int-error)', text: 'var(--int-error)' },
    warning: { bg: 'var(--int-warning-light)', border: 'var(--int-warning)', text: 'var(--int-warning)' },
    info: { bg: 'var(--int-info-light)', border: 'var(--int-info)', text: 'var(--int-info)' },
  };

  const colors = variantColors[variant];

  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--int-bg)',
          borderRadius: 'var(--int-radius)',
          padding: 'var(--int-space-6)',
          maxWidth: '400px',
          width: '90%',
          zIndex: 100,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-3)', marginBottom: 'var(--int-space-4)' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: colors.bg,
              color: colors.text,
              fontSize: '1.25rem',
            }}
          >
            {variant === 'danger' ? '⚠️' : variant === 'warning' ? '⚡' : 'ℹ️'}
          </div>
          <h2 style={{ fontWeight: 600, margin: 0 }}>{title}</h2>
        </div>

        <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-6)' }}>{message}</p>

        <div
          style={{
            display: 'flex',
            gap: 'var(--int-space-3)',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className={`${s.btn} ${s.btnSecondary}`}
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            style={{
              padding: 'var(--int-space-2) var(--int-space-4)',
              borderRadius: 'var(--int-radius-sm)',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              background: colors.text,
              color: 'white',
              opacity: isProcessing ? 0.6 : 1,
            }}
          >
            {isProcessing ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}

// Hook for managing confirm dialogs
interface UseConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function useConfirm() {
  const [state, setState] = useState<{
    isOpen: boolean;
    options: UseConfirmOptions;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    options: { title: '', message: '' },
  });

  const confirm = (options: UseConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    state.resolve?.(true);
    setState({ isOpen: false, options: { title: '', message: '' } });
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState({ isOpen: false, options: { title: '', message: '' } });
  };

  return {
    confirm,
    Dialog: (
      <ConfirmDialog
        isOpen={state.isOpen}
        title={state.options.title}
        message={state.options.message}
        confirmLabel={state.options.confirmLabel}
        cancelLabel={state.options.cancelLabel}
        variant={state.options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    ),
  };
}
