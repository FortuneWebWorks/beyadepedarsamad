"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { VoiceItem } from "@/lib/content";
import { formatTime } from "@/lib/format";
import { ProgressBar } from "./progress-bar";

/**
 * Audio player built on a single <audio> element.
 *
 * Two affordances the native control does not give us:
 *  - scrubbing by clicking anywhere on the progress bar
 *  - a play state the surrounding design can animate against
 */
export function AudioPlayer({ item, index }: { item: VoiceItem; index: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTimeUpdate = () => {
      // Ignore ticks while dragging so the thumb doesn't fight the pointer.
      if (!scrubbing) setProgress(el.currentTime);
    };
    const onLoaded = () => setDuration(el.duration);

    // `preload="metadata"` starts fetching while the HTML is still being parsed,
    // so by the time this effect runs the browser has often already fired
    // `loadedmetadata` — and it will not fire again. Reading the current value
    // here is what keeps the total from sitting at 0:00 and the scrub bar dead.
    onLoaded();
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("durationchange", onLoaded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("durationchange", onLoaded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [scrubbing]);

  async function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
      } catch {
        // Autoplay policy or a decode failure — stay visually paused.
        setPlaying(false);
      }
    } else {
      el.pause();
    }
  }

  const seekFromEvent = useCallback((clientX: number) => {
    const el = audioRef.current;
    const bar = barRef.current;
    if (!el || !bar || !Number.isFinite(el.duration) || el.duration === 0) return;

    const rect = bar.getBoundingClientRect();
    // The timeline runs right-to-left, so time 0 sits at the *right* edge and
    // the end sits at the left. Measuring from the physical left edge would
    // make clicking near the start jump to the end, so the ratio is taken
    // from whichever edge the inline direction starts at.
    const fromStart = rect.right - clientX;
    const ratio = Math.min(1, Math.max(0, fromStart / rect.width));
    el.currentTime = ratio * el.duration;
    setProgress(el.currentTime);
  }, []);

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl border border-line bg-bg-elev p-6 shadow-soft transition-[border-color,box-shadow] duration-500 hover:border-accent/35 hover:shadow-lift sm:p-7"
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      {/* Accent wash that strengthens while playing. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-linear-to-l from-accent/8 to-transparent transition-opacity duration-700 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />

      <audio ref={audioRef} src={item.src} preload="metadata" className="sr-only" />

      <div className="relative flex items-center gap-5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `توقف پخش ${item.title}` : `پخش ${item.title}`}
          className="relative grid size-14 shrink-0 place-items-center rounded-full bg-accent text-accent-contrast shadow-soft transition-transform duration-300 hover:scale-105 active:scale-95 sm:size-16"
        >
          {/* Expanding ring, only while audio is actually playing. */}
          {playing && !reduce && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-accent/60 animate-pulse-ring"
            />
          )}

          <span className="relative grid size-full place-items-center">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className={`absolute size-5.5 transition-[opacity,transform] duration-300 ${
                playing ? "scale-75 opacity-0" : "scale-100 opacity-100"
              }`}
            >
              {/* Play triangle stays right-pointing in both directions. */}
              <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.72-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className={`absolute size-5.5 transition-[opacity,transform] duration-300 ${
                playing ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            >
              <rect x="6" y="5" width="4" height="14" rx="1.3" />
              <rect x="14" y="5" width="4" height="14" rx="1.3" />
            </svg>
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-4">
            <p className="nums text-[0.65rem] font-bold tracking-[0.28em] text-accent">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="truncate text-sm font-medium text-ink">{item.title}</p>
          </div>

          <ProgressBar
            barRef={barRef}
            audioRef={audioRef}
            title={item.title}
            progress={progress}
            duration={duration}
            pct={pct}
            scrubbing={scrubbing}
            playing={playing}
            setScrubbing={setScrubbing}
            seekFromEvent={seekFromEvent}
            toggle={() => void toggle()}
          />

          <div className="nums mt-1.5 flex justify-between text-xs text-ink-faint tabular-nums">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
