"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  type?: 'fade' | 'slide' | 'scale' | 'slideUp' | 'none';
  duration?: number;
}

/**
 * PageTransition component for smooth page transitions
 * Wraps page content with animated transitions
 * Falls back gracefully when View Transitions API is available
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  type = 'fade',
  duration = 0.4,
}) => {
  const pathname = usePathname();
  const [supportsViewTransitions, setSupportsViewTransitions] = useState(false);

  useEffect(() => {
    // Check if View Transitions API is supported
    setSupportsViewTransitions(
      typeof document !== 'undefined' && 'startViewTransition' in document
    );
  }, []);

  const variants: Record<string, Variants> = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration, ease: 'easeInOut' } },
      exit: { opacity: 0, transition: { duration: duration * 0.75, ease: 'easeInOut' } },
    },
    slide: {
      initial: { x: 20, opacity: 0 },
      animate: {
        x: 0,
        opacity: 1,
        transition: { duration, ease: [0.25, 0.1, 0.25, 1] },
      },
      exit: {
        x: -20,
        opacity: 0,
        transition: { duration: duration * 0.75, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    slideUp: {
      initial: { y: 20, opacity: 0 },
      animate: {
        y: 0,
        opacity: 1,
        transition: { duration, ease: [0.25, 0.1, 0.25, 1] },
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: { duration: duration * 0.75, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    scale: {
      initial: { scale: 0.98, opacity: 0 },
      animate: {
        scale: 1,
        opacity: 1,
        transition: { duration, ease: [0.25, 0.1, 0.25, 1] },
      },
      exit: {
        scale: 1.02,
        opacity: 0,
        transition: { duration: duration * 0.75, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
    },
  };

  // If View Transitions API is supported, don't duplicate animations
  if (supportsViewTransitions || type === 'none') {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className={className}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants[type]}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
