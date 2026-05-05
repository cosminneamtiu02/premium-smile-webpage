import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { Container } from "@/shared/components/ui/container/container";
import { cn } from "@/shared/lib/cn";
import { HelpingStaffCard, type StaffMember } from "./helping-staff-card/helping-staff-card";

type HelpingStaffGridProps = {
  /** The data for every card. */
  staff: ReadonlyArray<StaffMember>;
  /** Section eyebrow above the heading. */
  sectionEyebrow?: string;
  /** Section heading (rendered as h2). */
  sectionTitle: string;
  /** id for the section heading — used for `aria-labelledby` on the section. */
  headingId?: string;
  className?: string;
};

/**
 * Section that displays the clinic's helping staff (assistants, hygienists,
 * receptionists, office manager) in a responsive grid: 1 col on mobile, 2 on
 * sm, 3 on lg. Each cell is a `<HelpingStaffCard>`. Padding and container
 * width match `DoctorShowcase` so the two sections rhythmically align on a
 * shared page.
 *
 * `<ul>` / `<li>` semantics make the roster announce as "list, N items" to
 * screen readers — a real benefit over `<div>` for a roster of people.
 */
export function HelpingStaffGrid({
  staff,
  sectionEyebrow,
  sectionTitle,
  headingId = "helping-staff-grid-heading",
  className,
}: HelpingStaffGridProps) {
  return (
    <section
      data-helping-staff-grid
      aria-labelledby={headingId}
      className={cn("py-16 sm:py-20 lg:py-24", className)}
    >
      <Container width="lg">
        <SectionHeading
          {...(sectionEyebrow ? { eyebrow: sectionEyebrow } : {})}
          title={sectionTitle}
          id={headingId}
          className="mb-12 sm:mb-16"
        />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {staff.map((person) => (
            <li key={person.id}>
              <HelpingStaffCard staff={person} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
