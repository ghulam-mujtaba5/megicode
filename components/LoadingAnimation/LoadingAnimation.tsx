"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./LoadingAnimation.module.css";
import Image from 'next/image';
import { LOGO_ICON } from '@/lib/logo';
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
    transform: string;
    zIndex: number;
  };
  type: 'particle' | 'code' | 'tech';
  content?: string;
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
    // Create a more sophisticated particle system with varying types and behaviors
    const particleCount = 20;
    const codeSymbols = ['<>', '/>', '{()}', '[]', '#!/', '=>', '{}'];
    const techWords = ['AI', 'ML', 'API', 'UI/UX', 'DEV', 'CODE'];
    
    const newParticles = Array.from({ length: particleCount }, (_, index) => {
      const primaryColor = 'var(--md-primary)';
      const secondaryColor = 'var(--md-secondary)';
      
      // Create a sophisticated 3D distribution pattern
      const phi = Math.acos(-1 + (2 * index) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      const radius = 25 + Math.random() * 15;
      const depth = Math.random() * 100;
      
      // Calculate 3D position
      const x = 50 + radius * Math.cos(theta) * Math.sin(phi);
      const y = 50 + radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      // Determine particle type
      const typeRand = Math.random();
      const type: 'particle' | 'code' | 'tech' = typeRand > 0.7 ? 'code' : typeRand > 0.4 ? 'tech' : 'particle';
      
      // Generate content for code and tech particles
      const content = type === 'code' 
        ? codeSymbols[Math.floor(Math.random() * codeSymbols.length)]
        : type === 'tech'
          ? techWords[Math.floor(Math.random() * techWords.length)]
          : undefined;

      return {
        id: index,
        type,
        content,
        style: {
          top: `${y}%`,
          left: `${x}%`,
          animationDelay: `${index * 0.2}s`,
          scale: 0.6 + Math.random() * 0.4,
          opacity: 0.7 + Math.random() * 0.3,
          size: type === 'particle' ? `${3 + Math.random() * 2}px` : 'auto',
          blur: type === 'particle' ? `${0.5}px` : '0px',
          color: index % 3 === 0 ? primaryColor : secondaryColor,
          transform: `translateZ(${z}px) rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`,
          zIndex: Math.floor(z)
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
          {particles.map((particle) => {
            if (particle.type === 'particle') {
              return (
                <div
                  key={particle.id}
                  className={styles.particle}
                  style={{
                    ...particle.style,
                    transform: `${particle.style.transform} scale(${particle.style.scale})`,
                    width: particle.style.size,
                    height: particle.style.size,
                    filter: `blur(${particle.style.blur})`,
                    background: particle.style.color,
                    zIndex: particle.style.zIndex
                  }}
                />
              );
            } else if (particle.type === 'code') {
              return (
                <div
                  key={particle.id}
                  className={`${styles.codeParticle} ${theme === 'dark' ? styles.darkTheme : ''}`}
                  style={{
                    ...particle.style,
                    transform: particle.style.transform,
                    color: particle.style.color,
                    zIndex: particle.style.zIndex
                  }}
                >
                  {particle.content}
                </div>
              );
            } else {
              return (
                <div
                  key={particle.id}
                  className={`${styles.techParticle} ${theme === 'dark' ? styles.darkTheme : ''}`}
                  style={{
                    ...particle.style,
                    transform: particle.style.transform,
                    color: particle.style.color,
                    zIndex: particle.style.zIndex
                  }}
                >
                  {particle.content}
                </div>
              );
            }
          })}
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
              src={LOGO_ICON}
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
