"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FocusTrap } from "../FocusTrap";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const variantStyles = {
  danger: {
    button: {
      background: "#ef4444",
      color: "#fff",
    },
    icon: "⚠️",
  },
  warning: {
    button: {
      background: "#f59e0b",
      color: "#000",
    },
    icon: "⚠️",
  },
  default: {
    button: {
      background: "#3b82f6",
      color: "#fff",
    },
    icon: "❓",
  },
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  // Escape key handling
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isLoading) {
          onCancel();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel, isLoading]);

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 9998,
            }}
            onClick={!isLoading ? onCancel : undefined}
            aria-hidden="true"
          />

          {/* Modal */}
          <FocusTrap isActive={isOpen}>
            <motion.div
              role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-description"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--bg-primary, #fff)",
              borderRadius: "12px",
              padding: "1.5rem",
              maxWidth: "400px",
              width: "90%",
              zIndex: 9999,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Icon */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "2rem" }}>{styles.icon}</span>
            </div>

            {/* Title */}
            <h2
              id="confirm-modal-title"
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                textAlign: "center",
                marginBottom: "0.5rem",
                color: "var(--text-primary, #1f2937)",
              }}
            >
              {title}
            </h2>

            {/* Message */}
            <p
              id="confirm-modal-description"
              style={{
                fontSize: "0.875rem",
                textAlign: "center",
                color: "var(--text-secondary, #6b7280)",
                marginBottom: "1.5rem",
              }}
            >
              {message}
            </p>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border, #e5e7eb)",
                  background: "transparent",
                  color: "var(--text-primary, #374151)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  opacity: isLoading ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  ...styles.button,
                }}
              >
                {isLoading && (
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid currentColor",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                )}
                {confirmText}
              </button>
            </div>
          </motion.div>
          </FocusTrap>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
