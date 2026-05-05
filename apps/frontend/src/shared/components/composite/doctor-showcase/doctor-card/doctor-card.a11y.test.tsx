import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { type Doctor, DoctorCard } from "./doctor-card";

const DOCTOR: Doctor = {
  id: "elena-marin",
  name: "Dr. Elena Marin",
  roles: ["Founder", "Cosmetic Dentistry"],
  photo: {
    src: "https://example.com/elena.jpg",
    alt: "Portrait of Dr. Elena Marin",
  },
  bio: "Fifteen years of <b>experience</b> across aesthetic dentistry.",
};

describe("DoctorCard — a11y", () => {
  it("has no axe violations with photo + CTA", async () => {
    const { container } = renderWithProviders(
      <DoctorCard doctor={DOCTOR} ctaLabel="Book Consultation" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with the photo omitted (mobile shape)", async () => {
    const { container } = renderWithProviders(
      <DoctorCard
        doctor={{ id: DOCTOR.id, name: DOCTOR.name, roles: DOCTOR.roles, bio: DOCTOR.bio }}
        ctaLabel="Book Consultation"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with no CTA", async () => {
    const { container } = renderWithProviders(<DoctorCard doctor={DOCTOR} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
