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
  text: string;
  initialDelay: number;
}

interface ParticleItem {
  text: string;
  delay: number;
}

// Carefully selected keywords representing core technologies
const techKeywords = [
  { text: 'AI', delay: 0 },
  { text: 'React', delay: 0.5 },
  { text: 'Next.js', delay: 1 },
  { text: 'TypeScript', delay: 1.5 },
  { text: 'Python', delay: 2 },
  { text: 'Analytics', delay: 2.5 },
  { text: 'UI/UX', delay: 3 },
  { text: 'Cloud', delay: 3.5 }
];

// Code snippets with semantic meaning
const codeSnippets = [
  { text: 'async function', delay: 0.2 },
  { text: 'const data =', delay: 0.7 },
  { text: 'import React', delay: 1.2 },
  { text: 'useState<T>', delay: 1.7 },
  { text: 'export default', delay: 2.2 },
  { text: '=> void', delay: 2.7 },
  { text: 'interface Props', delay: 3.2 },
  { text: '<Component />', delay: 3.7 }
];

export const LoadingAnimation = ({
  size = 'medium',
  fullscreen = false,
  showLogo = true,
  inline = false
}: LoadingAnimationProps) => {
  const { theme } = useTheme();
  const animationRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<AnimationParticle[]>([]);
  const [codeParticles, setCodeParticles] = useState<AnimationParticle[]>([]);
  const [techParticles, setTechParticles] = useState<AnimationParticle[]>([]);

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
      },
      text: '',
      initialDelay: index * 0.2
    }));

    // Code snippet particles with semantic positioning
    const newCodeParticles = codeSnippets.map((snippet, index) => ({
      id: index + 100,
      style: {
        top: `${20 + (index * 60 / codeSnippets.length)}%`, // Distributed vertically
        left: `${15 + Math.random() * 30}%`, // Left side of the container
        animationDelay: `${snippet.delay}s`,
        scale: 0.9 + Math.random() * 0.2,
        opacity: 0.8
      },
      text: snippet.text,
      initialDelay: snippet.delay
    }));

    // Tech keyword particles with balanced distribution
    const newTechParticles = techKeywords.map((keyword, index) => ({
      id: index + 200,
      style: {
        top: `${20 + (index * 60 / techKeywords.length)}%`, // Distributed vertically
        left: `${55 + Math.random() * 30}%`, // Right side of the container
        animationDelay: `${keyword.delay}s`,
        scale: 0.9 + Math.random() * 0.2,
        opacity: 0.8
      },
      text: keyword.text,
      initialDelay: keyword.delay
    }));

    setParticles(newParticles);
    setCodeParticles(newCodeParticles);
    setTechParticles(newTechParticles);
  }, []);

  return (
    <div 
      className={`${styles.loadingContainer} ${styles[size]} ${fullscreen ? styles.fullscreen : ''} ${inline ? styles.inline : ''}`}
      ref={animationRef}
    >
      {!inline && (
        <>
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
          <div className={styles.codeParticles}>
            {codeParticles.map((particle) => (
              <div
                key={particle.id}
                className={`${styles.codeParticle} ${theme === 'dark' ? styles.darkTheme : ''}`}
                style={{
                  ...particle.style,
                  transform: `scale(${particle.style.scale})`
                }}
              >
                {particle.text}
              </div>
            ))}
          </div>
          <div className={styles.techParticles}>
            {techParticles.map((particle) => (
              <div
                key={particle.id}
                className={`${styles.techParticle} ${theme === 'dark' ? styles.darkTheme : ''}`}
                style={{
                  ...particle.style,
                  transform: `scale(${particle.style.scale})`
                }}
              >
                {particle.text}
              </div>
            ))}
          </div>
        </>
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
