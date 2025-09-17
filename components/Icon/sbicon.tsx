

"use client";
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';
import Image from 'next/image';
import { LOGO_ICON } from '@/lib/logo';
import styles from './sbicon.module.css'; // Ensure the correct path and module import

const ThemeToggleIcon = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [animate, setAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const iconRef = useRef<HTMLDivElement | null>(null);

  const handleIconClick = useCallback(() => {
    window.location.href = '/'; // Go to Megicode home page
  }, []);

  const iconClass = useMemo(() => {
    return `${styles['theme-toggle-icon']} ${theme === 'light' ? styles.light : styles.dark} ${animate ? styles.animate : ''}`;
  }, [theme, animate]);

  const iconSrc = useMemo(() => {
    return LOGO_ICON;
  }, []);

  useEffect(() => {
    // Only show on mobile screens
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setAnimate(true);
          setHasAnimated(true);
          setTimeout(() => setAnimate(false), 1000); // Match duration with animation time
        }
      },
      { threshold: 0.1 }
    );

    if (iconRef.current) {
      observer.observe(iconRef.current);
    }

    return () => {
      if (iconRef.current) {
        observer.unobserve(iconRef.current);
      }
    };
  }, [hasAnimated]);

  // Only render on mobile screens
  const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false;
  if (!isMobile) return null;

  return (
    <div
      ref={iconRef}
      className={iconClass}
      onClick={handleIconClick}
      role="button"
      aria-label="Toggle Theme and Navigate to Megicode"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleIconClick();
        }
      }}
    >
      <Image src={iconSrc} alt="Megicode Logo Icon" width={28} height={28} />
    </div>
  );
};

export default ThemeToggleIcon;
