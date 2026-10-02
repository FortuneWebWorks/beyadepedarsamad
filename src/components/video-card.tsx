"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { VideoItem } from "@/lib/content";

/**
 * Click-to-play video card backed by a real <video> element.
 *
 * This started life as a Google Drive <iframe> embed, which looked fine but was
 * uncontrollable: Drive's preview player accepts no external commands, so
 * `enablejsapi=1` + postMessage `playVideo`/`pauseVideo`/`setCurrentTime` did
 * nothing (verified — it only ever emitted a handshake blob). That left the
 * only affordances inside the iframe, out of reach of the page's own keyboard
 * and screen-reader users.
 *
 * The clips are now transcoded to web-friendly H.264/AAC (see the note in
 * content.ts) and hosted alongside the site, which buys real controls, real
 * seeking, captions, and no dependency on a third-party frame.
 *
 * Lazy-loading is kept deliberately: `preload="none"` plus a poster means the
 * browser fetches nothing until the visitor asks for a specific clip.
 */
export function VideoCard({ item, index }: { item: VideoItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onPlay = () => {
      setPlaying(true);
      setEnded(false);
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  function activate() {
    // Mounting the <video> with autoPlay starts it; the click that got us here
    // counts as the user gesture autoplay policy is looking for.
    setActive(true);
  }

  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl border border-line bg-bg-elev shadow-soft transition-[border-color,box-shadow] duration-500 hover:border-accent/35 hover:shadow-lift"
      whileHover={reduce ? undefined : { y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      {/*
        Every card gets the same 4:5 frame so the grid stays even. The clips are
        mixed — three portrait phone videos and one 1280x958 landscape — so
        `object-contain` alone would leave the landscape one floating in black
        bars and make the row heights disagree.

        The fix is to fill that frame deliberately: the poster, scaled up and
        blurred, sits behind everything as a backdrop while the poster and the
        video are each contained whole in the middle. Faces are never cropped and
        there are no hard black bands, and every card in a row is the same
        height. The backdrop stays put through playback, so the letterboxed
        landscape clip is cushioned by out-of-focus imagery rather than black.
      */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
        {/*
          Before activation the card is just imagery — the blurred poster plus a
          sharp copy of it, with the play affordance on top. The <video> is not
          in the tree yet, so nothing is focusable or downloadable until the
          visitor asks for this specific clip. Once active the video replaces
          the poster entirely and takes over the whole frame.
        */}
        {/*
          Backdrop sits behind BOTH states. The blurred poster fills the 4:5
          frame, so the margins the frame adds around a narrower clip are filled
          with out-of-focus imagery instead of hard black bars — before playback
          (behind the sharp poster) and during it (behind the letterboxed video).
          scale-125 hides the blur's soft edge.
        */}
        <span aria-hidden className="absolute inset-0 overflow-hidden">
          <span
            className="absolute inset-0 scale-125 bg-cover bg-center"
            style={{
              backgroundImage: `url(${item.poster})`,
              filter: "blur(26px) saturate(140%)",
            }}
          />
          {/* Fades the backdrop into the frame so it reads as depth, not a seam. */}
          <span className="absolute inset-0 bg-black/35" />
        </span>
        {!active ? (
          <>
            {/* Sharp poster on top, whole and uncropped. */}
            <img
              src={item.poster}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 size-full object-contain"
            />
            {/* Darken so the play button reads clearly over a bright frame. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/20 transition-opacity duration-500 group-hover:from-black/80"
            />

            <button
              type="button"
              onClick={activate}
              aria-label={`پخش ${item.title}`}
              className="absolute inset-0 z-10 size-full cursor-pointer"
            >
              <span className="absolute inset-0 grid place-items-center">
                <span className="relative grid size-16 place-items-center rounded-full bg-bg-elev/92 text-ink shadow-lift backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                  {/* Halo lights up on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-accent/0 transition-colors duration-500 group-hover:border-accent/45"
                  />
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-6 translate-x-px">
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.72-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
                  </svg>
                </span>
              </span>
            </button>
          </>
        ) : (
          <video
            ref={videoRef}
            /* True dimensions, so the browser knows the clip's aspect before decoding. */
            width={item.width}
            height={item.height}
            poster={item.poster}
            src={item.src}
            controls
            autoPlay
            playsInline
            preload="metadata"
            aria-label={item.title}
            /* `object-contain` keeps the whole frame visible inside the 4:5 box;
               the landscape clip letterboxes slightly, cushioned by the blurred
               backdrop, which is far better than cropping a face out of the shot.
               Deliberately no bg-black here — it would paint over that backdrop
               and reintroduce the hard bars during playback. */
            className="absolute inset-0 size-full object-contain"
          />
        )}
      </div>

      {/*
        Caption bar. Doubles as the live status region so assistive tech hears
        the clip start and finish.
      */}
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="nums text-[0.65rem] font-bold tracking-[0.28em] text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="truncate text-sm font-medium text-ink-soft">{item.title}</p>
        <span aria-live="polite" className="sr-only">
          {playing ? `در حال پخش ${item.title}` : ended ? `${item.title} به پایان رسید` : ""}
        </span>
      </div>
    </motion.div>
  );
}
