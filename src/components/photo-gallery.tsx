"use client";

import { useCallback, useState } from "react";
import { photos, sections } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { RevealGroup, RevealItem } from "./reveal";
import { PhotoTile } from "./photo-tile";
import { Lightbox } from "./lightbox";

export function PhotoGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  // Wraps around at both ends.
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [],
  );

  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index={sections.photos.index}
          title={sections.photos.title}
          description="برای دیدن هر تصویر در اندازهٔ کامل، روی آن بزنید."
        />

        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1} as="ul">
          {photos.map((item, index) => (
            <RevealItem key={item.id}>
              <PhotoTile item={item} index={index} onOpen={setOpenIndex} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <Lightbox items={photos} index={openIndex} onClose={close} onPrev={prev} onNext={next} />
    </section>
  );
}
