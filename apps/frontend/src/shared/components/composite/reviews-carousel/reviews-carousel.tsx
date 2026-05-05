import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { type Review, ReviewCard } from "@/shared/components/composite/review-card/review-card";
import { cn } from "@/shared/lib/cn";

type ReviewsCarouselProps = {
  reviews: ReadonlyArray<Review>;
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  navigateLabel?: string;
  slideLabel?: (info: { index: number; total: number }) => string;
  starsLabel?: (rating: number) => string;
  className?: string;
};

type Slot = { tempId: number; review: Review };

const TINY_BREAKPOINT_PX = 380;
const NARROW_BREAKPOINT_PX = 520;
const CARD_SIZE_TINY = 220;
const CARD_SIZE_NARROW = 260;
const CARD_SIZE_WIDE = 365;
const STAGE_HEIGHT_TINY = 520;
const STAGE_HEIGHT_NARROW = 480;
const STAGE_HEIGHT_WIDE = 600;
const SPACING_DIV_TINY = 1.3;
const SPACING_DIV_NARROW = 1.6;
const SPACING_DIV_WIDE = 1.15;
const CENTER_Y_OFFSET_TINY = -25;
const CENTER_Y_OFFSET_DEFAULT = -65;
const SIDE_Y_ODD_TINY = 10;
const SIDE_Y_EVEN_TINY = -10;
const SIDE_Y_ODD_DEFAULT = 15;
const SIDE_Y_EVEN_DEFAULT = -15;
const SIDE_TILT_DEG = 2.5;

const DEFAULT_SLIDE_LABEL = ({ index, total }: { index: number; total: number }) =>
  `Review ${index + 1} of ${total}`;

function buildSlots(reviews: ReadonlyArray<Review>, seedFrom: number): Slot[] {
  return reviews.map((review, i) => ({ tempId: seedFrom + i, review }));
}

export function ReviewsCarousel({
  reviews,
  ariaLabel = "Patient reviews",
  previousLabel = "Previous review",
  nextLabel = "Next review",
  navigateLabel = "Navigate Reviews",
  slideLabel = DEFAULT_SLIDE_LABEL,
  starsLabel,
  className,
}: ReviewsCarouselProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tempIdRef = useRef(reviews.length + 1);

  const [slots, setSlots] = useState<Slot[]>(() => buildSlots(reviews, 1));
  const [containerW, setContainerW] = useState(1200);

  // Re-sync if the `reviews` prop changes identity (Storybook controls, tests
  // re-rendering with new data). Production callers pass a stable array.
  useEffect(() => {
    setSlots((prev) => {
      if (prev.length === reviews.length && prev.every((s, i) => s.review === reviews[i])) {
        return prev;
      }
      const seed = tempIdRef.current;
      tempIdRef.current = seed + reviews.length;
      return buildSlots(reviews, seed);
    });
  }, [reviews]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (typeof ResizeObserver === "undefined") {
      setContainerW(typeof window !== "undefined" ? window.innerWidth : 1200);
      return;
    }
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const move = useCallback((positions: number) => {
    if (positions === 0) return;
    setSlots((prev) => {
      const n = prev.length;
      if (n === 0) return prev;
      const next = [...prev];
      if (positions > 0) {
        for (let i = 0; i < positions; i++) {
          const moved = next.shift();
          if (!moved) break;
          next.push({ tempId: tempIdRef.current++, review: moved.review });
        }
      } else {
        for (let i = 0; i < -positions; i++) {
          const moved = next.pop();
          if (!moved) break;
          next.unshift({ tempId: tempIdRef.current++, review: moved.review });
        }
      }
      return next;
    });
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    }
  };

  const total = slots.length;

  if (total === 0) {
    return (
      <section aria-label={ariaLabel} className={cn("w-full", className)}>
        <div aria-live="polite" className="text-center text-fg-muted" />
      </section>
    );
  }

  const isTiny = containerW < TINY_BREAKPOINT_PX;
  const isNarrow = containerW < NARROW_BREAKPOINT_PX;
  const cardSize = isTiny ? CARD_SIZE_TINY : isNarrow ? CARD_SIZE_NARROW : CARD_SIZE_WIDE;
  const stageHeight = isTiny
    ? STAGE_HEIGHT_TINY
    : isNarrow
      ? STAGE_HEIGHT_NARROW
      : STAGE_HEIGHT_WIDE;
  const spacingDivisor = isTiny
    ? SPACING_DIV_TINY
    : isNarrow
      ? SPACING_DIV_NARROW
      : SPACING_DIV_WIDE;
  const spacing = cardSize / spacingDivisor;
  const centerYOffset = isTiny ? CENTER_Y_OFFSET_TINY : CENTER_Y_OFFSET_DEFAULT;
  const sideYOdd = isTiny ? SIDE_Y_ODD_TINY : SIDE_Y_ODD_DEFAULT;
  const sideYEven = isTiny ? SIDE_Y_EVEN_TINY : SIDE_Y_EVEN_DEFAULT;
  const centerIdx = Math.floor(total / 2);

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
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden"
        style={{ height: stageHeight }}
      >
        {slots.map((slot, idx) => {
          const position = idx - centerIdx;
          const isCenter = position === 0;
          const oddOff = Math.abs(position) % 2 === 1;
          const rotation = isCenter ? 0 : oddOff ? SIDE_TILT_DEG : -SIDE_TILT_DEG;
          const tx = position * spacing;
          const ty = isCenter ? centerYOffset : oddOff ? sideYOdd : sideYEven;
          const z = 10 - Math.abs(position);
          const transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rotation}deg)`;

          const wrapperStyle: CSSProperties = {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: cardSize,
            zIndex: z,
            transform,
            transition: "transform 500ms ease-in-out",
            willChange: "transform",
          };

          return (
            // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel pattern uses role="group" + aria-roledescription="slide"
            <div
              key={slot.tempId}
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabel({ index: idx, total })}
              aria-current={isCenter}
              aria-hidden={Math.abs(position) > 1}
              style={wrapperStyle}
            >
              <ReviewCard
                review={slot.review}
                emphasized={isCenter}
                {...(starsLabel ? { starsLabel: starsLabel(slot.review.rating) } : {})}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label={previousLabel}
          onClick={() => move(-1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-accent shadow-soft-sm transition-all duration-200 ease-out hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-fg hover:shadow-soft-md active:scale-100"
        >
          <ChevronLeft size={20} aria-hidden />
        </button>
        <p
          aria-live="polite"
          className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted"
        >
          {navigateLabel}
        </p>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => move(1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-accent shadow-soft-sm transition-all duration-200 ease-out hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-fg hover:shadow-soft-md active:scale-100"
        >
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>
    </section>
  );
}
