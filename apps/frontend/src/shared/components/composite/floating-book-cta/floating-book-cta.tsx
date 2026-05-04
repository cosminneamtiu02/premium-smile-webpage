import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/shared/components/ui/icon-button/icon-button";
import { cn } from "@/shared/lib/cn";

type FloatingBookCtaProps = {
  /** When set, renders an `<a>`; otherwise `<button>`. */
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Persistent "Book now" round button pinned to the bottom-right of the
 * viewport. Same round shape as the footer's social IconButtons, but with
 * the colour states **inverted**: filled accent at rest (the social
 * buttons' hover state), outlined-elevated on hover (the social buttons'
 * base state). Phone icon inside, dialing the clinic on click.
 *
 * Mounted once at the layout level so it appears on every page.
 */
export function FloatingBookCta({ href, onClick, className }: FloatingBookCtaProps) {
  const { t } = useTranslation();

  return (
    <IconButton
      icon={<Phone aria-hidden />}
      label={t("book_cta.aria_label")}
      {...(href ? { href } : {})}
      {...(onClick ? { onClick } : {})}
      size="lg"
      className={cn(
        // Pinned bottom-right. `fixed` keeps it in the viewport regardless
        // of scroll. `z-50` matches the TopBar so it sits above page content.
        "fixed bottom-5 right-5 z-50 sm:bottom-8 sm:right-8",
        // Inverted from the IconButton default: filled at rest, outlined
        // on hover. tailwind-merge dedupes against the base classes.
        "border-accent bg-accent text-accent-fg shadow-cta",
        "hover:border-border-subtle hover:bg-bg-elevated hover:text-accent hover:shadow-cta-lg",
        className,
      )}
    />
  );
}
