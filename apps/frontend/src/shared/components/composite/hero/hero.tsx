import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Heading } from "@/shared/components/ui/heading/heading";
import { cn } from "@/shared/lib/cn";

export type HeroSlide = {
  src: string;
  alt: string;
  description: string;
};

type HeroProps = {
  title: string;
  slides: ReadonlyArray<HeroSlide>;
  ctaPrimary: ReactNode;
  ctaSecondary: ReactNode;
  intervalMs?: number;
  ariaLabel?: string;
  slideLabel?: (info: { index: number; total: number }) => string;
  className?: string;
};

const DEFAULT_INTERVAL_MS = 5500;
const DEFAULT_SLIDE_LABEL = ({ index, total }: { index: number; total: number }) =>
  `Slide ${index + 1} of ${total}`;

export function Hero({
  title,
  slides,
  ctaPrimary,
  ctaSecondary,
  intervalMs = DEFAULT_INTERVAL_MS,
  ariaLabel = "Hero gallery",
  slideLabel = DEFAULT_SLIDE_LABEL,
  className,
}: HeroProps) {
  const total = slides.length;
  const [active, setActive] = useState(0);
  const [tickKey, setTickKey] = useState(0);
  const isCarousel = total >= 2;

  const goto = useCallback(
    (i: number) => {
      if (total === 0) return;
      setActive(((i % total) + total) % total);
      setTickKey((k) => k + 1);
    },
    [total],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: tickKey is a remount-key trigger so the auto-advance timer resets on dot click
  useEffect(() => {
    if (!isCarousel) return;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, intervalMs);
    return () => clearInterval(t);
  }, [tickKey, intervalMs, total, isCarousel]);

  return (
    <section
      aria-label={ariaLabel}
      {...(isCarousel ? { "aria-roledescription": "carousel" } : {})}
      className={cn("relative -mt-4 w-full bg-bg", className)}
    >
      {/* Stage fills the full viewport height so the bottom fade-to-bg
       *  transition (28% of the stage, see element below) reaches solid --bg
       *  exactly where the next section begins — entire fade visible above
       *  the fold, seamless join into the page background. */}
      <div className="relative h-screen w-full overflow-hidden bg-bg-subtle [@supports(height:100dvh)]:h-[100dvh]">
        {slides.map((slide, i) => {
          const isCurrent = i === active;
          return (
            // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel pattern uses role="group" + aria-roledescription="slide"
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: image src may repeat across slides; combining with index ensures unique keys
              key={`${slide.src}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabel({ index: i, total })}
              aria-current={isCurrent}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
                isCurrent ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <img
                src={slide.src}
                alt={isCurrent ? slide.alt : ""}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgb(20_15_30_/_0.22)] via-[rgb(20_15_30_/_0.05)] to-[rgb(20_15_30_/_0.40)]"
              />
            </div>
          );
        })}

        {/* Bottom fade-to-bg. 16% of stage — tight enough to feel like a
         *  seam between hero and next section, tall enough that the gradient
         *  ramp doesn't read as a hard line. Stops front-load the transparent
         *  region so the upper part stays crisp, then accelerate into solid
         *  `--bg` at the very bottom. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[16%] bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--bg)_8%,transparent)_30%,color-mix(in_srgb,var(--bg)_30%,transparent)_55%,color-mix(in_srgb,var(--bg)_70%,transparent)_80%,var(--bg)_100%)]"
        />

        <div
          className={cn(
            "absolute z-[4] flex flex-col gap-4 max-w-[720px] lg:max-w-[920px] xl:max-w-[1040px] lg:gap-6",
            // Left-anchored: both `left` and `right` are pinned, but the
            // max-width cap over-constrains the box, so CSS resolves to
            // left:N, right:auto — the block hugs the left edge with the
            // right margin growing with the viewport. The right anchor
            // still kicks in on viewports narrower than the max-width
            // (mobile/tablet), keeping the block clear of the right edge.
            "left-[clamp(24px,5vw,46px)] right-[clamp(24px,5vw,46px)]",
            // Anchored above the bottom fade so the title/description/CTAs
            // sit on the unaltered image area instead of the fade-tinted
            // transition zone. clamp keeps it from drifting too far on tiny
            // and very tall viewports.
            "bottom-[clamp(200px,38%,520px)]",
          )}
        >
          <Heading
            level={1}
            className="text-3xl text-white [text-shadow:0_2px_24px_rgba(20,15,30,0.35)] [text-wrap:balance] sm:text-4xl lg:text-6xl xl:text-7xl"
          >
            {title}
          </Heading>

          {total > 0 && (
            <div className="grid max-w-[540px] lg:max-w-[680px] xl:max-w-[760px]">
              {slides.map((slide, i) => (
                <p
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable slot for crossfade
                  key={`desc-${slide.src}-${i}`}
                  aria-hidden={i !== active}
                  className={cn(
                    "[grid-area:1/1] text-justify text-sm leading-snug text-white/95 [text-shadow:0_1px_12px_rgba(20,15,30,0.4)] sm:text-base lg:text-lg lg:leading-relaxed xl:text-xl",
                    "transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
                    i === active ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  {slide.description}
                </p>
              ))}
            </div>
          )}

          {/* CTA grid: 2 columns at sm+ with equal-fraction tracks (`grid-cols-2`)
           *  so both buttons are exactly the same width. Wrapper max-width is
           *  generous enough that the longer "Programează o consultație" label
           *  fits on a single line at every breakpoint, and `whitespace-nowrap`
           *  enforces it as a guarantee. The buttons grow taller and roomier on
           *  lg+ so they read as primary heroes, not afterthoughts. */}
          <div className="grid grid-cols-1 gap-3 sm:max-w-lg sm:grid-cols-2 lg:max-w-2xl lg:gap-4 lg:[&>*]:h-12 lg:[&>*]:px-7 lg:[&>*]:text-base [&>*]:w-full [&>*]:whitespace-nowrap">
            {ctaPrimary}
            {ctaSecondary}
          </div>
        </div>

        {isCarousel && (
          // Dots sit just above the top edge of the fade region (16% from
          // bottom) — close enough that the eye reads them as part of the
          // bottom edge of the carousel, but still in the unaltered image
          // area so the white dots stay crisp and high-contrast.
          <div className="absolute inset-x-0 bottom-[clamp(80px,18%,220px)] z-[4] flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: image src may repeat across slides; combining with index ensures unique keys
                key={`dot-${slide.src}-${i}`}
                type="button"
                aria-label={slideLabel({ index: i, total })}
                aria-current={i === active}
                onClick={() => goto(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-200 ease-out",
                  i === active
                    ? "w-7 bg-white"
                    : "w-2 bg-white/50 hover:scale-125 hover:bg-white/85",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
