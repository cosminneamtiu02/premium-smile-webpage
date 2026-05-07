import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { ClinicLocation } from "./clinic-location";

const baseProps = {
  title: "Visit our clinic",
  embedSrc: "https://www.google.com/maps/embed?pb=fake",
  mapTitle: "Map showing the clinic",
  directionsHref: "https://maps.app.goo.gl/abc123",
  address: "Strada Exemplu nr. 1, București",
  directionsLabel: "Get directions to Strada Exemplu nr. 1, București",
  phone: "+40 700 000 000",
  callLabel: "Call +40 700 000 000",
} as const;

describe("ClinicLocation", () => {
  it("renders the directions row as an external anchor with the given href", () => {
    renderWithProviders(<ClinicLocation {...baseProps} />);

    const directionsLink = screen.getByRole("link", { name: baseProps.directionsLabel });
    expect(directionsLink).toHaveAttribute("href", baseProps.directionsHref);
    expect(directionsLink).toHaveAttribute("target", "_blank");
    expect(directionsLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("derives the phone tel: href from the visible phone string by default", () => {
    renderWithProviders(<ClinicLocation {...baseProps} />);

    const phoneLink = screen.getByRole("link", { name: baseProps.callLabel });
    expect(phoneLink).toHaveAttribute("href", "tel:+40700000000");
    expect(phoneLink).not.toHaveAttribute("target");
  });

  it("respects an explicit phoneHref override", () => {
    renderWithProviders(<ClinicLocation {...baseProps} phoneHref="tel:+40711111111" />);

    const phoneLink = screen.getByRole("link", { name: baseProps.callLabel });
    expect(phoneLink).toHaveAttribute("href", "tel:+40711111111");
  });

  it("renders the map iframe with the given embedSrc and title", () => {
    renderWithProviders(<ClinicLocation {...baseProps} />);

    const iframe = screen.getByTitle(baseProps.mapTitle);
    expect(iframe).toHaveAttribute("src", baseProps.embedSrc);
  });

  it("uses the provided headingId for aria-labelledby on the section", () => {
    const { container } = renderWithProviders(
      <ClinicLocation {...baseProps} headingId="custom-heading-id" />,
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "custom-heading-id");
    expect(container.querySelector("#custom-heading-id")).not.toBeNull();
  });

  it("uses the default headingId when none is provided", () => {
    const { container } = renderWithProviders(<ClinicLocation {...baseProps} />);

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "clinic-location-heading");
    expect(container.querySelector("#clinic-location-heading")).not.toBeNull();
  });
});
