import { LogoMark } from "@/shared/components/ui/logo-mark/logo-mark";
import { cn } from "@/shared/lib/cn";

type WordmarkProps = {
  /** Brand name shown next to the logo. Omit to render the mark alone. */
  brandLabel?: string;
  /** Visible label can be hidden while still announcing it to screen readers. */
  showLabel?: boolean;
  /** Pixel size of the logo mark. Word size scales relative to this. */
  size?: number;
  /** Override classes — applies to the outer span. */
  className?: string;
  /** Extra classes applied to the brand-name span. Lets callers hide the
   * text responsively (e.g. `hidden sm:inline`) without forking the component. */
  labelClassName?: string;
  /** Override the colour family. Pass `text-fg`, `text-fg-on-accent`, etc. */
  tone?: string;
};

export function Wordmark({
  brandLabel = "Premium Smile",
  showLabel = true,
  size = 26,
  className,
  labelClassName,
  tone = "text-fg",
}: WordmarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", tone, className)}>
      <LogoMark size={size} className="text-accent" />
      {showLabel ? (
        <span
          className={cn("font-semibold leading-none tracking-tight", labelClassName)}
          style={{ fontSize: `${size * 0.7}px` }}
        >
          {brandLabel}
        </span>
      ) : (
        <span className="sr-only">{brandLabel}</span>
      )}
    </span>
  );
}
