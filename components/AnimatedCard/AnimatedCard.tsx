"use client";

import React, { ReactNode, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover3D?: boolean;
  hoverLift?: boolean;
  hoverGlow?: boolean;
  glowColor?: string;
  as?: 'div' | 'article' | 'section' | 'li';
  onClick?: () => void;
}

/**
 * AnimatedCard component with 3D tilt, lift, and glow effects
 * Interactive card component with smooth animations
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hover3D = true,
  hoverLift = true,
  hoverGlow = false,
  glowColor = 'rgba(69, 115, 223, 0.4)',
  as = 'div',
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth animation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !hover3D) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const MotionTag = motion[as] as React.ElementType;

  return (
    <MotionTag
      ref={cardRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX: hover3D ? rotateX : 0,
        rotateY: hover3D ? rotateY : 0,
        cursor: onClick ? 'pointer' : 'default',
      }}
      animate={{
        y: hoverLift && isHovered ? -8 : 0,
        boxShadow: isHovered
          ? hoverGlow
            ? `0 20px 40px rgba(0, 0, 0, 0.15), 0 0 30px ${glowColor}`
            : '0 20px 40px rgba(0, 0, 0, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        y: { type: 'spring', stiffness: 400, damping: 25 },
        boxShadow: { duration: 0.3 },
      }}
    >
      {children}
    </MotionTag>
  );
};

export default AnimatedCard;
