import { useLayoutEffect, useRef, useState } from "react";
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { Container } from "@/shared/components/ui/container/container";
import { cn } from "@/shared/lib/cn";
import { type Doctor, DoctorCard } from "./doctor-card/doctor-card";
import { ShowcaseLine } from "./line/line";
import type { CardLayout } from "./line/line-path";

type DoctorShowcaseProps = {
  /** The data for every card. Cards alternate image-left / image-right by index. */
  doctors: ReadonlyArray<Doctor>;
  /** Section eyebrow above the heading, e.g. "Five specialists. One shared standard of care." */
  sectionEyebrow?: string;
  /** Section heading, e.g. "Meet Our Team". */
  sectionTitle: string;
  /** CTA label for every card. Omit to render text-only cards. */
  ctaLabel?: string;
  /** Per-card click handler — receives the doctor whose CTA was activated. */
  onDoctorCta?: (doctor: Doctor) => void;
  /** id for the section heading — used for `aria-labelledby` on the wrapping section. */
  headingId?: string;
  className?: string;
};

const imageSideForIndex = (i: number): "left" | "right" => (i % 2 === 0 ? "left" : "right");

/**
 * Section that highlights a curated set of doctors with full bios and CTAs.
 * Renders a `<DoctorCard>` per entry and overlays a single `<ShowcaseLine>`
 * SVG that draws a continuous decorative zigzag tying every card together.
 *
 * The line geometry depends on each card's actual rendered position and
 * height (they vary with viewport, font, and bio length), so the showcase
 * measures them via refs + a `ResizeObserver` and feeds the layouts into
 * `ShowcaseLine`. Until the first measurement lands the line stays unrendered;
 * after that, it re-measures whenever any card or the container resizes.
 *
 * The `data-doctor-showcase` attribute on the section is what the
 * `ShowcaseLine` component looks for as its `ViewTimeline` subject — the
 * line's scroll-driven reveal is keyed off this section's scroll-into-view
 * progress, so the entire polyline draws as the user scrolls through the
 * showcase.
 */
export function DoctorShowcase({
  doctors,
  sectionEyebrow,
  sectionTitle,
  ctaLabel,
  onDoctorCta,
  headingId = "doctor-showcase-heading",
  className,
}: DoctorShowcaseProps) {
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [layouts, setLayouts] = useState<CardLayout[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const containerEl = cardsContainerRef.current;
    if (!containerEl) return;

    const measure = () => {
      const containerRect = containerEl.getBoundingClientRect();
      const next: CardLayout[] = [];
      for (let i = 0; i < doctors.length; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;
        const rect = cardEl.getBoundingClientRect();
        next.push({
          top: rect.top - containerRect.top,
          height: rect.height,
          imageSide: imageSideForIndex(i),
        });
      }
      setLayouts(next);
      setContainerWidth(containerRect.width);
    };

    measure();

    // jsdom (test env) doesn't implement ResizeObserver. Skip the observer
    // setup there — the one-shot measurement above is enough for a static
    // render, and the line is aria-hidden decoration so its absence has no
    // user-facing impact in tests.
    if (typeof ResizeObserver === "undefined") return;

    // Re-measure on container OR per-card size changes — covers viewport
    // resizes, font loads, and bio-content reflow.
    const observer = new ResizeObserver(measure);
    observer.observe(containerEl);
    for (const cardEl of cardRefs.current) {
      if (cardEl) observer.observe(cardEl);
    }
    return () => observer.disconnect();
  }, [doctors.length]);

  return (
    <section
      data-doctor-showcase
      aria-labelledby={headingId}
      className={cn("py-16 sm:py-20 lg:py-24", className)}
    >
      <Container width="lg">
        <SectionHeading
          {...(sectionEyebrow ? { eyebrow: sectionEyebrow } : {})}
          title={sectionTitle}
          id={headingId}
          className="mb-12 sm:mb-16"
        />
        <div ref={cardsContainerRef} className="relative flex flex-col gap-14">
          {doctors.map((doctor, i) => (
            <DoctorCard
              key={doctor.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              doctor={doctor}
              imageSide={imageSideForIndex(i)}
              {...(ctaLabel ? { ctaLabel } : {})}
              {...(onDoctorCta ? { onCta: () => onDoctorCta(doctor) } : {})}
            />
          ))}
          {layouts.length > 0 && containerWidth > 0 && (
            <ShowcaseLine cards={layouts} width={containerWidth} />
          )}
        </div>
      </Container>
    </section>
  );
}
