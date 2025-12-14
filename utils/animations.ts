import { Variants, easeOut, Transition } from 'framer-motion';

// ============================================================================
// BASIC ANIMATION VARIANTS
// ============================================================================

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', delay: number = 0): Variants => ({
  hidden: {
    x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
    y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 0.8,
      delay,
      ease: 'easeOut',
    },
  },
});

export const scaleOnHover = {
    hover: {
        scale: 1.025,
        transition: {
            duration: 0.3,
        },
    },
    tap: {
        scale: 0.99,
    }
};

export const scaleIn: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    },
  };

// ============================================================================
// ENHANCED STAGGER VARIANTS
// ============================================================================

/**
 * Configurable stagger container for child animations
 */
export const staggerContainerAdvanced = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: staggerChildren * 0.5,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
});

/**
 * Grid stagger for multi-column layouts
 */
export const gridStagger = (columns: number = 3): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
});

// ============================================================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================================================

/**
 * Reveal animation for scroll-triggered content
 */
export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1], // Custom cubic bezier
    },
  },
};

/**
 * Slide in from edge with parallax effect
 */
export const slideInParallax = (
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  distance: number = 100
): Variants => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
    y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1], // Expo out
    },
  },
});

/**
 * Blur reveal animation
 */
export const blurReveal: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(12px)',
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// ============================================================================
// PAGE TRANSITION VARIANTS
// ============================================================================

/**
 * Page fade transition (for View Transitions fallback)
 */
export const pageFade: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

/**
 * Page slide transition
 */
export const pageSlide = (direction: 'left' | 'right' = 'left'): Variants => ({
  initial: {
    x: direction === 'left' ? '100%' : '-100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    x: direction === 'left' ? '-100%' : '100%',
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
});

/**
 * Scale and fade page transition
 */
export const pageScale: Variants = {
  initial: {
    scale: 0.95,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    scale: 1.05,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ============================================================================
// INTERACTIVE ANIMATIONS
// ============================================================================

/**
 * Enhanced hover with lift effect
 */
export const hoverLift = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  tap: {
    y: -4,
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

/**
 * Magnetic hover effect
 */
export const magneticHover = {
  rest: { x: 0, y: 0 },
  hover: {
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
};

/**
 * Button press animation
 */
export const buttonPress: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

/**
 * Icon spin on hover
 */
export const iconSpin = {
  rest: { rotate: 0 },
  hover: {
    rotate: 360,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

// ============================================================================
// TEXT ANIMATIONS
// ============================================================================

/**
 * Character stagger animation for text
 */
export const textRevealChar: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Word stagger animation
 */
export const textRevealWord: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * Typewriter effect container
 */
export const typewriterContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

// ============================================================================
// DECORATIVE ANIMATIONS
// ============================================================================

/**
 * Floating animation for decorative elements
 */
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Pulse glow animation
 */
export const pulseGlow: Variants = {
  initial: {
    boxShadow: '0 0 0 0 rgba(69, 115, 223, 0.4)',
  },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(69, 115, 223, 0.4)',
      '0 0 0 20px rgba(69, 115, 223, 0)',
      '0 0 0 0 rgba(69, 115, 223, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

/**
 * Shimmer loading effect
 */
export const shimmer: Variants = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Rotate animation for icons/loaders
 */
export const spin: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

/**
 * Card flip animation
 */
export const cardFlip: Variants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/**
 * Card stack animation
 */
export const cardStack = (index: number): Variants => ({
  hidden: {
    opacity: 0,
    y: 50 + index * 10,
    scale: 1 - index * 0.05,
  },
  visible: {
    opacity: 1,
    y: index * 8,
    scale: 1 - index * 0.02,
    transition: {
      duration: 0.5,
      delay: index * 0.1,
      ease: 'easeOut',
    },
  },
});

// ============================================================================
// LIST ANIMATIONS
// ============================================================================

/**
 * List item with slide and fade
 */
export const listItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Expandable list item
 */
export const expandableItem: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2 },
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.3, delay: 0.1 },
    },
  },
};

// ============================================================================
// MODAL/OVERLAY ANIMATIONS
// ============================================================================

/**
 * Modal overlay fade
 */
export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, delay: 0.1 },
  },
};

/**
 * Modal content animation
 */
export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
};

/**
 * Drawer slide animation
 */
export const drawer = (side: 'left' | 'right' | 'top' | 'bottom' = 'right'): Variants => {
  const transforms = {
    left: { x: '-100%' },
    right: { x: '100%' },
    top: { y: '-100%' },
    bottom: { y: '100%' },
  };

  return {
    hidden: {
      ...transforms[side],
      opacity: 0.5,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
      },
    },
    exit: {
      ...transforms[side],
      opacity: 0.5,
      transition: { duration: 0.25 },
    },
  };
};

// ============================================================================
// UTILITY TRANSITIONS
// ============================================================================

/**
 * Spring transition presets
 */
export const springPresets = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 } as Transition,
  snappy: { type: 'spring', stiffness: 400, damping: 25 } as Transition,
  bouncy: { type: 'spring', stiffness: 500, damping: 15 } as Transition,
  slow: { type: 'spring', stiffness: 50, damping: 20 } as Transition,
};

/**
 * Easing presets
 */
export const easingPresets = {
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6],
};

// ============================================================================
// GESTURE ANIMATIONS
// ============================================================================

/**
 * Drag and drop animation
 */
export const draggable: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  drag: {
    scale: 1.05,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    cursor: 'grabbing',
    zIndex: 100,
  },
};

/**
 * Swipe card animation
 */
export const swipeCard: Variants = {
  initial: {
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
  },
  exit: (direction: 'left' | 'right') => ({
    x: direction === 'left' ? -300 : 300,
    y: 50,
    rotate: direction === 'left' ? -20 : 20,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};
