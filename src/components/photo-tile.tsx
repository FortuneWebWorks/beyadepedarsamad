"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MediaItem } from "@/lib/content";
import { driveImage, driveSrcSet } from "@/lib/media";

/** Tile in the grid. Clicking it opens the lightbox at the same index. */
export function PhotoTile({
  item,
  index,
  onOpen,
}: {
  item: MediaItem;
  index: number;
  onOpen: (index: number) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="group relative"
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`نمایش ${item.title} در اندازهٔ کامل`}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-3xl border border-line bg-bg-sunk shadow-soft transition-[border-color,box-shadow] duration-500 hover:border-accent/35 hover:shadow-lift"
      >
        <img
          src={driveImage(item.id, 480, 480)}
          srcSet={driveSrcSet(item.id, [240, 360, 480, 720], 480)}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          alt={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
        />

        {/* Caption bar, revealed on hover/focus. */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-ink/75 to-transparent px-5 pt-10 pb-4 text-right text-sm font-medium text-bg-elev opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          {item.title}
        </span>

        <span className="nums absolute top-4 start-4 rounded-full bg-scrim/60 px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-bg-elev backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      </button>
    </motion.div>
  );
}
