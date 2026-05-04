import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stars } from "./stars";

describe("Stars", () => {
  it("renders five star svgs regardless of value", () => {
    const { container } = render(<Stars value={3} />);
    expect(container.querySelectorAll("svg")).toHaveLength(5);
  });

  it("fills exactly `value` stars when value is in range", () => {
    const { container } = render(<Stars value={3} />);
    const filled = container.querySelectorAll("[data-filled='true']");
    const empty = container.querySelectorAll("[data-filled='false']");
    expect(filled).toHaveLength(3);
    expect(empty).toHaveLength(2);
  });

  it("clamps values above 5 to 5", () => {
    const { container } = render(<Stars value={9} />);
    expect(container.querySelectorAll("[data-filled='true']")).toHaveLength(5);
  });

  it("clamps values below 0 to 0", () => {
    const { container } = render(<Stars value={-3} />);
    expect(container.querySelectorAll("[data-filled='true']")).toHaveLength(0);
  });

  it("exposes a default screen-reader label like 'N out of 5 stars'", () => {
    const { getByRole } = render(<Stars value={4} />);
    expect(getByRole("img").getAttribute("aria-label")).toBe("4 out of 5 stars");
  });

  it("uses a custom label when provided", () => {
    const { getByRole } = render(<Stars value={5} label="5 stele din 5" />);
    expect(getByRole("img").getAttribute("aria-label")).toBe("5 stele din 5");
  });
});
