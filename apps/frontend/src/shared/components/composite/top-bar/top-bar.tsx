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
        // `w-[94%]` (instead of a pixel-capped max-width) gives the same
        // ~3% horizontal margin on every screen — the bar grows with the
        // viewport instead of plateauing at a desktop-style 1152 px cap.
        "pointer-events-none sticky top-4 z-50 mx-auto mt-4 h-0 w-[94%]",
        className,
      )}
    >
      <div className="pointer-events-auto relative">
        <div
          className={cn(
            "flex h-14 items-center justify-between gap-3 rounded-lg border border-border-subtle px-3 backdrop-blur-md backdrop-saturate-150 transition-[background-color,box-shadow] duration-300 ease-out sm:h-16 sm:px-5",
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
            className="inline-flex items-center rounded transition-opacity hover:opacity-90"
          >
            <Wordmark brandLabel={brandLabel} size={24} labelClassName="hidden sm:inline" />
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
                      "relative inline-flex h-10 items-center px-4 text-sm font-medium transition-colors duration-200 ease-out",
                      "after:pointer-events-none after:absolute after:bottom-2 after:left-4 after:right-4 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out after:content-['']",
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
                  "relative hidden h-10 px-5 text-sm font-medium shadow-cta hover:-translate-y-0.5 hover:shadow-cta-lg sm:h-11 sm:px-6 md:inline-flex",
                  // Sliding underline like the nav links — uses accent-fg
                  // (white) so it shows against the lavender button bg.
                  "after:pointer-events-none after:absolute after:bottom-2 after:left-5 after:right-5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent-fg after:transition-transform after:duration-300 after:ease-out after:content-['']",
                  "hover:after:scale-x-100",
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
                "inline-flex h-11 w-11 items-center justify-center rounded-md text-fg transition-all duration-150 ease-out hover:bg-bg-subtle active:scale-95 md:hidden",
                open && "bg-accent-soft text-accent",
              )}
            >
              {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
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
