"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useSettledReducedMotion } from "./reveal";

/**
 * Thin scroll-progress rule pinned to the top of the viewport.
 *
 * scaleX is driven by a MotionValue straight off the scroll listener, so this
 * animates in sync with the scrollbar without re-rendering React on any frame.
 *
 * Returning `null` here would swap the whole subtree between server and client
 * render, so the reduced-motion check goes through the mounted-aware hook.
 */
export function ScrollProgress() {
  const reduce = useSettledReducedMotion();
  const { scrollYProgress } = useScroll();
  // A little smoothing so trackpad flicks read as motion rather than jitter.
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-right bg-linear-to-l from-accent/35 via-accent to-accent"
      style={{ scaleX }}
    />
  );
}
