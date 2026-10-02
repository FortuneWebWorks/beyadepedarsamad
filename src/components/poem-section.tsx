"use client";

import { motion, useReducedMotion } from "framer-motion";
import { poem, sections } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The Saadi verse, set as an epigraph between two rules that draw themselves
 * in from the centre.
 */
export function PoemSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32">
      <RevealGroup className="mx-auto max-w-3xl">
        <RevealItem as="div" className="text-center">
          <p className="nums text-[0.7rem] font-bold tracking-[0.32em] text-accent/80">
            {sections.poem.index}
          </p>
        </RevealItem>

        {/* Rules draw in from the centre outward. */}
        <div aria-hidden className="my-9 flex items-center gap-5">
          <motion.span
            className="h-px flex-1 bg-linear-to-l from-transparent to-line-strong"
            initial={reduce ? undefined : { scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
          />
          <motion.span
            className="size-1.5 shrink-0 rotate-45 bg-accent/60"
            initial={reduce ? undefined : { scale: 0, rotate: 135 }}
            whileInView={reduce ? undefined : { scale: 1, rotate: 45 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          />
          <motion.span
            className="h-px flex-1 bg-linear-to-r from-transparent to-line-strong"
            initial={reduce ? undefined : { scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        </div>

        <RevealItem as="div">
          <blockquote className="text-center">
            {poem.lines.map((line) => (
              <p
                key={line}
                className="text-pretty text-xl leading-[2.3] font-light text-ink sm:text-3xl sm:leading-[2.1]"
              >
                {line}
              </p>
            ))}
          </blockquote>
        </RevealItem>

        <Reveal delay={0.25}>
          <p className="mt-9 text-center text-sm tracking-[0.2em] text-ink-faint">— {poem.author} —</p>
        </Reveal>
      </RevealGroup>
    </section>
  );
}
