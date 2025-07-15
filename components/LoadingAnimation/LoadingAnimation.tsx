"use client";

import { useEffect, useState } from "react";
import styles from "./LoadingAnimation.module.css";
import Image from "next/image";

interface LoadingAnimationProps {
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
  showLogo?: boolean;
  inline?: boolean;
}

export const LoadingAnimation = ({
  size = 'medium',
  fullscreen = false,
  showLogo = true,
  inline = false
}: LoadingAnimationProps) => {
  const [particles, setParticles] = useState<{ id: number; style: { top: string; left: string; animationDelay: string } }[]>([]);

  useEffect(() => {
    // Create random particles
    const newParticles = Array.from({ length: 12 }, (_, index) => ({
      id: index,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`
      }
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className={`${styles.loadingContainer} ${styles[size]} ${fullscreen ? styles.fullscreen : ''} ${inline ? styles.inline : ''}`}>
      <div className={styles.particles}>
        {!inline && particles.map((particle) => (
          <div
            key={particle.id}
            className={styles.particle}
            style={particle.style}
          />
        ))}
      </div>
      <div className={styles.loadingWrapper}>
        <div className={styles.circle + " " + styles.circle1} />
        <div className={styles.circle + " " + styles.circle2} />
        <div className={styles.circle + " " + styles.circle3} />
        {showLogo && (
          <div className={styles.logo}>
            <Image
              src="/megicode-logo-alt.svg"
              alt="Megicode Logo"
              width={size === 'small' ? 20 : size === 'large' ? 60 : 40}
              height={size === 'small' ? 20 : size === 'large' ? 60 : 40}
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingAnimation;
