import { ChevronLeft, ChevronRight } from "lucide-react";
import { type KeyboardEvent, useCallback, useState } from "react";
import { type Review, ReviewCard } from "@/shared/components/composite/review-card/review-card";
import { cn } from "@/shared/lib/cn";

type ReviewsCarouselProps = {
  reviews: ReadonlyArray<Review>;
  /** Aria region label, e.g. "Patient reviews". */
  ariaLabel?: string;
  /** Aria-label for the previous button (i18n hook). */
  previousLabel?: string;
  /** Aria-label for the next button. */
  nextLabel?: string;
  /** Aria-label template for each slide — receives `{ index, total }`. */
  slideLabel?: (info: { index: number; total: number }) => string;
  /** Aria-label for the rating, passed through to each card's Stars. */
  starsLabel?: (rating: number) => string;
  className?: string;
};

const DEFAULT_SLIDE_LABEL = ({ index, total }: { index: number; total: number }) =>
  `Review ${index + 1} of ${total}`;

export function ReviewsCarousel({
  reviews,
  ariaLabel = "Patient reviews",
  previousLabel = "Previous review",
  nextLabel = "Next review",
  slideLabel = DEFAULT_SLIDE_LABEL,
  starsLabel,
  className,
}: ReviewsCarouselProps) {
  const [active, setActive] = useState(0);
  const total = reviews.length;

  const goto = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      setActive(wrapped);
    },
    [total],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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
      <section aria-label={ariaLabel} className={cn("w-full", className)}>
        <div aria-live="polite" className="text-center text-fg-muted" />
      </section>
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
        "w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="relative">
        <div className="grid gap-4 lg:grid-cols-3">
          {reviews.map((review, i) => {
            const isCurrent = i === active;
            const offset = i - active;
            const visibleOnMobile = isCurrent;
            return (
              // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel pattern uses role="group" + aria-roledescription="slide"; <fieldset> is wrong here (form-input grouping)
              <div
                key={review.id}
                role="group"
                aria-roledescription="slide"
                aria-label={slideLabel({ index: i, total })}
                aria-current={isCurrent}
                className={cn(
                  "transition-opacity duration-300",
                  visibleOnMobile ? "block" : "hidden",
                  "lg:block",
                  !isCurrent && "lg:opacity-70",
                  Math.abs(offset) > 1 && "lg:hidden",
                )}
              >
                <ReviewCard
                  review={review}
                  emphasized={isCurrent}
                  {...(starsLabel ? { starsLabel: starsLabel(review.rating) } : {})}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label={previousLabel}
          onClick={() => goto(active - 1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-accent shadow-soft-sm transition-all duration-200 ease-out hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-fg hover:shadow-soft-md active:scale-100"
        >
          <ChevronLeft size={20} aria-hidden />
        </button>
        <p
          aria-live="polite"
          className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted"
        >
          {slideLabel({ index: active, total })}
        </p>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => goto(active + 1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-accent shadow-soft-sm transition-all duration-200 ease-out hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-fg hover:shadow-soft-md active:scale-100"
        >
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>
    </section>
  );
}
