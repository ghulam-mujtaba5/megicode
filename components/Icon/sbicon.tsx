

"use client";
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';
import Image from 'next/image';
import { LOGO_MAIN_LIGHT, LOGO_MAIN_DARK } from '@/lib/logo';
import styles from './sbicon.module.css'; // Ensure the correct path and module import

const ThemeToggleIcon = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [animate, setAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const iconRef = useRef<HTMLDivElement | null>(null);

  const handleIconClick = useCallback(() => {
    router.push('/');
  }, [router]);

  const iconClass = useMemo(() => {
    return `${styles['theme-toggle-icon']} ${theme === 'light' ? styles.light : styles.dark} ${animate ? styles.animate : ''}`;
  }, [theme, animate]);

  const iconSrc = useMemo(() => {
    return theme === 'dark' ? LOGO_MAIN_DARK : LOGO_MAIN_LIGHT;
  }, [theme]);

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isMobile = mounted && typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false;
  // Per requirement: Show different icons for light/dark theme
  if (mounted && theme !== 'dark' && theme !== 'light') return null;
  if (!isMobile) return null;

  return (
    <div
      ref={iconRef}
      className={iconClass}
      onClick={handleIconClick}
      role="button"
      aria-label="Go to Megicode Home"
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
