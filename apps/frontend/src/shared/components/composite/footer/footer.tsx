import { Phone } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Wordmark } from "@/shared/components/composite/wordmark/wordmark";
import { Container } from "@/shared/components/ui/container/container";
import { IconButton } from "@/shared/components/ui/icon-button/icon-button";
import { RichText } from "@/shared/components/ui/rich-text/rich-text";
import { cn } from "@/shared/lib/cn";

const NAV_LINKS = [
  { key: "home", href: "#home" },
  { key: "pricing", href: "#pricing" },
  { key: "blog", href: "#blog" },
] as const;

// Hours rows: each weekday name maps to one of three values. Splitting day
// from value lets translators reuse the value keys without rewriting them
// per-day, and keeps the JSX a tight `.map()`.
const HOURS_ROWS = [
  { day: "mon", value: "weekday" },
  { day: "tue", value: "weekday" },
  { day: "wed", value: "weekday" },
  { day: "thu", value: "weekday" },
  { day: "fri", value: "weekday" },
  { day: "sat", value: "saturday" },
  { day: "sun", value: "sunday" },
] as const;

// External legal links required for Romanian businesses.
const ANPC_ODR_URL = "https://ec.europa.eu/consumers/odr/main/index.cfm";
const ANPC_SAL_URL = "https://anpc.ro/ce-este-sal/";

// Drop the ANPC logo image at:
//   apps/frontend/public/anpc-logo.png
// The Footer references it as `/anpc-logo.png`. If the file is missing
// the <img> hides itself via onError so the link still works as text-only.
const ANPC_LOGO_SRC = "/anpc-logo.png";

const SOCIAL_LINKS = [
  {
    key: "instagram" as const,
    href: "https://instagram.com/premiumsmile",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    key: "tiktok" as const,
    href: "https://tiktok.com/@premiumsmile",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.36a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.79z" />
      </svg>
    ),
  },
];

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const phone = t("footer.phone");
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  // Hide the ANPC logo gracefully when the file isn't on disk yet.
  const [anpcLogoLoaded, setAnpcLogoLoaded] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer role="contentinfo" className="border-t border-border-subtle bg-bg-subtle">
      <Container width="lg">
        {/* Row 1 — logo only, centered */}
        <div className="flex justify-center py-8 sm:py-10">
          <Wordmark size={32} brandLabel={t("app_name")} />
        </div>

        {/* Row 2 — four columns, separated from row 1 by a thin line.
         * Col 2 gets 0.6fr because its nav list is short — leaving it at
         * 1fr would create a wide dead-zone of whitespace beside the
         * Premium Smile header. The narrower col 2 evens the visual gaps
         * between adjacent columns. */}
        <div className="grid gap-8 border-t border-border-subtle py-10 sm:py-12 md:grid-cols-2 lg:grid-cols-[1fr_0.6fr_1fr_1fr]">
          {/* Col 1 — motto + contact label + clickable phone */}
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-fg-muted">{t("footer.tagline")}</p>
            <div className="flex flex-col gap-2">
              <p className="text-sm leading-relaxed text-fg-muted">{t("footer.contact_label")}:</p>
              <a
                href={phoneHref}
                className="group inline-flex items-center gap-2 self-start text-base font-medium text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Phone
                  size={20}
                  aria-hidden
                  className="text-fg-muted transition-colors duration-200 ease-out group-hover:text-accent group-focus-visible:text-accent"
                />
                <span>{phone}</span>
              </a>
            </div>
          </div>

          {/* Col 2 — brand + nav links that highlight on hover */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base text-fg-muted sm:text-lg">{t("app_name")}</h3>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="text-sm text-fg-muted transition-colors duration-150 hover:text-accent"
                  >
                    {t(`nav.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — ANPC required-by-law links. Both buttons share the
           * same w-full + min-h so they read as a matched pair, and use
           * a strong outlined-accent treatment that fills on hover. */}
          <div className="flex flex-col gap-3">
            <a
              href={ANPC_ODR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full min-h-14 items-center justify-center gap-3 rounded-md border-2 border-accent bg-bg-elevated px-4 py-3 text-center text-sm font-medium text-accent shadow-cta transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent hover:text-accent-fg hover:shadow-cta-lg lg:w-56"
            >
              {/* The span makes RichText a single flex child so the
               * flex `gap-3` only applies between the (absent) image and
               * the text — never between the bold word and the rest. */}
              <span>
                <RichText value={t("footer.anpc_online")} boldClassName="font-bold text-current" />
              </span>
            </a>
            <a
              href={ANPC_SAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full min-h-14 items-center justify-center gap-3 rounded-md border-2 border-accent bg-bg-elevated px-4 py-3 text-center text-sm font-medium text-accent shadow-cta transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent hover:text-accent-fg hover:shadow-cta-lg lg:w-56"
            >
              {anpcLogoLoaded && (
                <img
                  src={ANPC_LOGO_SRC}
                  alt={t("footer.anpc_logo_alt")}
                  className="h-9 w-auto shrink-0"
                  loading="lazy"
                  decoding="async"
                  onError={() => setAnpcLogoLoaded(false)}
                />
              )}
              <span>{t("footer.anpc_alt")}</span>
            </a>
          </div>

          {/* Col 4 — working hours: per-day rows with day name (left) and
           * hours value (right). Sunday is dimmed slightly because the
           * clinic is closed — visually quieter than the open days.
           *
           * The `lg:mx-auto lg:w-[200px]` lives on the COLUMN WRAPPER (not
           * the dl) so the `<h3>` and the day rows share the same 200px
           * block — title and rows align to the same left edge. */}
          <div className="flex flex-col gap-3 lg:mx-auto lg:w-[200px]">
            <h3 className="text-base text-fg-muted sm:text-lg">{t("footer.hours_title")}:</h3>
            <dl className="flex flex-col gap-2 text-sm text-fg-muted">
              {HOURS_ROWS.map(({ day, value }) => (
                <div
                  key={day}
                  className={cn(
                    "flex items-baseline justify-between gap-4",
                    value === "sunday" && "opacity-60",
                  )}
                >
                  <dt>{t(`footer.hours_${day}`)}</dt>
                  <dd>{t(`footer.hours_value_${value}`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Row 3 — copyright (left), back-to-top (centre), socials (right).
         * Three equal columns at sm+ so the back-to-top sits perfectly
         * centred. Mobile stacks all three. */}
        <div className="grid grid-cols-1 gap-4 border-t border-border-subtle py-6 sm:grid-cols-3 sm:items-center sm:py-8">
          <p className="text-center text-xs text-fg-muted sm:text-left">
            {t("footer.copyright", { year })}
          </p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="text-sm text-fg-muted transition-colors duration-150 hover:text-accent"
            >
              {t("footer.back_to_top")}
            </button>
          </div>
          <div className="flex justify-center gap-3 sm:justify-end">
            {SOCIAL_LINKS.map(({ key, href, icon }) => (
              <IconButton
                key={key}
                href={href}
                external
                label={t(`footer.social_${key}_label`)}
                icon={icon}
                size="md"
              />
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
