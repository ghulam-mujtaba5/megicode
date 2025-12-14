"use client";

import React, { ReactNode, MouseEvent, useCallback } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { ViewTransitionType, setTransitionType, clearTransitionType } from '@/utils/viewTransitions';

interface TransitionLinkProps extends Omit<NextLinkProps, 'onClick'> {
  children: ReactNode;
  className?: string;
  transitionType?: ViewTransitionType;
  viewTransitionName?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * TransitionLink component for smooth page navigation with View Transitions
 * Automatically uses View Transitions API when available
 */
export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  className = '',
  transitionType = 'fade',
  viewTransitionName,
  onClick,
  disabled = false,
  ariaLabel,
  ...props
}) => {
  const router = useRouter();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      // Call custom onClick if provided
      onClick?.(e);

      // If default was prevented, don't navigate
      if (e.defaultPrevented) return;

      // Check if View Transitions API is supported
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        e.preventDefault();

        // Set transition type
        setTransitionType(transitionType);

        // Set view transition name on the element if provided
        if (viewTransitionName) {
          document.documentElement.style.setProperty(
            '--view-transition-name',
            viewTransitionName
          );
        }

        // Start the view transition
        const transition = (document as Document & { startViewTransition: (cb: () => void) => { finished: Promise<void> } }).startViewTransition(() => {
          router.push(href.toString());
        });

        // Clean up after transition
        transition.finished.finally(() => {
          clearTransitionType();
          if (viewTransitionName) {
            document.documentElement.style.removeProperty('--view-transition-name');
          }
        });
      }
      // If View Transitions not supported, let Next.js handle navigation normally
    },
    [disabled, href, onClick, router, transitionType, viewTransitionName]
  );

  return (
    <NextLink
      href={href}
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </NextLink>
  );
};

export default TransitionLink;
