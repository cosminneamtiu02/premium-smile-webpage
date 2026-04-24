import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type LinkVariant = "default" | "muted" | "nav";

type ExternalLinkProps = {
  variant?: LinkVariant;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const VARIANTS: Record<LinkVariant, string> = {
  default: "text-accent underline-offset-4 hover:underline",
  muted: "text-fg-muted hover:text-fg",
  nav: "text-fg hover:text-accent font-medium",
};

/**
 * External link. For internal navigation use TanStack Router's `<Link>`
 * directly — this atom is explicitly for URLs leaving the SPA (phone:, mailto:,
 * or other origins). Opens in a new tab with rel="noopener noreferrer".
 */
export function Link({ variant = "default", className, children, ...props }: ExternalLinkProps) {
  return (
    <a
      {...props}
      className={cn("inline-flex items-center transition-colors", VARIANTS[variant], className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
