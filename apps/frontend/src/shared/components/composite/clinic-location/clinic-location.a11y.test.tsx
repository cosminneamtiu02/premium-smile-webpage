import type { RunOptions } from "axe-core";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { ClinicLocation } from "./clinic-location";

// jsdom does not load iframe content, so axe-core's cross-frame recursion
// (`_collectResultsFromFrames`) throws "Respondable target must be a frame
// in the current window" against any iframe in the tree. `iframes: false`
// skips the recursion entirely. The `frame-title` rule still runs on the
// parent document and still catches the regression of someone removing
// the iframe's `title` attribute, because it inspects the iframe element
// from the parent side without postMessage.
const AXE_OPTIONS_FOR_IFRAME: RunOptions = {
  iframes: false,
};

const baseProps = {
  eyebrow: "Find us",
  title: "Visit our clinic",
  embedSrc: "https://www.google.com/maps/embed?pb=fake",
  mapTitle: "Map showing the clinic",
  directionsHref: "https://maps.app.goo.gl/abc123",
  address: "Strada Exemplu nr. 1, București",
  directionsLabel: "Get directions to Strada Exemplu nr. 1, București",
  phone: "+40 700 000 000",
  callLabel: "Call +40 700 000 000",
} as const;

describe("ClinicLocation — a11y", () => {
  it("has no axe violations with all props provided", async () => {
    const { container } = renderWithProviders(<ClinicLocation {...baseProps} />);
    expect(await axe(container, AXE_OPTIONS_FOR_IFRAME)).toHaveNoViolations();
  });

  it("has no axe violations without an eyebrow", async () => {
    const { eyebrow: _eyebrow, ...withoutEyebrow } = baseProps;
    const { container } = renderWithProviders(<ClinicLocation {...withoutEyebrow} />);
    expect(await axe(container, AXE_OPTIONS_FOR_IFRAME)).toHaveNoViolations();
  });
});
