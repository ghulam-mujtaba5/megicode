import type { Variants } from 'framer-motion';

/**
 * Site-wide motion tokens (docs/PREMIUM-REDESIGN-PLAN.md §4).
 * One easing curve, three durations — every section entrance and hover
 * derives from these so the whole site moves as one system.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  fast: 0.25,
  base: 0.5,
  slow: 0.7,
} as const;

/** Standard section/element entrance: fade in while rising 20px. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};

/** Container variant that staggers its children's `fadeUp`/`cardIn` entrances. */
export const stagger = (delayChildren = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delayChildren, delayChildren: 0.04 } },
});

/** Card entrance used inside a `stagger` container. */
export const cardIn: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: DUR.base, ease: EASE } },
};

/** Hover lift for interactive cards — pass to `whileHover`. */
export const cardHover = {
  y: -4,
  transition: { duration: DUR.fast, ease: EASE },
} as const;

/** Standard once-only viewport config for scroll reveals. */
export const viewportOnce = { once: true, margin: '-60px' } as const;
