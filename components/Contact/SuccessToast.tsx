"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import styles from "./SuccessToast.module.css";

interface SuccessToastProps {
  show: boolean;
  onClose: () => void;
  message?: string;
}

const toastVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
};

export default function SuccessToast({ show, onClose, message = "Message sent successfully!" }: SuccessToastProps) {
  const { theme } = useTheme();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) {
      timerRef.current = setTimeout(onClose, 2500);
      if (toastRef.current) {
        toastRef.current.focus();
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={toastRef}
          className={styles.toast}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          tabIndex={0}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={toastVariants}
          transition={{ duration: 0.4 }}
          data-theme={theme}
        >
          <motion.span
            className={styles.icon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
            aria-label="Success"
          >
            ✅
          </motion.span>
          <span>{message}</span>
          <button
            className={styles.closeBtn}
            aria-label="Close notification"
            onClick={onClose}
            tabIndex={0}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
