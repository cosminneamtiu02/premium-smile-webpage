import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Heading } from "@/shared/components/ui/heading/heading";
import { cn } from "@/shared/lib/cn";

export type HeroSlide = {
  src: string;
  alt: string;
  /** Per-slide H1 title — crossfades along with the image. */
  title: string;
};

type HeroProps = {
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

        {/* Permanent B&W-blurred-and-tinted screen — single overlay that
         *  stacks three effects on what's behind it. `backdrop-filter`
         *  combines `grayscale(1)` (strip colour to true B&W) with
         *  `blur(3px)` (soft defocus), then the element's own translucent
         *  --bg background paints a 20 % lavender wash on top. Effect:
         *  every image reads as a softly-defocused, brand-tinted B&W
         *  underlay regardless of its original palette. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] bg-[color-mix(in_srgb,var(--bg)_20%,transparent)] [backdrop-filter:grayscale(1)_blur(3px)] [-webkit-backdrop-filter:grayscale(1)_blur(3px)]"
        />

        {/* Bottom fade-to-bg. 10% of stage — a thin seam between hero and
         *  next section. Stops front-load the transparent region so the
         *  upper edge reads clean, then accelerate into solid `--bg` at
         *  the very bottom. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[10%] bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--bg)_8%,transparent)_30%,color-mix(in_srgb,var(--bg)_30%,transparent)_55%,color-mix(in_srgb,var(--bg)_70%,transparent)_80%,var(--bg)_100%)]"
        />

        <div
          className={cn(
            "absolute z-[4] flex flex-col gap-4 max-w-[720px] lg:max-w-[920px] xl:max-w-[1040px] lg:gap-6",
            // Left-anchored but with a generous left offset that scales
            // with the viewport — the block sits between the original
            // edge-hugging position and a fully-centered one. Right anchor
            // stays small so the box can stretch close to the right edge
            // on narrow screens (the max-width cap takes over on wide
            // screens, leaving slack on the right that the user accepts).
            "left-[clamp(48px,10vw,200px)] right-[clamp(24px,5vw,46px)]",
            // Anchored above the bottom fade so the title/description/CTAs
            // sit on the unaltered image area instead of the fade-tinted
            // transition zone. clamp keeps it from drifting too far on tiny
            // and very tall viewports.
            "bottom-[clamp(140px,28%,380px)]",
          )}
        >
          {/* Per-slide H1 titles — crossfade in lockstep with the image.
           *  Every title sits in the same grid cell ([grid-area:1/1]) so
           *  the box height stays stable as titles change. The non-active
           *  ones carry aria-hidden so the accessibility tree only sees
           *  the visible heading; @testing-library / axe both treat the
           *  hidden h1s as if they don't exist. */}
          {total > 0 && (
            <div className="grid">
              {slides.map((slide, i) => (
                <Heading
                  level={1}
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable slot for crossfade
                  key={`title-${slide.src}-${i}`}
                  aria-hidden={i !== active}
                  className={cn(
                    "[grid-area:1/1] text-4xl text-white [text-shadow:0_2px_24px_rgba(20,15,30,0.35)] [text-wrap:balance] sm:text-5xl lg:text-7xl xl:text-8xl",
                    // Lavender stroke outline — adds high-contrast definition
                    // around each glyph so the title stays legible against
                    // the brand-tinted B&W image regardless of the slide's
                    // brightness profile.
                    "[-webkit-text-stroke:3px_var(--accent)] [paint-order:stroke_fill]",
                    "transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
                    i === active ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  {slide.title}
                </Heading>
              ))}
            </div>
          )}

          {/* CTA grid: 2 columns at sm+ with equal-fraction tracks (`grid-cols-2`)
           *  so both buttons are exactly the same width. Wrapper max-width is
           *  generous enough that the longer "Programează o consultație" label
           *  fits on a single line at every breakpoint, and `whitespace-nowrap`
           *  enforces it as a guarantee. The buttons grow taller and roomier on
           *  lg+ so they read as primary heroes, not afterthoughts. */}
          <div className="grid grid-cols-1 gap-3 sm:max-w-lg sm:grid-cols-2 lg:max-w-2xl lg:gap-4 lg:[&>*]:h-14 lg:[&>*]:px-9 lg:[&>*]:text-lg [&>*]:w-full [&>*]:whitespace-nowrap">
            {ctaPrimary}
            {ctaSecondary}
          </div>
        </div>

        {isCarousel && (
          // Dots sit at exactly 10% from stage bottom — same y-coord as the
          // fade region's top edge. The dots' bottom edge touches the fade's
          // top edge with no overlap, the lowest possible position that
          // keeps them entirely on the unaltered image area.
          <div className="absolute inset-x-0 bottom-[10%] z-[4] flex justify-center gap-2">
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
