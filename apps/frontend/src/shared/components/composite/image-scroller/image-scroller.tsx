import { ChevronLeft, ChevronRight } from "lucide-react";
import { type KeyboardEvent, useCallback, useEffect, useState } from "react";
import { cn } from "@/shared/lib/cn";

export type ScrollerImage = {
  src: string;
  alt: string;
  /** Optional caption shown over the image (e.g. eyebrow text). */
  caption?: string;
};

type ImageScrollerProps = {
  images: ReadonlyArray<ScrollerImage>;
  /** Auto-advance through images. Default true when there's more than one image. */
  autoPlay?: boolean;
  /** Auto-advance interval in ms. */
  interval?: number;
  /** Aspect ratio of the frame. Defaults to 16/9. */
  aspectRatio?: string;
  /** Aria region label. */
  ariaLabel?: string;
  /** Aria-label for previous button. */
  previousLabel?: string;
  /** Aria-label for next button. */
  nextLabel?: string;
  /** Aria-label template for slides. */
  slideLabel?: (info: { index: number; total: number }) => string;
  className?: string;
};

const DEFAULT_SLIDE_LABEL = ({ index, total }: { index: number; total: number }) =>
  `Slide ${index + 1} of ${total}`;

export function ImageScroller({
  images,
  autoPlay = true,
  interval = 5000,
  aspectRatio = "16 / 9",
  ariaLabel = "Image gallery",
  previousLabel = "Previous image",
  nextLabel = "Next image",
  slideLabel = DEFAULT_SLIDE_LABEL,
  className,
}: ImageScrollerProps) {
  const [active, setActive] = useState(0);
  const total = images.length;
  const showControls = total > 1;

  const goto = useCallback(
    (next: number) => {
      if (total === 0) return;
      setActive(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (!autoPlay || total < 2) return;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, interval);
    return () => clearInterval(t);
  }, [autoPlay, interval, total]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!showControls) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goto(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goto(active - 1);
    }
  };

  if (total === 0) {
    return (
      <section
        aria-label={ariaLabel}
        className={cn("w-full rounded-2xl bg-bg-subtle", className)}
        style={{ aspectRatio }}
      />
    );
  }

  return (
    <section
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: carousel pattern requires the region to receive keyboard focus for arrow-key navigation
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-bg-subtle outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      style={{ aspectRatio }}
    >
      {images.map((img, i) => {
        const isCurrent = i === active;
        return (
          // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel pattern uses role="group" + aria-roledescription="slide"; <fieldset> is wrong here (form-input grouping)
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: image src may repeat across slides; combining with index ensures unique keys
            key={`${img.src}-${i}`}
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
              src={img.src}
              alt={isCurrent ? img.alt : ""}
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
            {img.caption && (
              <p className="absolute bottom-4 left-4 right-4 rounded-md bg-black/40 p-3 font-mono text-xs uppercase tracking-[0.18em] text-white">
                {img.caption}
              </p>
            )}
          </div>
        );
      })}

      {showControls && (
        <>
          <button
            type="button"
            aria-label={previousLabel}
            onClick={() => goto(active - 1)}
            className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated/90 text-accent shadow-soft-sm backdrop-blur transition-all duration-200 ease-out hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-fg hover:shadow-soft-md active:scale-100"
          >
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => goto(active + 1)}
            className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated/90 text-accent shadow-soft-sm backdrop-blur transition-all duration-200 ease-out hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-fg hover:shadow-soft-md active:scale-100"
          >
            <ChevronRight size={20} aria-hidden />
          </button>

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {images.map((img, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: image src may repeat across slides; combining with index ensures unique keys
                key={`dot-${img.src}-${i}`}
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
        </>
      )}
    </section>
  );
}
