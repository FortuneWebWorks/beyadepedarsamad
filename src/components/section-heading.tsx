import { Reveal, RevealGroup, RevealItem } from "./reveal";

/**
 * Numbered section header. The kicker, title and rule stagger in together so
 * the heading reads as one gesture rather than three separate fades.
 */
export function SectionHeading({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 sm:mb-14">
      <RevealGroup>
        <RevealItem as="div" className="flex items-baseline gap-4">
          <span className="nums text-xs font-bold tracking-[0.2em] text-accent tabular-nums">{index}</span>
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>
        </RevealItem>
      </RevealGroup>

      <Reveal delay={0.1}>
        <div aria-hidden className="mt-5 h-px w-full bg-linear-to-l from-transparent via-line-strong to-transparent" />
      </Reveal>

      {description ? (
        <Reveal delay={0.18}>
          <p className="mt-4 max-w-prose text-pretty text-sm leading-8 text-ink-soft">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
