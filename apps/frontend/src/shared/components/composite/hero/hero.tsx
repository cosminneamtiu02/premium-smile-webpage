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

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[10%] bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--bg)_15%,transparent)_40%,color-mix(in_srgb,var(--bg)_60%,transparent)_75%,var(--bg)_100%)]"
        />

        <div
          className={cn(
            "absolute z-[4] flex max-w-[720px] flex-col gap-4",
            "left-[clamp(24px,5vw,46px)] right-[clamp(24px,5vw,46px)]",
            "bottom-[clamp(96px,17%,260px)]",
          )}
        >
          <Heading
            level={1}
            className="text-3xl text-white [text-shadow:0_2px_24px_rgba(20,15,30,0.35)] [text-wrap:balance] sm:text-4xl lg:text-5xl"
          >
            {title}
          </Heading>

          {total > 0 && (
            <div className="grid max-w-[540px]">
              {slides.map((slide, i) => (
                <p
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable slot for crossfade
                  key={`desc-${slide.src}-${i}`}
                  aria-hidden={i !== active}
                  className={cn(
                    "[grid-area:1/1] text-justify text-sm leading-snug text-white/95 [text-shadow:0_1px_12px_rgba(20,15,30,0.4)] sm:text-base",
                    "transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
                    i === active ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  {slide.description}
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:max-w-md sm:grid-cols-2 [&>*]:w-full">
            {ctaPrimary}
            {ctaSecondary}
          </div>
        </div>

        {isCarousel && (
          <div className="absolute inset-x-0 bottom-[clamp(60px,12%,180px)] z-[4] flex justify-center gap-2">
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
