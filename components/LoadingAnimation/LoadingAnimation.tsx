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
}

interface AnimationParticle {
  id: number;
  style: {
    top: string;
    left: string;
    animationDelay: string;
    scale: number;
    opacity: number;
  };
}

export const LoadingAnimation = ({
  size = 'medium',
  fullscreen = false,
  showLogo = true,
  inline = false
}: LoadingAnimationProps) => {
  const { theme } = useTheme();
  const animationRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<AnimationParticle[]>([]);

  // Create particles with proper timing and positioning
  useEffect(() => {
    // Background particles with subtle movement
    const newParticles = Array.from({ length: 12 }, (_, index) => ({
      id: index,
      style: {
        top: `${10 + Math.random() * 80}%`, // Keep particles more centered
        left: `${10 + Math.random() * 80}%`,
        animationDelay: `${index * 0.2}s`, // Staggered timing
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.6 + Math.random() * 0.4
      }
    }));

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
                transform: `scale(${particle.style.scale})`
              }}
            />
          ))}
        </div>
      )}
      <div className={styles.loadingWrapper}>
        <div className={`${styles.circle} ${styles.circle1}`}>
          <div className={styles.circleContent} />
        </div>
        <div className={`${styles.circle} ${styles.circle2}`}>
          <div className={styles.circleContent} />
        </div>
        <div className={`${styles.circle} ${styles.circle3}`}>
          <div className={styles.circleContent} />
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
      </div>
      <div className={styles.gridOverlay} />
    </div>
  );
};

export default LoadingAnimation;
