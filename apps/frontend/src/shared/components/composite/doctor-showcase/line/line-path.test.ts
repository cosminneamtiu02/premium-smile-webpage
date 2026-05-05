import { describe, expect, it } from "vitest";
import { buildLinePath, type CardLayout } from "./line-path";

// Geometry constants — kept inline so the tests fail loudly if anyone tweaks
// the values in line-path.ts without checking the math.
const INSET = 24;
const HALF_LINE = 3;
const OVERHANG = 32;
const GAP = 56;
const GAP_HALF = 28;

const X_LEFT = INSET + HALF_LINE; // 27
const xRight = (width: number) => width - INSET - HALF_LINE;

describe("buildLinePath", () => {
  describe("with no cards", () => {
    it("returns an empty path with svgHeight=0 and the requested width", () => {
      const result = buildLinePath([], { width: 800 });
      expect(result.d).toBe("");
      expect(result.segments).toEqual([]);
      expect(result.totalLength).toBe(0);
      expect(result.svgWidth).toBe(800);
      expect(result.svgHeight).toBe(0);
    });
  });

  describe("with a single (only) card on the left", () => {
    const card: CardLayout = { top: 0, height: 200, imageSide: "left" };
    const result = buildLinePath([card], { width: 800 });

    it("produces 2 segments — top cap (H) then a single vertical (V)", () => {
      expect(result.segments.map((s) => s.kind)).toEqual(["horizontal", "vertical"]);
    });

    it("starts at the right end of the top cap and walks left then down", () => {
      // Top cap from RIGHT (opposite of imageSide) to LEFT, then vertical down.
      expect(result.d).toBe(`M${xRight(800)} ${HALF_LINE} L${X_LEFT} ${HALF_LINE} L${X_LEFT} 261`);
    });

    it("svgHeight equals card height + 2 * overhang", () => {
      expect(result.svgHeight).toBe(200 + OVERHANG * 2);
    });

    it("totalLength equals the sum of segment lengths", () => {
      const sum = result.segments.reduce((acc, s) => acc + s.length, 0);
      expect(result.totalLength).toBe(sum);
    });
  });

  describe("with a single (only) card on the right", () => {
    const card: CardLayout = { top: 0, height: 200, imageSide: "right" };
    const result = buildLinePath([card], { width: 800 });

    it("starts at the LEFT end of the top cap and walks right then down", () => {
      expect(result.d).toBe(
        `M${X_LEFT} ${HALF_LINE} L${xRight(800)} ${HALF_LINE} L${xRight(800)} 261`,
      );
    });
  });

  describe("with two cards (first + last) alternating left then right", () => {
    const cards: CardLayout[] = [
      { top: 0, height: 100, imageSide: "left" },
      { top: 100 + GAP, height: 150, imageSide: "right" },
    ];
    const result = buildLinePath(cards, { width: 800 });

    it("produces 4 segments alternating H V H V", () => {
      expect(result.segments.map((s) => s.kind)).toEqual([
        "horizontal",
        "vertical",
        "horizontal",
        "vertical",
      ]);
    });

    it("the traversal sits at the midpoint of the gap between the two cards", () => {
      // card[0] bottom in SVG = 0 + 100 + 32 = 132. Gap midpoint = 132 + 28 = 160.
      const midGap = 100 + OVERHANG + GAP_HALF;
      expect(result.d).toContain(`L${X_LEFT} ${midGap}`);
      expect(result.d).toContain(`L${xRight(800)} ${midGap}`);
    });

    it("ends with a vertical down on the right side to bottomY", () => {
      const lastBottom = 100 + GAP + 150 + OVERHANG; // 100+56+150+32 = 338
      const svgHeight = lastBottom + OVERHANG; // 370
      const bottomY = svgHeight - HALF_LINE; // 367
      expect(result.d.endsWith(`L${xRight(800)} ${bottomY}`)).toBe(true);
    });
  });

  describe("with three cards (first + middle + last) alternating L/R/L", () => {
    const cards: CardLayout[] = [
      { top: 0, height: 200, imageSide: "left" },
      { top: 200 + GAP, height: 300, imageSide: "right" },
      { top: 200 + GAP + 300 + GAP, height: 250, imageSide: "left" },
    ];
    const result = buildLinePath(cards, { width: 800 });

    it("produces exactly 6 segments alternating H V H V H V", () => {
      expect(result.segments.map((s) => s.kind)).toEqual([
        "horizontal",
        "vertical",
        "horizontal",
        "vertical",
        "horizontal",
        "vertical",
      ]);
    });

    it("every horizontal segment spans the full line width minus 2 * (INSET + LINE_W/2)", () => {
      const expectedSpan = 800 - 2 * (INSET + HALF_LINE);
      const horizontals = result.segments.filter((s) => s.kind === "horizontal");
      for (const h of horizontals) {
        expect(h.length).toBe(expectedSpan);
      }
    });

    it("middle vertical (gap-midpoint to gap-midpoint) length equals card height + GAP", () => {
      // Vertical 2 traverses: half-gap-above-card-1 + card 1 height (300) + half-gap-below-card-1.
      const middleVertical = result.segments[3];
      expect(middleVertical?.length).toBe(300 + GAP);
    });

    it("svgHeight matches the cards-area height plus 2 * overhang", () => {
      const lastTop = 200 + GAP + 300 + GAP;
      expect(result.svgHeight).toBe(lastTop + 250 + OVERHANG * 2);
    });

    it("totalLength equals the sum of all segment lengths", () => {
      const sum = result.segments.reduce((acc, s) => acc + s.length, 0);
      expect(result.totalLength).toBe(sum);
    });
  });

  describe("with four cards (first + middle + middle + last) alternating L/R/L/R", () => {
    const cards: CardLayout[] = [
      { top: 0, height: 200, imageSide: "left" },
      { top: 256, height: 200, imageSide: "right" },
      { top: 512, height: 200, imageSide: "left" },
      { top: 768, height: 200, imageSide: "right" },
    ];
    const result = buildLinePath(cards, { width: 800 });

    it("produces exactly 8 segments (2 per card)", () => {
      expect(result.segments).toHaveLength(8);
    });

    it("ends on the right side because the last card's imageSide is right", () => {
      const lastBottom = 768 + 200 + OVERHANG;
      const svgHeight = lastBottom + OVERHANG;
      const bottomY = svgHeight - HALF_LINE;
      expect(result.d.endsWith(`L${xRight(800)} ${bottomY}`)).toBe(true);
    });
  });

  describe("path-direction property: traversal direction follows the preceding vertical", () => {
    it("after a left-side vertical, traversal goes left → right", () => {
      const cards: CardLayout[] = [
        { top: 0, height: 100, imageSide: "left" },
        { top: 156, height: 100, imageSide: "right" },
      ];
      const result = buildLinePath(cards, { width: 800 });
      // Look for the L→R traversal: from x=27 to x=773 at the same y.
      const midGap = 100 + OVERHANG + GAP_HALF;
      const idx = result.d.indexOf(`L${X_LEFT} ${midGap}`);
      const next = result.d.indexOf(`L${xRight(800)} ${midGap}`);
      expect(idx).toBeGreaterThan(0);
      expect(next).toBeGreaterThan(idx);
    });

    it("after a right-side vertical, traversal goes right → left", () => {
      const cards: CardLayout[] = [
        { top: 0, height: 100, imageSide: "right" },
        { top: 156, height: 100, imageSide: "left" },
      ];
      const result = buildLinePath(cards, { width: 800 });
      const midGap = 100 + OVERHANG + GAP_HALF;
      const idx = result.d.indexOf(`L${xRight(800)} ${midGap}`);
      const next = result.d.indexOf(`L${X_LEFT} ${midGap}`);
      expect(idx).toBeGreaterThan(0);
      expect(next).toBeGreaterThan(idx);
    });
  });
});
