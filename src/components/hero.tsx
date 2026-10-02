"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Pic from "@/app/picture.jpg";
import { memorial } from "@/lib/content";
import { useSettledReducedMotion } from "./reveal";
import { ThemeToggle } from "./theme-toggle";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useSettledReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Portrait drifts up and fades slightly slower than the page — subtle depth.
  const y = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 46]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Under reduced motion the entrance is skipped, but the element must still
  // *end up* opaque. Returning `{}` here would cancel the animation that had
  // already started at `opacity: 0` and strand the text invisible; `initial:
  // false` tells Motion to skip straight to the animate values instead.
  const rise = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE },
        };

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 sm:px-8"
    >
      {/* Warm pool of light behind the portrait. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 start-1/2 size-[42rem] -translate-y-1/2 -translate-x-1/2 rounded-full bg-accent/12 blur-[120px] rtl:translate-x-1/2"
      />
      {/* Film grain, kept faint so it reads as paper rather than noise. */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-screen" />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center"
      >
        <motion.p
          {...rise(0.1)}
          className="nums mb-7 text-[0.7rem] font-bold tracking-[0.42em] text-accent uppercase"
        >
          {memorial.kicker}
        </motion.p>

        {/* Portrait */}
        <motion.div {...rise(0.22)} className="relative">
          {/* Offset brass frame — a printed-plate detail. */}
          <div
            aria-hidden
            className="absolute -inset-3 rounded-[2rem] border border-accent/25 sm:-inset-4 sm:rounded-[2.5rem]"
          />
          <motion.div
            style={reduce ? undefined : { y, scale }}
            className="relative overflow-hidden rounded-[1.75rem] shadow-portrait sm:rounded-[2.25rem]"
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-ink/10"
            />
            <Image
              src={Pic}
              alt={`پرترهٔ ${memorial.name}`}
              width={810}
              height={1080}
              priority
              // Intrinsic ratio is 3:4; the frame matches it so nothing crops.
              sizes="(min-width: 640px) 22rem, 15rem"
              className="h-auto w-56 object-cover sm:w-72 lg:w-80"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        <motion.h1
          {...rise(0.42)}
          className="mt-11 text-[2.1rem] leading-[1.35] font-bold tracking-tight text-ink text-balance sm:mt-12 sm:text-5xl"
        >
          {memorial.name}
        </motion.h1>

        <motion.p
          {...rise(0.56)}
          className="mt-5 max-w-md text-pretty text-base leading-9 text-ink-soft sm:text-lg"
        >
          {memorial.tagline}
        </motion.p>

        <motion.div {...rise(0.72)} aria-hidden className="mt-10 flex items-center gap-3">
          <span className="h-px w-10 bg-linear-to-l from-transparent to-line-strong" />
          <span className="size-1.5 rotate-45 bg-accent/70" />
          <span className="h-px w-10 bg-linear-to-r from-transparent to-line-strong" />
        </motion.div>
      </motion.div>

      {/* Controls sit above the content, in the inline-start corner. */}
      <div className="absolute top-5 start-5 z-20 sm:top-7 sm:start-7">
        <ThemeToggle />
      </div>

      {/* Rendered unconditionally — dropping this node under reduced motion
          would change the client tree versus the server-rendered HTML. The
          cue simply stops drifting instead of disappearing. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : { delay: 1.5, duration: 1 }}
        className="absolute bottom-7 start-1/2 z-10 -translate-x-1/2 rtl:translate-x-1/2"
      >
        <div className="flex h-9 w-5.5 justify-center rounded-full border border-line-strong pt-2">
          <span
            className={
              reduce
                ? "h-1.5 w-0.5 rounded-full bg-accent"
                : "h-1.5 w-0.5 animate-drift rounded-full bg-accent"
            }
          />
        </div>
      </motion.div>
    </section>
  );
}
