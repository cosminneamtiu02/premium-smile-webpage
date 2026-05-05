import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { ShowcaseLine } from "./line";
import type { CardLayout } from "./line-path";

const CARDS: CardLayout[] = [
  { top: 0, height: 200, imageSide: "left" },
  { top: 256, height: 200, imageSide: "right" },
  { top: 512, height: 200, imageSide: "left" },
];

describe("ShowcaseLine — a11y", () => {
  it("has no axe violations (decorative SVG, aria-hidden)", async () => {
    const { container } = renderWithProviders(
      <div data-doctor-showcase>
        <ShowcaseLine cards={CARDS} width={800} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders nothing when given an empty card list", () => {
    const { container } = renderWithProviders(<ShowcaseLine cards={[]} width={800} />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
