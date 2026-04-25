import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderPageWithLayout } from "@/test-utils";
import { BlogPage } from "./blog-page";

describe("BlogPage — a11y", () => {
  it("has no axe violations (full layout, EN)", async () => {
    const { container } = renderPageWithLayout(<BlogPage />, "/en/blog");
    expect(await axe(container)).toHaveNoViolations();
  });
});
