"use client";

import React, { ReactNode } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
  blur?: boolean;
  scale?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * ScrollReveal component for scroll-triggered animations
 * Wraps children with a motion component that animates on scroll
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  threshold = 0.1,
  blur = false,
  scale = false,
  as = 'div',
}) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: '0px 0px -10% 0px',
  });

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { y: distance, x: 0 };
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialTransform(),
      filter: blur ? 'blur(10px)' : 'blur(0px)',
      scale: scale ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const MotionComponent = motion[as as keyof typeof motion] as React.ElementType;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </MotionComponent>
  );
};

export default ScrollReveal;
