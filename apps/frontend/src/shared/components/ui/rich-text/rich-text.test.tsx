import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichText } from "./rich-text";

describe("RichText", () => {
  it("renders a plain string with no markers", () => {
    render(<RichText value="Plain text only." />);
    expect(screen.getByText("Plain text only.")).toBeInTheDocument();
  });

  it("renders <b>...</b> markers as <strong> elements", () => {
    const { container } = render(<RichText value="Hello <b>world</b>!" />);
    const strong = container.querySelector("strong");
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toBe("world");
    expect(container.textContent).toBe("Hello world!");
  });

  it("renders multiple bold spans interleaved with plain text", () => {
    const { container } = render(<RichText value="<b>One</b> two <b>three</b> four <b>five</b>" />);
    const strongs = container.querySelectorAll("strong");
    expect(strongs).toHaveLength(3);
    expect(Array.from(strongs).map((s) => s.textContent)).toEqual(["One", "three", "five"]);
    expect(container.textContent).toBe("One two three four five");
  });

  it("renders an array form of parts", () => {
    const { container } = render(
      <RichText
        parts={["With over ", { bold: "fifteen years of experience" }, " in aesthetic dentistry."]}
      />,
    );
    expect(container.querySelector("strong")?.textContent).toBe("fifteen years of experience");
    expect(container.textContent).toBe(
      "With over fifteen years of experience in aesthetic dentistry.",
    );
  });

  it("treats unmatched <b> as literal text rather than crashing", () => {
    render(<RichText value="Open <b>tag with no close" />);
    expect(screen.getByText(/Open <b>tag with no close/)).toBeInTheDocument();
  });

  it("renders empty when neither value nor parts is provided", () => {
    const { container } = render(<RichText />);
    expect(container.textContent).toBe("");
  });
});
