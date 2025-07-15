"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./LoadingAnimation.module.css";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

interface LoadingAnimationProps {
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
  showLogo?: boolean;
  inline?: boolean;
  progress?: number;
  message?: string;
}

interface AnimationParticle {
  id: number;
  style: {
    top: string;
    left: string;
    animationDelay: string;
    scale: number;
    opacity: number;
    size: string;
    blur: string;
    color: string;
  };
}

export const LoadingAnimation = ({
  size = 'medium',
  fullscreen = false,
  showLogo = true,
  inline = false,
  progress,
  message
}: LoadingAnimationProps) => {
  const { theme } = useTheme();
  const animationRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<AnimationParticle[]>([]);
  const [progressDisplay, setProgressDisplay] = useState(0);

  useEffect(() => {
    if (typeof progress === 'number') {
      const targetProgress = Math.min(100, Math.max(0, progress));
      setProgressDisplay(targetProgress);
    }
  }, [progress]);

  // Calculate the CSS variable for progress
  const progressStyle = {
    '--progress': `${progressDisplay}%`
  } as React.CSSProperties;

  // Create particles with proper timing and positioning
  useEffect(() => {
    // Create a more sophisticated particle system with varying sizes and colors
    const newParticles = Array.from({ length: 15 }, (_, index) => {
      const primaryColor = 'var(--md-primary)';
      const secondaryColor = 'var(--md-secondary)';
      
      // Create a more natural distribution pattern
      const angle = (index / 15) * Math.PI * 2;
      const radius = 25 + Math.random() * 15; // Slightly tighter distribution
      const top = 50 + Math.sin(angle) * radius;
      const left = 50 + Math.cos(angle) * radius;

      return {
        id: index,
        style: {
          top: `${top}%`,
          left: `${left}%`,
          animationDelay: `${index * 0.15}s`,
          scale: 0.6 + Math.random() * 0.4, // Slightly larger base scale
          opacity: 0.7 + Math.random() * 0.3, // Higher base opacity
          size: `${3 + Math.random() * 2}px`, // More consistent sizes
          blur: `${0.5}px`, // Consistent, minimal blur
          color: index % 3 === 0 ? primaryColor : secondaryColor
        }
      };
    });

    setParticles(newParticles);
  }, []);

  return (
    <div 
      className={`${styles.loadingContainer} ${styles[size]} ${fullscreen ? styles.fullscreen : ''} ${inline ? styles.inline : ''}`}
      ref={animationRef}
    >
      {!inline && (
        <div className={styles.particles}>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={styles.particle}
              style={{
                ...particle.style,
                transform: `scale(${particle.style.scale})`,
                width: particle.style.size,
                height: particle.style.size,
                filter: `blur(${particle.style.blur})`,
                background: particle.style.color
              }}
            />
          ))}
        </div>
      )}
      <div className={styles.loadingWrapper}>
        <div 
          className={styles.progressRing}
          style={progressStyle}
        >
          <div className={`${styles.circle} ${styles.circle1}`}>
            <div className={styles.circleContent} />
          </div>
          <div className={`${styles.circle} ${styles.circle2}`}>
            <div className={styles.circleContent} />
          </div>
          <div className={`${styles.circle} ${styles.circle3}`}>
            <div className={styles.circleContent} />
          </div>
        </div>
        {showLogo && (
          <div className={styles.logo}>
            <div className={styles.logoGlow} />
            <Image
              src="/megicode-logo-alt.svg"
              alt="Megicode Logo"
              width={size === 'small' ? 20 : size === 'large' ? 60 : 40}
              height={size === 'small' ? 20 : size === 'large' ? 60 : 40}
              priority
              className={styles.logoImage}
            />
          </div>
        )}
        {message && (
          <div className={styles.messageWrapper}>
            <span className={styles.message}>{message}</span>
            {progress !== undefined && (
              <span className={styles.progressText}>{Math.round(progressDisplay)}%</span>
            )}
          </div>
        )}
      </div>
      <div className={styles.gridOverlay} />
    </div>
  );
};

export default LoadingAnimation;
