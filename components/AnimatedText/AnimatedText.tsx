"use client";

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  type?: 'words' | 'chars' | 'lines';
  staggerDelay?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  effect?: 'fade' | 'slide' | 'blur' | 'bounce';
}

/**
 * AnimatedText component for staggered text animations
 * Splits text into words or characters and animates them individually
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  type = 'words',
  staggerDelay = 0.05,
  duration = 0.5,
  delay = 0,
  once = true,
  as = 'div',
  effect = 'slide',
}) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const getItemVariants = (): Variants => {
    switch (effect) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration, ease: 'easeOut' },
          },
        };
      case 'slide':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, ease: [0.25, 0.1, 0.25, 1] },
          },
        };
      case 'blur':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)', y: 10 },
          visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { duration, ease: 'easeOut' },
          },
        };
      case 'bounce':
        return {
          hidden: { opacity: 0, y: 30, scale: 0.8 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 200,
              damping: 10,
            },
          },
        };
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, ease: [0.25, 0.1, 0.25, 1] },
          },
        };
    }
  };

  const itemVariants = getItemVariants();

  const splitText = () => {
    switch (type) {
      case 'chars':
        return text.split('').map((char, i) => (
          <motion.span
            key={i}
            variants={itemVariants}
            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ));
      case 'lines':
        return text.split('\n').map((line, i) => (
          <motion.span
            key={i}
            variants={itemVariants}
            style={{ display: 'block' }}
          >
            {line}
          </motion.span>
        ));
      case 'words':
      default:
        return text.split(' ').map((word, i) => (
          <motion.span
            key={i}
            variants={itemVariants}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ));
    }
  };

  const MotionTag = motion[as] as React.ElementType;

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {splitText()}
    </MotionTag>
  );
};

export default AnimatedText;
