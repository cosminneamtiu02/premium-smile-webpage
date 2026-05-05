/**
 * Pure path builder for the doctor-showcase decorative zigzag line.
 *
 * Given each card's measured layout (top, height, imageSide), this returns
 * the SVG path "d" string that traces the entire zigzag as a single
 * continuous polyline plus a per-segment breakdown used to drive the
 * scroll-driven reveal.
 *
 * Polyline shape, for N cards (imageSide alternating left/right):
 *   1) top cap         — horizontal, full width
 *   2) vertical 1      — down on card 0's imageSide, from top through card 0
 *                        and into the bottom-of-card-0 gap midpoint
 *   3) traversal 1     — horizontal, in the gap between card 0 and card 1
 *   4) vertical 2      — down on card 1's imageSide, from gap midpoint
 *                        through card 1 into the next gap midpoint
 *   ...                  (alternates)
 *   2N) vertical N     — down on card N-1's imageSide to the bottom overhang
 *
 * Total: 2N segments alternating horizontal/vertical. The mirror stub of
 * card N-1 and the main vertical of card N are intentionally combined into
 * a single vertical segment because they are visually one continuous line
 * at the same x-coordinate; this also gives the per-segment scroll-budget
 * pacing one slot per joint instead of two.
 *
 * Coordinate system: SVG origin (0, 0) is at the top-left of the line's
 * bounding rectangle, which is OVERHANG above the first card's top edge.
 * Path coordinates are stroke CENTERS — the rendered stroke extends
 * LINE_W / 2 on each side.
 */

const INSET = 24;
const LINE_W = 6;
const OVERHANG = 32;
const GAP = 56;
const HALF_LINE = LINE_W / 2;
const GAP_HALF = GAP / 2;

export type CardLayout = {
  /** Card top y-coordinate, with first card at 0, in CSS pixels. */
  top: number;
  height: number;
  imageSide: "left" | "right";
};

export type LineSegment = {
  kind: "horizontal" | "vertical";
  length: number;
};

export type LinePath = {
  /** SVG path "d" attribute, or "" when there are no cards. */
  d: string;
  /** Segments in path-traversal order. Sum of lengths === totalLength. */
  segments: ReadonlyArray<LineSegment>;
  totalLength: number;
  svgWidth: number;
  svgHeight: number;
};

const EMPTY_PATH = (width: number): LinePath => ({
  d: "",
  segments: [],
  totalLength: 0,
  svgWidth: width,
  svgHeight: 0,
});

const oppositeOf = (side: "left" | "right"): "left" | "right" =>
  side === "left" ? "right" : "left";

export function buildLinePath(
  cards: ReadonlyArray<CardLayout>,
  options: { width: number },
): LinePath {
  const { width } = options;
  const firstCard = cards[0];
  const lastCard = cards[cards.length - 1];
  if (!firstCard || !lastCard) return EMPTY_PATH(width);

  const xForSide = (side: "left" | "right"): number =>
    side === "left" ? INSET + HALF_LINE : width - INSET - HALF_LINE;

  const topY = HALF_LINE;
  const svgHeight = lastCard.top + lastCard.height + OVERHANG * 2;
  const bottomY = svgHeight - HALF_LINE;

  // Walk the polyline as a list of stroke-center waypoints, then derive
  // d-string + segment lengths from consecutive deltas.
  const points: Array<[number, number]> = [];
  // Top cap: starts at the corner OPPOSITE the first card's imageSide so the
  // pen ends up at the imageSide corner from which vertical 1 descends.
  points.push([xForSide(oppositeOf(firstCard.imageSide)), topY]);
  points.push([xForSide(firstCard.imageSide), topY]);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (!card) continue;
    const isLast = i === cards.length - 1;

    // Vertical descends to the midpoint of the gap below this card, or to
    // the SVG bottom (overhang) when this is the last card.
    const endY = isLast ? bottomY : card.top + card.height + OVERHANG + GAP_HALF;
    points.push([xForSide(card.imageSide), endY]);

    if (!isLast) {
      const next = cards[i + 1];
      if (!next) continue;
      // Traversal across the gap to the next card's imageSide.
      points.push([xForSide(next.imageSide), endY]);
    }
  }

  let d = "";
  const segments: LineSegment[] = [];
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (!point) continue;
    const [x, y] = point;
    if (i === 0) {
      d += `M${x} ${y}`;
      continue;
    }
    const prev = points[i - 1];
    if (!prev) continue;
    const [px, py] = prev;
    const dx = Math.abs(x - px);
    const dy = Math.abs(y - py);
    segments.push({
      kind: dx > dy ? "horizontal" : "vertical",
      length: Math.max(dx, dy),
    });
    d += ` L${x} ${y}`;
  }

  const totalLength = segments.reduce((acc, s) => acc + s.length, 0);

  return { d, segments, totalLength, svgWidth: width, svgHeight };
}

/** Geometry constants exposed for component layout (e.g. SVG stroke-width). */
export const LINE_GEOMETRY = {
  inset: INSET,
  lineWidth: LINE_W,
  overhang: OVERHANG,
  gap: GAP,
} as const;
