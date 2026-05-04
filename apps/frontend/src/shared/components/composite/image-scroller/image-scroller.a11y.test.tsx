import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { ImageScroller, type ScrollerImage } from "./image-scroller";

const FIRST: ScrollerImage = {
  src: "https://example.com/a.jpg",
  alt: "Treatment room with natural light",
};
const SECOND: ScrollerImage = {
  src: "https://example.com/b.jpg",
  alt: "Reception desk with floral display",
};
const IMAGES: ScrollerImage[] = [FIRST, SECOND];

describe("ImageScroller — a11y", () => {
  it("has no axe violations with multiple images", async () => {
    const { container } = renderWithProviders(<ImageScroller images={IMAGES} autoPlay={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with a single image (no controls)", async () => {
    const { container } = renderWithProviders(<ImageScroller images={[FIRST]} autoPlay={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when empty", async () => {
    const { container } = renderWithProviders(<ImageScroller images={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
