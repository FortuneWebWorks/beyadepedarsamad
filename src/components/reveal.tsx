"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

// `false` during SSR *and* the first client render, so both trees agree; the
// store then reports `true` on the very next commit.
const noopSubscribe = () => () => {};
const getClientFlag = () => true;

/**
 * `useReducedMotion()` reports `null` while server-rendering and the real value
 * once hydrated. Any component that branches on it to choose a *different
 * element* therefore renders one tree on the server and a different one on the
 * client, which React reports as a hydration mismatch.
 *
 * Pairing the preference with a mounted flag via `useSyncExternalStore` keeps the
 * first client render identical to the HTML that was shipped, then applies the
 * preference immediately afterwards. The animated branch starts at `opacity: 0`,
 * so switching to the reduced branch reveals content instantly rather than
 * flashing it in.
 */
export function useSettledReducedMotion(): boolean {
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(noopSubscribe, getClientFlag, () => false);

  return mounted && !!reduce;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Parent that reveals its children as they scroll into view.
 * Children must be <RevealItem>.
 *
 * `as="ul"` lets a grid of cards stay a real list. `as="div"` (the default) is
 * used where the children are prose blocks rather than items.
 */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delay = 0,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const reduce = useSettledReducedMotion();

  if (reduce) {
    return as === "ul" ? (
      <ul className={className}>{children}</ul>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  // The `as` prop has to be honoured on both branches — rendering a <ul>
  // wrapper around prose, or a <li> around a <div>, is invalid HTML and the
  // browser silently drops the list semantics.
  if (as === "ul") {
    return (
      <motion.ul
        className={className}
        initial="hidden"
        whileInView="show"
        // `once` keeps the page from re-animating on every scroll pass.
        viewport={{ once: true, amount }}
        variants={variants}
      >
        {children}
      </motion.ul>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * A single child of RevealGroup. Renders the requested element itself, with no
 * extra wrapper — cards below supply their own markup.
 */
export function RevealItem({
  children,
  className,
  as = "li",
}: {
  children: ReactNode;
  className?: string;
  as?: "li" | "div";
}) {
  const reduce = useSettledReducedMotion();

  if (reduce) {
    return as === "li" ? (
      <li className={className}>{children}</li>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  if (as === "div") {
    return (
      <motion.div variants={itemVariants} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.li variants={itemVariants} className={className}>
      {children}
    </motion.li>
  );
}

/** Lifts and fades one block on scroll, without a stagger parent. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useSettledReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
