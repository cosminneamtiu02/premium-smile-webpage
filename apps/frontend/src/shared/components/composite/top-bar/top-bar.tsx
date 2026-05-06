import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Wordmark } from "@/shared/components/composite/wordmark/wordmark";
import { Button } from "@/shared/components/ui/button/button";
import { cn } from "@/shared/lib/cn";

export type TopBarItem = {
  /** Stable id, used as React key and as the value passed to `onNavigate`. */
  key: string;
  /** Visible label — already translated. */
  label: string;
  /** Optional href. When omitted the link uses `#${key}`. */
  href?: string;
};

type TopBarProps = {
  brandLabel?: string;
  /** Nav items shown horizontally on md+, in a panel under the bar on mobile. */
  items?: ReadonlyArray<TopBarItem>;
  /** The currently-active item — gets `aria-current="page"` and an accent style. */
  activeKey?: string;
  /** CTA label. Omit to render no CTA. */
  bookLabel?: string;
  onBook?: () => void;
  onNavigate?: (key: string) => void;
  ariaLabel?: string;
  openMenuLabel?: string;
  closeMenuLabel?: string;
  className?: string;
};

const DEFAULT_ITEMS: ReadonlyArray<TopBarItem> = [
  { key: "home", label: "Home" },
  { key: "pricing", label: "Pricing" },
  { key: "blog", label: "Blog" },
];

/**
 * `TopBar` is an **overlay** — its outer wrapper has `height: 0` so it
 * reserves no vertical space in the document flow. Content scrolls under
 * the bar; the bar itself floats at `top: 12px` via `sticky`. Toggling the
 * mobile menu does not push anything because both the bar and the panel
 * are positioned, never in flow.
 *
 * The bar's background is intentionally translucent (86% / 96% of
 * `--bg-elevated`) and pairs with `backdrop-blur` + `backdrop-saturate-150`
 * so colourful content behind the bar shows through and pops — that's the
 * "glass" effect the example mockup uses.
 */
export function TopBar({
  brandLabel = "Premium Smile",
  items = DEFAULT_ITEMS,
  activeKey,
  bookLabel,
  onBook,
  onNavigate,
  ariaLabel = "Primary",
  openMenuLabel = "Open menu",
  closeMenuLabel = "Close menu",
  className,
}: TopBarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (key: string) => {
    onNavigate?.(key);
    setOpen(false);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        // `mt-4` gives the bar 16px of breathing room from the viewport
        // top at scroll=0 so it doesn't visually stick to the screen edge.
        // `sticky top-4` matches that offset, so the bar sits at the same
        // visual y at every scroll position — looks like an overlay that
        // floats with consistent spacing.
        // Equal `mx` on both sides — the value matches the Hero text
        // block's `left-[clamp(48px,10vw,200px)]` so the bar's left edge
        // still lines up with the headline column, but with identical
        // right-side margin so the bar reads as a symmetric overlay.
        "pointer-events-none sticky top-4 z-50 mt-4 h-0 mx-[clamp(48px,10vw,200px)]",
        className,
      )}
    >
      <div className="pointer-events-auto relative">
        <div
          className={cn(
            "flex h-16 items-center justify-between gap-3 rounded-lg border border-border-subtle px-4 backdrop-blur-md backdrop-saturate-150 transition-[background-color,box-shadow] duration-300 ease-out sm:h-20 sm:px-6",
            scrolled ? "bg-bg-elevated/86 shadow-cta" : "bg-bg-elevated/96 shadow-soft-sm",
          )}
        >
          {/* biome-ignore lint/a11y/useValidAnchor: same-page fragment anchor; onClick is an SPA enhancement */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate("home");
            }}
            aria-label={`${brandLabel}, home`}
            className="inline-flex items-center rounded"
          >
            <Wordmark brandLabel={brandLabel} size={32} labelClassName="hidden sm:inline" />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {items.map((it) => {
              const isActive = activeKey === it.key;
              return (
                <li key={it.key}>
                  <a
                    href={it.href ?? `#${it.key}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(it.key);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-12 items-center px-5 text-base font-medium transition-colors duration-200 ease-out",
                      "after:pointer-events-none after:absolute after:bottom-2 after:left-5 after:right-5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out after:content-['']",
                      "hover:text-accent hover:after:scale-x-100",
                      isActive ? "text-accent after:scale-x-100" : "text-fg",
                    )}
                  >
                    {it.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            {bookLabel && (
              <Button
                {...(onBook ? { onClick: onBook } : {})}
                className={cn(
                  // Hidden on phone — the same CTA lives inside the mobile
                  // dropdown panel below. `inline-flex` re-applies the
                  // Button base display at md+.
                  "hidden h-12 border border-accent px-6 text-base font-medium shadow-cta sm:h-14 sm:px-7 md:inline-flex",
                  // FloatingBookCta-style hover: scale up + invert colours
                  // (filled lavender → white with lavender text/border) +
                  // shadow growth. Same pattern is propagated to the Hero
                  // primary CTA and the ClinicLocation contact-row icons,
                  // so every "primary action" button on the page reacts the
                  // same way to hover.
                  "transition-all duration-200 ease-out hover:scale-105 hover:translate-y-0 hover:bg-bg-elevated hover:text-accent hover:border-accent hover:shadow-cta-lg active:scale-100",
                )}
              >
                {bookLabel}
              </Button>
            )}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? closeMenuLabel : openMenuLabel}
              aria-expanded={open}
              aria-controls="topbar-menu"
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-md text-fg transition-all duration-150 ease-out hover:bg-bg-subtle active:scale-95 md:hidden",
                open && "bg-accent-soft text-accent",
              )}
            >
              {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="topbar-menu"
            role="dialog"
            aria-label={ariaLabel}
            className="absolute left-0 right-0 top-full z-40 mt-2 rounded-lg border border-border-subtle bg-bg-elevated/96 p-2 shadow-cta backdrop-blur-md backdrop-saturate-150 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {items.map((it) => {
                const isActive = activeKey === it.key;
                return (
                  <li key={it.key}>
                    <a
                      href={it.href ?? `#${it.key}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(it.key);
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center rounded-md px-4 text-base transition-colors duration-150",
                        isActive
                          ? "bg-accent-soft text-accent"
                          : "text-fg hover:bg-bg-subtle hover:text-accent",
                      )}
                    >
                      {it.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            {bookLabel && (
              <div className="mt-2 border-t border-border-subtle px-1 pt-2">
                <Button
                  onClick={() => {
                    onBook?.();
                    setOpen(false);
                  }}
                  className="h-12 w-full text-base font-medium shadow-cta"
                >
                  {bookLabel}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
