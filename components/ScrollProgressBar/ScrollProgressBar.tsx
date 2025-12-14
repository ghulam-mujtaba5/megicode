"use client";

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface ScrollProgressBarProps {
  position?: 'top' | 'bottom';
  height?: number;
  showPercentage?: boolean;
  gradient?: boolean;
}

/**
 * ScrollProgressBar component
 * Shows a progress bar indicating scroll position through the page
 */
export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  position = 'top',
  height = 3,
  showPercentage = false,
  gradient = true,
}) => {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!showPercentage) return;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });

    return () => unsubscribe();
  }, [scrollYProgress, showPercentage]);

  const gradientLight = 'linear-gradient(90deg, #4573df 0%, #ff9800 50%, #4573df 100%)';
  const gradientDark = 'linear-gradient(90deg, #5a8af7 0%, #ffb74d 50%, #5a8af7 100%)';
  const solidColor = theme === 'dark' ? '#5a8af7' : '#4573df';

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          [position]: 0,
          height,
          background: gradient
            ? theme === 'dark'
              ? gradientDark
              : gradientLight
            : solidColor,
          transformOrigin: 'left',
          scaleX,
          zIndex: 9999,
        }}
      />
      
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            [position]: height + 8,
            right: 16,
            padding: '4px 12px',
            borderRadius: '20px',
            background: theme === 'dark' ? 'rgba(42, 47, 56, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            color: theme === 'dark' ? '#eaf6ff' : '#23272f',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
          }}
        >
          {percentage}%
        </motion.div>
      )}
    </>
  );
};

export default ScrollProgressBar;
