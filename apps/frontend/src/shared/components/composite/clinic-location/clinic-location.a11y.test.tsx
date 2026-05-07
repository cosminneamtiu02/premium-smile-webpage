import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AXE_OPTIONS_FOR_IFRAME, renderWithProviders } from "@/test-utils";
import { ClinicLocation } from "./clinic-location";

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
