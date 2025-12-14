"use client";

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  supportsViewTransitions,
  navigateWithTransition,
  navigateWithType,
  ViewTransitionType,
} from '@/utils/viewTransitions';

// Type for Document with optional View Transition support
type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition: () => void;
  };
};

/**
 * Hook for using View Transitions with Next.js navigation
 * Provides smooth page transitions when the API is supported
 */
export const useViewTransition = () => {
  const router = useRouter();
  const isSupported = supportsViewTransitions();

  /**
   * Navigate to a URL with a view transition
   */
  const navigate = useCallback(
    (url: string, transitionName?: string) => {
      navigateWithTransition(router, url, transitionName);
    },
    [router]
  );

  /**
   * Navigate with a specific transition type
   */
  const navigateWithEffect = useCallback(
    (url: string, type: ViewTransitionType = 'fade') => {
      navigateWithType(router, url, type);
    },
    [router]
  );

  /**
   * Go back with a transition
   */
  const goBack = useCallback(() => {
    const doc = document as DocumentWithViewTransition;
    if (supportsViewTransitions() && typeof document !== 'undefined' && doc.startViewTransition) {
      document.documentElement.dataset.viewTransitionType = 'slide-right';
      doc.startViewTransition(() => {
        router.back();
      }).finished.finally(() => {
        delete document.documentElement.dataset.viewTransitionType;
      });
    } else {
      router.back();
    }
  }, [router]);

  return {
    navigate,
    navigateWithEffect,
    goBack,
    isSupported,
  };
};

export default useViewTransition;
