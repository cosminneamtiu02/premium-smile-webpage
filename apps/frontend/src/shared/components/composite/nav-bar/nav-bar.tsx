import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/shared/components/composite/language-switcher/language-switcher";
import { ThemeToggle } from "@/shared/components/composite/theme-toggle/theme-toggle";
import { Container } from "@/shared/components/ui/container/container";
import { useCurrentLanguage } from "@/shared/hooks/use-current-language";
import { cn } from "@/shared/lib/cn";

const NAV_KEYS = ["home", "pricing", "blog"] as const;

const PATHS: Record<(typeof NAV_KEYS)[number], "/$lang" | "/$lang/pricing" | "/$lang/blog"> = {
  home: "/$lang",
  pricing: "/$lang/pricing",
  blog: "/$lang/blog",
};

export function NavBar() {
  const { t } = useTranslation();
  const lang = useCurrentLanguage();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-elevated/95 backdrop-blur">
      <Container as="nav" aria-label={t("nav.primary")}>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/$lang"
            params={{ lang }}
            className="text-lg font-semibold text-fg hover:text-accent"
          >
            {t("app_name")}
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {NAV_KEYS.map((key) => (
              <li key={key}>
                <Link
                  to={PATHS[key]}
                  params={{ lang }}
                  className={cn(
                    "text-sm font-medium text-fg transition-colors hover:text-accent",
                    pathname === `/${lang}${PATHS[key].replace("/$lang", "")}` && "text-accent",
                  )}
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded text-fg hover:bg-bg-subtle md:hidden"
              aria-label={open ? t("nav.close_menu") : t("nav.open_menu")}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>

        {open && (
          <ul id="mobile-nav" className="flex flex-col gap-1 border-t border-border py-3 md:hidden">
            {NAV_KEYS.map((key) => (
              <li key={key}>
                <Link
                  to={PATHS[key]}
                  params={{ lang }}
                  onClick={() => setOpen(false)}
                  className="block rounded px-3 py-2 text-base font-medium text-fg hover:bg-bg-subtle"
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </header>
  );
}
