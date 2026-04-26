import type { Variants, Transition } from "framer-motion";

// Premium easing curves matching the static site's motion tokens
export const easing = {
  out: [0.16, 0.84, 0.3, 1] as const, // primary reveal
  spring: [0.34, 1.32, 0.42, 1] as const, // light overshoot
  soft: [0.32, 0.72, 0.32, 1] as const, // hover
};

export const baseTransition: Transition = {
  duration: 0.9,
  ease: easing.out,
};

// Fade up for headlines, sections, items
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easing.out },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: easing.out } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: easing.out } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: easing.out } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: easing.spring },
  },
};

// Stagger container — children animate sequentially
export const staggerContainer = (stagger = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

// Hero word stagger — for headline split by line/word
export const heroWord: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easing.out },
  },
};

// Hero supporting elements stagger
export const heroExtra: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easing.out },
  },
};

// Default viewport options for scroll-triggered reveals
export const viewportOnce = { once: true, amount: 0.2 } as const;
