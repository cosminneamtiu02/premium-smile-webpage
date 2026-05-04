import {
  type Doctor,
  DoctorCard,
  type DoctorCardPosition,
} from "@/shared/components/composite/doctor-card/doctor-card";
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { Container } from "@/shared/components/ui/container/container";
import { cn } from "@/shared/lib/cn";

function positionFor(index: number, total: number): DoctorCardPosition {
  if (total === 1) return "only";
  if (index === 0) return "first";
  if (index === total - 1) return "last";
  return "middle";
}

type DoctorShowcaseProps = {
  /** The data for every card. Cards alternate image-left / image-right by index. */
  doctors: ReadonlyArray<Doctor>;
  /** Section eyebrow above the heading, e.g. "Five specialists. One shared standard of care." */
  sectionEyebrow?: string;
  /** Section heading, e.g. "Meet Our Team". */
  sectionTitle: string;
  /** CTA label for every card. Omit to render text-only cards. */
  ctaLabel?: string;
  /** Per-card click handler — receives the doctor whose CTA was activated. */
  onDoctorCta?: (doctor: Doctor) => void;
  /** id for the section heading — used for `aria-labelledby` on the wrapping section. */
  headingId?: string;
  className?: string;
};

/**
 * Presentational section that highlights a curated set of doctors with
 * full bios and CTAs. This is distinct from the future Doctors-and-Staff
 * page, which is expected to list everyone in a more compact format —
 * naming this `DoctorShowcase` keeps the more general name available.
 */
export function DoctorShowcase({
  doctors,
  sectionEyebrow,
  sectionTitle,
  ctaLabel,
  onDoctorCta,
  headingId = "doctor-showcase-heading",
  className,
}: DoctorShowcaseProps) {
  return (
    <section aria-labelledby={headingId} className={cn("py-16 sm:py-20 lg:py-24", className)}>
      <Container width="lg">
        <SectionHeading
          {...(sectionEyebrow ? { eyebrow: sectionEyebrow } : {})}
          title={sectionTitle}
          id={headingId}
          className="mb-12 sm:mb-16"
        />
        <div className="flex flex-col gap-14">
          {doctors.map((doctor, i) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              imageSide={i % 2 === 0 ? "left" : "right"}
              position={positionFor(i, doctors.length)}
              {...(ctaLabel ? { ctaLabel } : {})}
              {...(onDoctorCta ? { onCta: () => onDoctorCta(doctor) } : {})}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
