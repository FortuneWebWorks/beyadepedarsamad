"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { MediaItem } from "@/lib/content";
import { driveImageFull } from "@/lib/media";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen photo viewer.
 *
 * Handles what a photo viewer is expected to do: Escape closes, arrow keys page
 * through (direction-aware, so it matches what RTL readers expect), and the
 * page behind stops scrolling while it is open.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: MediaItem[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const reduce = useReducedMotion();
  const open = index !== null;
  const item = open ? items[index] : null;

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // In RTL, ArrowRight goes back and ArrowLeft goes forward.
      else if (e.key === "ArrowRight") onPrev();
      else if (e.key === "ArrowLeft") onNext();
    },
    [onClose, onPrev, onNext],
  );

  // Keys are document-level, but only listened for while open.
  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onKeyDown]);

  // Lock background scroll, compensating for the scrollbar so the page
  // underneath does not shift sideways as it disappears.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingInlineEnd;
    const gap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingInlineEnd = prevPad;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-100 grid place-items-center bg-scrim/92 p-4 backdrop-blur-md sm:p-8"
        >
          <motion.figure
            initial={reduce ? undefined : { scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={reduce ? undefined : { scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-full w-full max-w-4xl flex-col items-center gap-5"
          >
            <img
              src={driveImageFull(item.id)}
              alt={item.title}
              // The largest file is fetched only once the viewer is open.
              className="max-h-[74svh] w-auto max-w-full rounded-2xl object-contain shadow-lift"
            />

            <figcaption className="flex items-center gap-4 text-center">
              <span className="text-sm font-medium text-bg-elev/90">{item.title}</span>
              <span className="nums text-xs text-bg-elev/50 tabular-nums">
                {(index ?? 0) + 1} / {items.length}
              </span>
            </figcaption>
          </motion.figure>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            // So keyboard users land on a control rather than the page behind.
            autoFocus
            className="absolute top-5 end-5 grid size-11 cursor-pointer place-items-center rounded-full border border-bg-elev/20 bg-bg-elev/10 text-bg-elev backdrop-blur-md transition-[background-color,transform] duration-300 hover:bg-bg-elev/25 active:scale-92"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden className="size-5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {items.length > 1 ? (
            <>
              {/* In RTL the inline-end (left) side advances. */}
              <NavButton side="end" onClick={onNext} label="تصویر بعدی" reduce={!!reduce}>
                <path d="M15 5l-7 7 7 7" />
              </NavButton>
              <NavButton side="start" onClick={onPrev} label="تصویر قبلی" reduce={!!reduce}>
                <path d="M9 5l7 7-7 7" />
              </NavButton>
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function NavButton({
  side,
  onClick,
  label,
  reduce,
  children,
}: {
  side: "start" | "end";
  onClick: () => void;
  label: string;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      whileHover={reduce ? undefined : { scale: 1.08 }}
      whileTap={reduce ? undefined : { scale: 0.93 }}
      className="absolute top-1/2 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-bg-elev/20 bg-bg-elev/10 text-bg-elev backdrop-blur-md transition-colors duration-300 hover:bg-bg-elev/25"
      style={{ [side === "start" ? "insetInlineStart" : "insetInlineEnd"]: "1rem" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="size-5"
      >
        {children}
      </svg>
    </motion.button>
  );
}
