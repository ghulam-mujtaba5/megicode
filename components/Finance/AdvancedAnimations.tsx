/**
 * Advanced Animations & Transitions
 * Smooth, performant animations for enhanced UX velocity
 */
'use client';

import { useState, useEffect } from 'react';

// Number animation (incremental counter)
interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 600,
  prefix = '',
  suffix = '',
  format,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === displayValue) return;

    const startTime = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newValue = startValue + difference * progress;
      setDisplayValue(Math.floor(newValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration, displayValue]);

  const formatted = format ? format(displayValue) : displayValue.toLocaleString();

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// Fade in with scale
interface FadeInScaleProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeInScale({ children, delay = 0, duration = 400 }: FadeInScaleProps) {
  return (
    <div
      style={{
        animation: `fadeInScale ${duration}ms ease-out ${delay}ms both`,
      }}
    >
      {children}
    </div>
  );
}

// Slide in from direction
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  duration?: number;
}

export function SlideIn({ children, direction = 'left', delay = 0, duration = 400 }: SlideInProps) {
  const directionMap = {
    left: `slideInFromLeft ${duration}ms ease-out ${delay}ms both`,
    right: `slideInFromRight ${duration}ms ease-out ${delay}ms both`,
    top: `slideInFromTop ${duration}ms ease-out ${delay}ms both`,
    bottom: `slideInFromBottom ${duration}ms ease-out ${delay}ms both`,
  };

  return <div style={{ animation: directionMap[direction] }}>{children}</div>;
}

// Stagger animation for list items
interface StaggerChildrenProps {
  children: React.ReactNode[];
  delay?: number;
  staggerDelay?: number;
}

export function StaggerChildren({
  children,
  delay = 0,
  staggerDelay = 100,
}: StaggerChildrenProps) {
  return (
    <>
      {children.map((child, idx) => (
        <FadeInScale key={idx} delay={delay + idx * staggerDelay}>
          {child}
        </FadeInScale>
      ))}
    </>
  );
}

// Pulse animation
interface PulseProps {
  children: React.ReactNode;
  active?: boolean;
}

export function Pulse({ children, active = true }: PulseProps) {
  if (!active) return <>{children}</>;

  return (
    <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      {children}
    </div>
  );
}

// Bounce animation
interface BounceProps {
  children: React.ReactNode;
  delay?: number;
}

export function Bounce({ children, delay = 0 }: BounceProps) {
  return (
    <div style={{ animation: `bounce 1s ease-in-out ${delay}ms infinite` }}>
      {children}
    </div>
  );
}

// Flip animation
interface FlipProps {
  children: React.ReactNode;
  isFlipped?: boolean;
  duration?: number;
}

export function Flip({ children, isFlipped = false, duration = 600 }: FlipProps) {
  return (
    <div
      style={{
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: `transform ${duration}ms ease-in-out`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

// Global CSS animations (add to your global styles)
export const ANIMATION_STYLES = `
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
`;
