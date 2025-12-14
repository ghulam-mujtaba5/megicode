"use client";

/**
 * View Transitions API utilities for smooth page navigation
 * Provides cross-browser support with graceful fallback
 */

// Type alias for View Transition (extends browser's built-in type when available)
type ViewTransitionExt = {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};

// Type for Document with optional View Transition support
type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransitionExt;
};

/**
 * Check if View Transitions API is supported
 */
export const supportsViewTransitions = (): boolean => {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
};

/**
 * Start a view transition with fallback for unsupported browsers
 */
export const startViewTransition = async (
  callback: () => void | Promise<void>
): Promise<void> => {
  const doc = document as DocumentWithViewTransition;
  if (supportsViewTransitions() && doc.startViewTransition) {
    const transition = doc.startViewTransition(callback);
    await transition.finished;
  } else {
    // Fallback: just execute the callback
    await callback();
  }
};

/**
 * Navigate with view transition - for use with Next.js router
 */
export const navigateWithTransition = (
  router: { push: (url: string) => void },
  url: string,
  transitionName?: string
): void => {
  const doc = document as DocumentWithViewTransition;
  if (transitionName) {
    document.documentElement.style.setProperty('--view-transition-name', transitionName);
  }

  if (supportsViewTransitions() && doc.startViewTransition) {
    doc.startViewTransition(() => {
      router.push(url);
    });
  } else {
    router.push(url);
  }
};

/**
 * Apply view transition name to an element temporarily during navigation
 */
export const withViewTransitionName = (
  element: HTMLElement | null,
  name: string,
  callback: () => void
): void => {
  if (!element) {
    callback();
    return;
  }

  const previousName = (element.style as CSSStyleDeclaration & { viewTransitionName?: string }).viewTransitionName;
  (element.style as CSSStyleDeclaration & { viewTransitionName?: string }).viewTransitionName = name;

  startViewTransition(callback).finally(() => {
    (element.style as CSSStyleDeclaration & { viewTransitionName?: string }).viewTransitionName = previousName || '';
  });
};

/**
 * Animation types for different transition effects
 */
export type ViewTransitionType = 
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'scale'
  | 'morph';

/**
 * Set the transition type by adding a data attribute
 */
export const setTransitionType = (type: ViewTransitionType): void => {
  document.documentElement.dataset.viewTransitionType = type;
};

/**
 * Clear the transition type after animation completes
 */
export const clearTransitionType = (): void => {
  delete document.documentElement.dataset.viewTransitionType;
};

/**
 * Navigate with a specific transition type
 */
export const navigateWithType = (
  router: { push: (url: string) => void },
  url: string,
  type: ViewTransitionType
): void => {
  const doc = document as DocumentWithViewTransition;
  setTransitionType(type);
  
  if (supportsViewTransitions() && doc.startViewTransition) {
    const transition = doc.startViewTransition(() => {
      router.push(url);
    });
    
    transition.finished.finally(() => {
      clearTransitionType();
    });
  } else {
    router.push(url);
    clearTransitionType();
  }
};
