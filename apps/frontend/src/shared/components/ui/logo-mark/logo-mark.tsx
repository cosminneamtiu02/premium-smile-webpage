import { cn } from "@/shared/lib/cn";

type LogoMarkProps = {
  size?: number;
  /** Render colour. Defaults to `text-accent`. Pass any Tailwind color class to override. */
  className?: string;
};

/**
 * Stylised tooth-shaped brand mark, drawn from a single SVG path.
 * Inherits its fill from `currentColor`, so colour comes via `className`
 * (`text-accent`, `text-fg`, `text-fg-on-accent` …) — no hardcoded values.
 */
export function LogoMark({ size = 26, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("shrink-0 text-accent", className)}
    >
      <path
        d="M16 4c4 0 7 3 7 7 0 3 -2 5 -2 8 0 5 -2 9 -5 9s -5 -4 -5 -9c0 -3 -2 -5 -2 -8 0 -4 3 -7 7 -7z"
        fill="currentColor"
        opacity="0.92"
      />
      <circle cx="11" cy="11" r="1.4" className="fill-bg-elevated" />
    </svg>
  );
}
