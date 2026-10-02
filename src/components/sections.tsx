import { sections, videos, voices } from "@/lib/content";
import { AudioPlayer } from "./audio-player";
import { VideoCard } from "./video-card";
import { SectionHeading } from "./section-heading";
import { RevealGroup, RevealItem } from "./reveal";

export function VoicesSection() {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          index={sections.voices.index}
          title={sections.voices.title}
        />

        <RevealGroup as="ul" className="grid gap-5" stagger={0.12}>
          {voices.map((item, index) => (
            <RevealItem key={item.id}>
              <AudioPlayer item={item} index={index} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function VideosSection() {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index={sections.videos.index}
          title={sections.videos.title}
        />

        <RevealGroup as="ul" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {videos.map((item, index) => (
            <RevealItem key={item.id}>
              <VideoCard item={item} index={index} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
