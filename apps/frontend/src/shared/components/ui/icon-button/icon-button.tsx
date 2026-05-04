import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type IconButtonSize = "sm" | "md" | "lg";

type IconButtonProps = {
  /** SVG or other graphical content centered inside the button. */
  icon: ReactNode;
  /** Required aria-label since the button has no visible text. */
  label: string;
  /** When set, renders an `<a>`; otherwise renders a `<button>`. */
  href?: string;
  /** Adds `target="_blank" rel="noopener noreferrer"` for outbound links. */
  external?: boolean;
  onClick?: () => void;
  /** Drives both the outer dimensions and the inner SVG size, with mobile→desktop scaling baked in. */
  size?: IconButtonSize;
  /** Override classes — e.g. swap colours. The default uses theme tokens (`text-accent`, `bg-bg-elevated`). */
  className?: string;
};

const SIZE_CLASS: Record<IconButtonSize, string> = {
  sm: "h-9 w-9 sm:h-10 sm:w-10 [&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5",
  md: "h-10 w-10 sm:h-11 sm:w-11 [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-12 w-12 sm:h-14 sm:w-14 [&_svg]:h-6 [&_svg]:w-6 sm:[&_svg]:h-7 sm:[&_svg]:w-7",
};

const BASE_CLASS =
  "inline-flex shrink-0 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-accent transition-all duration-200 ease-out hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-fg active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function IconButton({
  icon,
  label,
  href,
  external,
  onClick,
  size = "md",
  className,
}: IconButtonProps) {
  const merged = cn(BASE_CLASS, SIZE_CLASS[size], className);

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        className={merged}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(onClick ? { onClick } : {})}
      >
        {icon}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} className={merged} {...(onClick ? { onClick } : {})}>
      {icon}
    </button>
  );
}
