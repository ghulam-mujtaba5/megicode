"use client";

import React, { ReactNode, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  effect?: 'scale' | 'magnetic' | 'ripple' | 'glow';
  ariaLabel?: string;
  fullWidth?: boolean;
}

/**
 * AnimatedButton component with various interactive effects
 * Includes scale, magnetic, ripple, and glow effects
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  size = 'md',
  effect = 'scale',
  ariaLabel,
  fullWidth = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  // Magnetic effect motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 400, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (effect !== 'magnetic' || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;

    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Ripple effect
    if (effect === 'ripple' && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick?.();
  };

  const getVariantStyles = () => {
    const baseStyles = {
      padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '12px 24px',
      fontSize: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      border: 'none',
      outline: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, var(--md-primary) 0%, var(--md-primary-variant) 100%)',
          color: 'var(--md-on-primary)',
        };
      case 'secondary':
        return {
          ...baseStyles,
          background: 'var(--md-secondary)',
          color: 'var(--md-on-secondary)',
        };
      case 'ghost':
        return {
          ...baseStyles,
          background: 'transparent',
          color: 'var(--md-primary)',
        };
      case 'outline':
        return {
          ...baseStyles,
          background: 'transparent',
          color: 'var(--md-primary)',
          border: '2px solid var(--md-primary)',
        };
      default:
        return baseStyles;
    }
  };

  const getHoverAnimation = () => {
    switch (effect) {
      case 'scale':
        return {
          scale: disabled ? 1 : 1.05,
          transition: { duration: 0.2 },
        };
      case 'glow':
        return {
          boxShadow: disabled
            ? 'none'
            : '0 0 20px var(--md-primary), 0 0 40px rgba(69, 115, 223, 0.3)',
          transition: { duration: 0.3 },
        };
      default:
        return {};
    }
  };

  const getTapAnimation = () => {
    if (disabled) return {};
    return { scale: 0.95, transition: { duration: 0.1 } };
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      className={className}
      disabled={disabled}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
      style={{
        ...getVariantStyles(),
        x: effect === 'magnetic' ? springX : 0,
        y: effect === 'magnetic' ? springY : 0,
      }}
      whileHover={getHoverAnimation()}
      whileTap={getTapAnimation()}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
      
      {/* Ripple effects */}
      {effect === 'ripple' &&
        ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.4)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        ))}
    </motion.button>
  );
};

export default AnimatedButton;
