import { cn } from "@/shared/lib/cn";

type StarsProps = {
  /** Number of filled stars, clamped to [0, 5]. */
  value: number;
  /** Pixel size of each star icon. */
  size?: number;
  /** Override aria-label. Defaults to `${value} out of 5 stars`. */
  label?: string;
  className?: string;
};

const STAR_PATH =
  "M12 2.5l2.95 6.18 6.8.66-5.07 4.65 1.5 6.61L12 17.27 5.82 20.6l1.5-6.61L2.25 9.34l6.8-.66L12 2.5z";

export function Stars({ value, size = 18, label, className }: StarsProps) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  const ariaLabel = label ?? `${v} out of 5 stars`;
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn("inline-flex items-center gap-0.5 leading-none", className)}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= v;
        return (
          <svg
            key={i}
            data-filled={filled}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={filled ? "fill-gold text-gold" : "fill-current text-border"}
          >
            <path d={STAR_PATH} />
          </svg>
        );
      })}
    </span>
  );
}
