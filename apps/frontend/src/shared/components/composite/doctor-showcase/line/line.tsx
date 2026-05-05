import { type CSSProperties, useEffect, useMemo, useRef } from "react";
import { cn } from "@/shared/lib/cn";
import { buildLinePath, type CardLayout, LINE_GEOMETRY } from "./line-path";

type ShowcaseLineProps = {
  /** Card layouts in showcase order, with first card's top at 0. */
  cards: ReadonlyArray<CardLayout>;
  /** Width of the cards container in CSS pixels — drives SVG width. */
  width: number;
  className?: string;
};

// Per-keyframe easing — CSS `ease` (cubic-bezier(0.25, 0.1, 0.25, 1)). Snappy
// start with a gentle settle at each segment end, so corners read as a soft
// handoff rather than a kink.
const SEGMENT_EASING = "ease";

/**
 * SVG overlay that renders the entire decorative zigzag as one continuous
 * polyline and animates a "leading edge" along it tied to the showcase
 * section's scroll-into-view progress.
 *
 * Pacing model: each segment (every horizontal traversal and every vertical
 * stretch) gets the same scroll budget. Long verticals reveal at a high
 * line-pixels-per-scroll rate; short horizontals reveal at a low rate. As
 * the user scrolls evenly, the leading edge feels like it flows along the
 * polyline at an even per-segment rhythm with no segment that drags or
 * flashes by.
 *
 * The animation runs only in browsers with ViewTimeline (Chromium 115+) and
 * when the user has not requested reduced motion. Otherwise the SVG renders
 * statically with the line fully visible (graceful fallback).
 */
export function ShowcaseLine({ cards, width, className }: ShowcaseLineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const path = useMemo(() => buildLinePath(cards, { width }), [cards, width]);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl || path.totalLength === 0) return;

    if (typeof window === "undefined" || !("ViewTimeline" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Drive the animation off the showcase section's scroll-into-view
    // progress. Falls back to the SVG itself when used standalone (Storybook).
    const subject =
      pathEl.closest<HTMLElement>("[data-doctor-showcase]") ?? pathEl.ownerSVGElement ?? pathEl;

    // Per-segment-equal-scroll-budget keyframes:
    // Each segment occupies a 1/N slice of progress. Within its slice,
    // stroke-dashoffset moves by that segment's length. Long segments get
    // a big dashoffset delta per slice (fast reveal); short segments get
    // a small delta (slow reveal). Equal scroll time per segment by
    // construction.
    //
    // Per-keyframe SEGMENT_EASING smooths the velocity at every corner:
    // instead of the leading edge jumping from "fast vertical" to "slow
    // horizontal" instantly at a segment boundary, segments arrive at low
    // velocity and the joint reads as a soft handoff. The per-segment time
    // budget is unaffected — easing only reshapes the velocity profile
    // WITHIN each segment.
    const segmentCount = path.segments.length;
    const keyframes: Keyframe[] = [
      { strokeDashoffset: path.totalLength, offset: 0, easing: SEGMENT_EASING },
    ];
    let cumulative = 0;
    for (let i = 0; i < segmentCount; i++) {
      const seg = path.segments[i];
      if (!seg) continue;
      cumulative += seg.length;
      const isLast = i === segmentCount - 1;
      keyframes.push({
        strokeDashoffset: path.totalLength - cumulative,
        offset: (i + 1) / segmentCount,
        // Easing on the last keyframe would have no effect (no next frame),
        // so omit it for cleanliness.
        ...(isLast ? {} : { easing: SEGMENT_EASING }),
      });
    }

    const timeline = new ViewTimeline({ subject, axis: "block" });
    const animation = pathEl.animate(keyframes, {
      timeline,
      fill: "both",
      rangeStart: { rangeName: "entry", offset: CSS.percent(100) },
      rangeEnd: { rangeName: "exit", offset: CSS.percent(0) },
    });
    return () => {
      animation.cancel();
    };
  }, [path]);

  if (path.totalLength === 0) return null;

  // SVG sits OVERHANG above the cards container's top so its content area
  // covers the line's full vertical extent (top cap above first card,
  // bottom overhang below last card).
  const style: CSSProperties = { top: -LINE_GEOMETRY.overhang, left: 0 };

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      width={path.svgWidth}
      height={path.svgHeight}
      viewBox={`0 0 ${path.svgWidth} ${path.svgHeight}`}
      style={style}
    >
      <path
        ref={pathRef}
        d={path.d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={LINE_GEOMETRY.lineWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
        // Static fallback: dasharray covers the whole path, dashoffset is 0,
        // so the line renders fully. The WAAPI animation, when active,
        // overrides dashoffset to drive the scroll-driven reveal.
        strokeDasharray={path.totalLength}
        strokeDashoffset={0}
      />
    </svg>
  );
}
