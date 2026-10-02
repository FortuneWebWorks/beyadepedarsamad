import { BackToTop } from "@/components/back-to-top";
import { Hero } from "@/components/hero";
import { PhotoGallery } from "@/components/photo-gallery";
import { PoemSection } from "@/components/poem-section";
import { ScrollProgress } from "@/components/scroll-progress";
import { VoicesSection, VideosSection } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";

/**
 * The page is a static shell: each section below owns the client behaviour it
 * needs, so the initial HTML stays small and the JS is loaded per section.
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <main id="main">
        <Hero />
        <PoemSection />
        <VoicesSection />
        <VideosSection />
        <PhotoGallery />
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
