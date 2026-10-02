import { memorial, SITE_URL } from "@/lib/content";
import { Reveal } from "./reveal";

export function SiteFooter() {
  return (
    <footer className="px-5 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
      <Reveal>
        <div className="mx-auto max-w-3xl">
          <div aria-hidden className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-linear-to-l from-transparent to-line-strong" />
            <span className="size-1.5 rotate-45 bg-accent/60" />
            <span className="h-px w-12 bg-linear-to-r from-transparent to-line-strong" />
          </div>

          <p className="mt-8 text-center text-sm text-ink-soft">{memorial.footerNote}</p>

          <p className="nums mt-3 text-center text-xs tracking-[0.2em] text-ink-faint">
            {memorial.name}
          </p>

          <p className="mt-10 text-center text-xs text-ink-faint/70">
            <a
              href={SITE_URL}
              className="rounded-sm underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent"
            >
              {SITE_URL.replace(/^https?:\/\//, "")}
            </a>
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
