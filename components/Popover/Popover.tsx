"use client";

import React, {
  ReactNode,
  useRef,
  useId,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Local type for Popover toggle event
type PopoverToggleEvent = Event & {
  newState: 'open' | 'closed';
  oldState: 'open' | 'closed';
};

export interface PopoverProps {
  children: ReactNode;
  trigger: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  ariaLabel?: string;
  animationDuration?: number;
  // Use native popover API when available
  useNativePopover?: boolean;
}

export interface PopoverRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Web Popover API component with animation and accessibility support
 * Uses native popover API where available with graceful fallback
 */
export const Popover = forwardRef<PopoverRef, PopoverProps>(
  (
    {
      children,
      trigger,
      isOpen: controlledOpen,
      onOpenChange,
      position = 'bottom',
      offset = 8,
      className = '',
      triggerClassName = '',
      contentClassName = '',
      closeOnClickOutside = true,
      closeOnEscape = true,
      trapFocus = true,
      ariaLabel,
      animationDuration = 0.2,
      useNativePopover = true,
    },
    ref
  ) => {
    const popoverId = useId();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    
    const [internalOpen, setInternalOpen] = useState(false);
    const [supportsNativePopover, setSupportsNativePopover] = useState(false);
    const [popoverStyles, setPopoverStyles] = useState<React.CSSProperties>({});

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const setOpen = useCallback((open: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(open);
      }
      onOpenChange?.(open);
    }, [controlledOpen, onOpenChange]);

    // Check for native popover support
    useEffect(() => {
      const supported = typeof HTMLElement !== 'undefined' && 
        'popover' in HTMLElement.prototype &&
        useNativePopover;
      setSupportsNativePopover(supported);
    }, [useNativePopover]);

    // Handle native popover toggle event
    useEffect(() => {
      if (!supportsNativePopover || !popoverRef.current) return;

      const popover = popoverRef.current;
      const handleToggle = (event: Event) => {
        const toggleEvent = event as PopoverToggleEvent;
        setOpen(toggleEvent.newState === 'open');
      };

      popover.addEventListener('toggle', handleToggle);
      return () => popover.removeEventListener('toggle', handleToggle);
    }, [supportsNativePopover, setOpen]);

    // Position the popover (for both native and fallback)
    useEffect(() => {
      if (!isOpen || !triggerRef.current || !popoverRef.current) return;

      const updatePosition = () => {
        const triggerRect = triggerRef.current?.getBoundingClientRect();
        const popoverRect = popoverRef.current?.getBoundingClientRect();
        
        if (!triggerRect || !popoverRect) return;

        let styles: React.CSSProperties = {};
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        switch (position) {
          case 'top':
            styles = {
              position: 'fixed',
              left: triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2,
              top: triggerRect.top - popoverRect.height - offset,
            };
            // Flip if not enough space
            if (styles.top && (styles.top as number) < 0) {
              styles.top = triggerRect.bottom + offset;
            }
            break;
          case 'bottom':
            styles = {
              position: 'fixed',
              left: triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2,
              top: triggerRect.bottom + offset,
            };
            // Flip if not enough space
            if ((styles.top as number) + popoverRect.height > viewportHeight) {
              styles.top = triggerRect.top - popoverRect.height - offset;
            }
            break;
          case 'left':
            styles = {
              position: 'fixed',
              left: triggerRect.left - popoverRect.width - offset,
              top: triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2,
            };
            // Flip if not enough space
            if ((styles.left as number) < 0) {
              styles.left = triggerRect.right + offset;
            }
            break;
          case 'right':
            styles = {
              position: 'fixed',
              left: triggerRect.right + offset,
              top: triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2,
            };
            // Flip if not enough space
            if ((styles.left as number) + popoverRect.width > viewportWidth) {
              styles.left = triggerRect.left - popoverRect.width - offset;
            }
            break;
        }

        // Ensure popover stays within viewport
        if (styles.left !== undefined) {
          styles.left = Math.max(8, Math.min(styles.left as number, viewportWidth - popoverRect.width - 8));
        }
        if (styles.top !== undefined) {
          styles.top = Math.max(8, Math.min(styles.top as number, viewportHeight - popoverRect.height - 8));
        }

        setPopoverStyles(styles);
      };

      // Use requestAnimationFrame for smoother positioning
      const rafId = requestAnimationFrame(updatePosition);
      
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [isOpen, position, offset]);

    // Handle click outside
    useEffect(() => {
      if (!isOpen || !closeOnClickOutside) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          popoverRef.current &&
          !popoverRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closeOnClickOutside, setOpen]);

    // Handle escape key
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false);
          triggerRef.current?.focus();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, setOpen]);

    // Focus management
    useEffect(() => {
      if (!isOpen || !trapFocus || !popoverRef.current) return;

      const focusableElements = popoverRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, [isOpen, trapFocus]);

    // Imperative handle
    useImperativeHandle(ref, () => ({
      open: () => {
        if (supportsNativePopover && popoverRef.current) {
          (popoverRef.current as HTMLElement & { showPopover: () => void }).showPopover?.();
        } else {
          setOpen(true);
        }
      },
      close: () => {
        if (supportsNativePopover && popoverRef.current) {
          (popoverRef.current as HTMLElement & { hidePopover: () => void }).hidePopover?.();
        } else {
          setOpen(false);
        }
      },
      toggle: () => {
        if (supportsNativePopover && popoverRef.current) {
          (popoverRef.current as HTMLElement & { togglePopover: () => void }).togglePopover?.();
        } else {
          setOpen(!isOpen);
        }
      },
    }), [supportsNativePopover, isOpen, setOpen]);

    const handleTriggerClick = () => {
      if (supportsNativePopover && popoverRef.current) {
        (popoverRef.current as HTMLElement & { togglePopover: () => void }).togglePopover?.();
      } else {
        setOpen(!isOpen);
      }
    };

    const popoverVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: position === 'top' ? 8 : position === 'bottom' ? -8 : 0,
        x: position === 'left' ? 8 : position === 'right' ? -8 : 0,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        transition: {
          duration: animationDuration,
          ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
          duration: animationDuration * 0.75,
          ease: [0.4, 0, 1, 1] as [number, number, number, number],
        },
      },
    };

    // Native popover attributes
    const nativePopoverProps = supportsNativePopover
      ? {
          popover: 'auto' as const,
          id: popoverId,
        }
      : {};

    return (
      <div className={`popover-container ${className}`} style={{ display: 'inline-block' }}>
        <button
          ref={triggerRef}
          type="button"
          className={`popover-trigger ${triggerClassName}`}
          onClick={handleTriggerClick}
          aria-expanded={isOpen}
          aria-controls={popoverId}
          aria-haspopup="dialog"
          {...(supportsNativePopover ? { popoverTarget: popoverId } : {})}
        >
          {trigger}
        </button>

        {supportsNativePopover ? (
          <div
            ref={popoverRef}
            {...nativePopoverProps}
            className={`popover-content popover-content-native ${contentClassName}`}
            role="dialog"
            aria-label={ariaLabel}
            style={popoverStyles}
          >
            {children}
          </div>
        ) : (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={popoverRef}
                id={popoverId}
                className={`popover-content ${contentClassName}`}
                role="dialog"
                aria-label={ariaLabel}
                variants={popoverVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={popoverStyles}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  }
);

Popover.displayName = 'Popover';

export default Popover;
