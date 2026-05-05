import { MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { Container } from "@/shared/components/ui/container/container";
import { MapFrame } from "@/shared/components/ui/map-frame/map-frame";
import { cn } from "@/shared/lib/cn";

export type ClinicLocationProps = {
  /** Optional eyebrow above the title (e.g. "Find us"). */
  eyebrow?: string;
  /** Section heading, e.g. "Visit our clinic". */
  title: string;
  /** Google Maps Embed URL — passed to `<MapFrame>`. */
  embedSrc: string;
  /** Map iframe title (a11y) — passed to `<MapFrame>`. */
  mapTitle: string;
  /** Where the address row links to. Opens in a new tab. */
  directionsHref: string;
  /** Visible address text. */
  address: string;
  /** Aria-label for the address row's link, e.g. "Get directions to {address}". */
  directionsLabel: string;
  /** Visible phone (with the formatting the user should see). */
  phone: string;
  /** Aria-label for the phone row's link, e.g. "Call {phone}". */
  callLabel: string;
  /** Optional override; defaults to `tel:` of the digits in `phone`. */
  phoneHref?: string;
  /** id for the section heading — used as `aria-labelledby` on the wrapping section. */
  headingId?: string;
  className?: string;
};

type ContactRowProps = {
  href: string;
  ariaLabel: string;
  icon: ReactNode;
  text: string;
  /** Adds target="_blank" + rel="noopener noreferrer". */
  external?: boolean;
};

/**
 * One row of the contact panel. The whole row is a single anchor — the round
 * icon span is decorative (`aria-hidden`) and animated via `group-hover:`
 * triggers on the parent. We do NOT nest `IconButton` inside this anchor;
 * nesting interactive content inside `<a>` is invalid HTML.
 */
function ContactRow({ href, ariaLabel, icon, text, external }: ContactRowProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group -m-3 flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span
        aria-hidden
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-accent transition-all duration-200 ease-out group-hover:scale-105 group-active:scale-100 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg [&_svg]:h-5 [&_svg]:w-5"
      >
        {icon}
      </span>
      <span className="text-base font-medium text-fg transition-colors duration-200 group-hover:text-accent sm:text-lg">
        {text}
      </span>
    </a>
  );
}

/**
 * Standalone home-page section showing the clinic on a Google Maps Embed
 * iframe alongside an address row and a phone row. Each row is a single
 * clickable target — the address row opens directions in a new tab, the
 * phone row dials via `tel:`.
 */
export function ClinicLocation({
  eyebrow,
  title,
  embedSrc,
  mapTitle,
  directionsHref,
  address,
  directionsLabel,
  phone,
  callLabel,
  phoneHref,
  headingId = "clinic-location-heading",
  className,
}: ClinicLocationProps) {
  const derivedPhoneHref = phoneHref ?? `tel:${phone.replace(/\s/g, "")}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-bg-subtle py-12 sm:py-16 lg:py-20", className)}
    >
      <Container width="lg">
        <SectionHeading
          {...(eyebrow ? { eyebrow } : {})}
          title={title}
          id={headingId}
          align="start"
        />

        <div className="mt-8 grid gap-6 sm:mt-10 lg:mt-12 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-10">
          <MapFrame embedSrc={embedSrc} title={mapTitle} aspect="wide" />

          <div className="flex flex-col gap-4 sm:gap-5">
            <ContactRow
              href={directionsHref}
              ariaLabel={directionsLabel}
              icon={<MapPin aria-hidden />}
              text={address}
              external
            />
            <ContactRow
              href={derivedPhoneHref}
              ariaLabel={callLabel}
              icon={<Phone aria-hidden />}
              text={phone}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
