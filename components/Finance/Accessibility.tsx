/**
 * Tooltips & Contextual Help Component
 * Accessibility enhancements with inline help
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import s from '../styles.module.css';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            ...positionStyles[position],
            background: 'var(--int-primary)',
            color: 'white',
            padding: 'var(--int-space-2) var(--int-space-3)',
            borderRadius: 'var(--int-radius-sm)',
            fontSize: 'var(--int-text-xs)',
            fontWeight: 600,
            maxWidth: '200px',
            whiteSpace: 'normal',
            zIndex: 1000,
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          {content}
          <div
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              background: 'var(--int-primary)',
              transform: 'rotate(45deg)',
              ...(position === 'top' && { bottom: '-3px', left: '50%', marginLeft: '-3px' }),
              ...(position === 'bottom' && { top: '-3px', left: '50%', marginLeft: '-3px' }),
              ...(position === 'left' && { right: '-3px', top: '50%', marginTop: '-3px' }),
              ...(position === 'right' && { left: '-3px', top: '50%', marginTop: '-3px' }),
            }}
          />
        </div>
      )}
    </div>
  );
}

// Help icon with tooltip
interface HelpIconProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpIcon({ content, position = 'top' }: HelpIconProps) {
  return (
    <Tooltip content={content} position={position}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'var(--int-info)',
          color: 'white',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'help',
          marginLeft: 'var(--int-space-1)',
          flexShrink: 0,
        }}
      >
        ?
      </span>
    </Tooltip>
  );
}

// Accessibility attributes builder
export const A11Y = {
  label: (text: string) => ({ 'aria-label': text }),
  describedBy: (id: string) => ({ 'aria-describedby': id }),
  labelledBy: (id: string) => ({ 'aria-labelledby': id }),
  required: { 'aria-required': 'true' },
  invalid: { 'aria-invalid': 'true' },
  busy: { 'aria-busy': 'true' },
  hidden: { 'aria-hidden': 'true' },
  expanded: (isOpen: boolean) => ({ 'aria-expanded': isOpen }),
  controls: (id: string) => ({ 'aria-controls': id }),
  selected: (isSelected: boolean) => ({ 'aria-selected': isSelected }),
  checked: (isChecked: boolean) => ({ 'aria-checked': isChecked }),
} as const;

// Accessible button with icon and description
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  description?: string;
  tooltip?: string;
}

export function AccessibleButton({
  label,
  icon,
  description,
  tooltip,
  ...props
}: AccessibleButtonProps) {
  const button = (
    <button
      aria-label={description || label}
      title={tooltip || description}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--int-space-1)',
        ...((props.style || {}) as any),
      }}
      {...props}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position="top">
        {button}
      </Tooltip>
    );
  }

  return button;
}

// Guided tour for onboarding
interface GuidedTourStep {
  element: string; // CSS selector
  title: string;
  description: string;
  action?: {
    label: string;
    primaryAction?: boolean;
  };
}

interface GuidedTourProps {
  steps: GuidedTourStep[];
  isActive: boolean;
  onClose: () => void;
}

export function GuidedTour({ steps, isActive, onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isActive || steps.length === 0) return null;

  const step = steps[currentStep];
  const element = document.querySelector(step.element);
  const rect = element?.getBoundingClientRect();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 999,
          pointerEvents: 'auto',
        }}
      />

      {/* Highlight */}
      {rect && (
        <div
          style={{
            position: 'fixed',
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            border: '2px solid var(--int-primary)',
            borderRadius: 'var(--int-radius)',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        style={{
          position: 'fixed',
          top: (rect?.bottom || 0) + 16,
          left: Math.max(16, Math.min((rect?.left || 0) + (rect?.width || 0) / 2 - 150, window.innerWidth - 316)),
          width: '300px',
          background: 'var(--int-bg)',
          padding: 'var(--int-space-4)',
          borderRadius: 'var(--int-radius)',
          zIndex: 1001,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ marginBottom: 'var(--int-space-2)' }}>
          <span style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <h3 style={{ fontWeight: 600, marginBottom: 'var(--int-space-2)', margin: 0 }}>{step.title}</h3>
        <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', margin: '0 0 var(--int-space-3) 0' }}>
          {step.description}
        </p>
        <div style={{ display: 'flex', gap: 'var(--int-space-2)', justifyContent: 'space-between' }}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{
              padding: 'var(--int-space-1) var(--int-space-3)',
              border: '1px solid var(--int-border)',
              background: 'var(--int-bg)',
              borderRadius: 'var(--int-radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--int-text-xs)',
              opacity: currentStep === 0 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>
          <button
            onClick={onClose}
            style={{
              padding: 'var(--int-space-1) var(--int-space-3)',
              border: 'none',
              background: 'transparent',
              borderRadius: 'var(--int-radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--int-text-xs)',
              color: 'var(--int-text-muted)',
            }}
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            style={{
              padding: 'var(--int-space-1) var(--int-space-3)',
              background: 'var(--int-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--int-radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--int-text-xs)',
            }}
          >
            {currentStep === steps.length - 1 ? 'Done' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );
}
