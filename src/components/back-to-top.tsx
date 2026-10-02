"use client";

import { useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

/**
 * Appears once the visitor has scrolled past the hero, and returns them to the
 * top.
 *
 * Driven off Motion's scroll value rather than a raw scroll listener, so no
 * React render happens on any frame — state is only touched when the button
 * actually flips.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    // Roughly where the hero stops; the threshold only has to feel right.
    const threshold = typeof window === "undefined" ? 800 : window.innerHeight * 0.8;
    setVisible(y > threshold);
  });

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
      aria-label="بازگشت به بالای صفحه"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 start-6 z-50 grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-bg-elev/85 text-ink-soft shadow-lift backdrop-blur-md transition-[opacity,transform,color,border-color] duration-500 hover:border-accent/45 hover:text-accent ${
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {/* Arrow points up in both directions — up is up. */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4.5">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
