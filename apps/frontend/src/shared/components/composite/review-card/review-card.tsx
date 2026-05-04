import { Heading } from "@/shared/components/ui/heading/heading";
import { Stars } from "@/shared/components/ui/stars/stars";
import { Text } from "@/shared/components/ui/text/text";
import { cn } from "@/shared/lib/cn";

export type Review = {
  id: string;
  /** Patient name shown in the footer. */
  name: string;
  /** Short role / context, e.g. "Veneers patient". Rendered uppercase + mono. */
  role: string;
  /** Card heading. */
  title: string;
  /** Body copy — already translated. */
  text: string;
  /** Number of filled stars (0–5). */
  rating: number;
  /** Avatar image. Optional — falls back to initials block. */
  avatar?: { src: string; alt: string };
};

type ReviewCardProps = {
  review: Review;
  /** Visually emphasized card — used by the carousel for the centered slide. */
  emphasized?: boolean;
  /** Optional aria-label for screen-reader stars (i18n). */
  starsLabel?: string;
  className?: string;
};

function Initials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-base font-semibold text-accent-fg"
    >
      {initials}
    </span>
  );
}

export function ReviewCard({ review, emphasized = false, starsLabel, className }: ReviewCardProps) {
  return (
    <article
      aria-labelledby={`review-${review.id}-title`}
      className={cn(
        "flex h-full w-full flex-col gap-4 rounded-2xl border-[3px] p-5 sm:p-7",
        emphasized ? "border-transparent bg-accent-soft" : "border-accent-soft bg-bg-elevated",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {review.avatar ? (
          <img
            src={review.avatar.src}
            alt={review.avatar.alt}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-12 w-12 rounded-full border border-border-subtle bg-bg-subtle object-cover"
          />
        ) : (
          <Initials name={review.name} />
        )}
        <Stars value={review.rating} size={16} {...(starsLabel ? { label: starsLabel } : {})} />
      </div>

      <Heading level={3} visualLevel={5} id={`review-${review.id}-title`} className="text-fg">
        {review.title}
      </Heading>

      <Text variant="muted" className="flex-1 text-sm leading-relaxed text-justify hyphens-auto">
        &ldquo;{review.text}&rdquo;
      </Text>

      <div className="border-t border-border-subtle pt-3">
        <Text variant="body" className="text-sm font-medium text-fg">
          {review.name}
        </Text>
        <p className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-fg-muted">
          {review.role}
        </p>
      </div>
    </article>
  );
}
