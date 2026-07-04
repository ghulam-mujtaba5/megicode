'use client';

import Image from 'next/image';

import { useTheme } from '@/context/ThemeContext';

import styles from './LoadingAnimation.module.css';

interface LoadingAnimationProps {
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
  showLogo?: boolean;
  inline?: boolean;
  progress?: number;
  message?: string;
}

/* Ring geometry — viewBox 64×64, r 28 */
const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const LOGO_PX = { small: 16, medium: 36, large: 52 } as const;

/* What the "core" is doing while the page loads — same story the hero tells */
const STATUS_WORDS = ['designing', 'building', 'automating', 'shipping'];

/**
 * Pipeline-core loader: the Megicode core box (same motif as the hero
 * diagram) with a blueprint track ring and a brand-blue arc travelling
 * around it. Determinate when `progress` is given, indeterminate otherwise.
 */
export const LoadingAnimation = ({
  size = 'medium',
  fullscreen = false,
  showLogo = true,
  inline = false,
  progress,
  message,
}: LoadingAnimationProps) => {
  const { theme } = useTheme();

  const determinate = typeof progress === 'number';
  const clamped = determinate ? Math.min(100, Math.max(0, progress)) : 0;
  const dashOffset = determinate ? CIRCUMFERENCE * (1 - clamped / 100) : undefined;

  return (
    <div
      className={[
        styles.loadingContainer,
        styles[size],
        fullscreen ? styles.fullscreen : '',
        inline ? styles.inline : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-live="polite"
      aria-label={message ?? 'Loading'}
    >
      <div className={styles.ringWrap}>
        <svg
          className={`${styles.ring} ${determinate ? styles.ringDeterminate : ''}`}
          viewBox="0 0 64 64"
          aria-hidden="true"
        >
          <circle className={styles.track} cx="32" cy="32" r={RADIUS} />
          {determinate ? (
            <circle
              className={`${styles.arc} ${styles.arcDeterminate}`}
              cx="32"
              cy="32"
              r={RADIUS}
              style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: dashOffset }}
            />
          ) : (
            /* comet orbit: a bright pulse with a fading two-step tail,
               circling the blueprint track — the hero's traveling pulse,
               orbiting while the page gets built */
            <g className={styles.orbit}>
              <circle className={styles.tailFar} cx="32" cy="32" r={RADIUS} />
              <circle className={styles.tailNear} cx="32" cy="32" r={RADIUS} />
              <circle className={styles.orbitDot} cx="60" cy="32" r="3" />
            </g>
          )}
        </svg>
        {showLogo && (
          <div className={styles.core}>
            <span className={styles.coreGlow} aria-hidden="true" />
            <Image
              src={theme === 'dark' ? '/logo-navbar-dark.png' : '/logo-navbar-light.png'}
              alt=""
              width={LOGO_PX[size]}
              height={LOGO_PX[size]}
              priority
              className={styles.logoImage}
            />
          </div>
        )}
      </div>
      {(message || determinate) && (
        <div className={styles.messageWrapper}>
          {message && <span className={styles.message}>{message}</span>}
          {determinate && <span className={styles.progressText}>{Math.round(clamped)}%</span>}
        </div>
      )}
      {fullscreen && !message && !determinate && (
        <div className={styles.statusCycle} aria-hidden="true">
          {STATUS_WORDS.map((word, i) => (
            <span key={word} className={styles.statusWord} style={{ animationDelay: `${i * 2}s` }}>
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingAnimation;
