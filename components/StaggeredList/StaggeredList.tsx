"use client";

import React, { ReactNode, Children, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
  as?: 'ul' | 'ol' | 'div';
  itemAs?: 'li' | 'div' | 'article';
}

/**
 * StaggeredList component for animating lists with staggered entrance
 * Children are automatically wrapped and animated with stagger effect
 */
export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className = '',
  itemClassName = '',
  staggerDelay = 0.1,
  duration = 0.5,
  direction = 'up',
  once = true,
  as = 'ul',
  itemAs = 'li',
}) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const getItemVariants = (): Variants => {
    const distance = 30;
    const transforms = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
    };

    return {
      hidden: {
        opacity: 0,
        ...transforms[direction],
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          ease: [0.25, 0.1, 0.25, 1],
        },
      },
    };
  };

  const itemVariants = getItemVariants();
  const childArray = Children.toArray(children);

  const MotionContainer = motion[as] as React.ElementType;
  const MotionItem = motion[itemAs] as React.ElementType;

  return (
    <MotionContainer
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ listStyle: as === 'div' ? 'none' : undefined }}
    >
      {childArray.map((child, index) => (
        <MotionItem
          key={index}
          className={itemClassName}
          variants={itemVariants}
        >
          {child}
        </MotionItem>
      ))}
    </MotionContainer>
  );
};

export default StaggeredList;
