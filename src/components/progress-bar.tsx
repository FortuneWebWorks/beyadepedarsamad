"use client";

import { motion } from "framer-motion";
import type { RefObject, Dispatch, SetStateAction } from "react";
import { formatTime } from "@/lib/format";

/**
 * Scrub bar for the audio player.
 *
 * Exposed as role="slider" with full keyboard support because that is exactly
 * how it behaves — arrow keys nudge, space toggles.
 */
export function ProgressBar({
  barRef,
  audioRef,
  title,
  progress,
  duration,
  pct,
  scrubbing,
  playing,
  setScrubbing,
  seekFromEvent,
  toggle,
}: {
  barRef: RefObject<HTMLDivElement | null>;
  audioRef: RefObject<HTMLAudioElement | null>;
  title: string;
  progress: number;
  duration: number;
  pct: number;
  scrubbing: boolean;
  playing: boolean;
  setScrubbing: Dispatch<SetStateAction<boolean>>;
  seekFromEvent: (clientX: number) => void;
  toggle: () => void;
}) {
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const el = audioRef.current;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
      return;
    }
    if (!el || !Number.isFinite(el.duration)) return;

    // In RTL, ArrowLeft should still mean "forward in time".
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const delta = e.key === "ArrowLeft" ? 5 : -5;
      el.currentTime = Math.min(el.duration, Math.max(0, el.currentTime + delta));
    }
  }

  return (
    <div
      ref={barRef}
      role="slider"
      tabIndex={0}
      aria-label={`موقعیت پخش ${title}`}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration) || 0}
      aria-valuenow={Math.round(progress)}
      aria-valuetext={`${formatTime(progress)} از ${formatTime(duration)}`}
      onPointerDown={(e) => {
        setScrubbing(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        seekFromEvent(e.clientX);
      }}
      onPointerMove={(e) => {
        if (scrubbing) seekFromEvent(e.clientX);
      }}
      onPointerUp={(e) => {
        setScrubbing(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onKeyDown={onKeyDown}
      className="relative mt-3 h-6 cursor-pointer touch-none select-none"
    >
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-ink/10">
        {/*
          The timeline runs right-to-left, so the played portion is anchored to
          the inline-start edge (the right side under dir="rtl") and grows
          towards the left. Sizing with `width` rather than `scaleX` avoids
          depending on transform-origin, which is fragile once Tailwind's
          translate utilities sit on the same element.
        */}
        <div
          className="h-full bg-accent"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/*
        `insetInlineStart` is logical, so it resolves to `right` here and the
        thumb travels from the right edge towards the left as playback
        advances. The 0.4375rem is half the 14px thumb, subtracted so the thumb
        centres on that point instead of hanging off the end of the track.
      */}
      <motion.span
        aria-hidden
        className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-accent shadow-soft ring-4 ring-bg-elev"
        style={{ insetInlineStart: `calc(${pct}% - 0.4375rem)` }}
        animate={{ scale: scrubbing || playing ? 1.25 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </div>
  );
}
