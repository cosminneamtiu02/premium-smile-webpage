import { createRootRoute, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FloatingBookCta } from "@/shared/components/composite/floating-book-cta/floating-book-cta";
import { Footer } from "@/shared/components/composite/footer/footer";
import { TopBar, type TopBarItem } from "@/shared/components/composite/top-bar/top-bar";
import { useCurrentLanguage } from "@/shared/hooks/use-current-language";

export const Route = createRootRoute({
  component: RootLayout,
});

const NAV_KEYS = ["home", "pricing", "blog"] as const;
type NavKey = (typeof NAV_KEYS)[number];

function pathFor(key: NavKey, lang: string) {
  switch (key) {
    case "home":
      return `/${lang}`;
    case "pricing":
      return `/${lang}/pricing`;
    case "blog":
      return `/${lang}/blog`;
  }
}

function RootLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useCurrentLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items: TopBarItem[] = NAV_KEYS.map((key) => ({
    key,
    label: t(`nav.${key}`),
    href: pathFor(key, lang),
  }));

  const activeKey = NAV_KEYS.find((key) => pathname === pathFor(key, lang)) ?? "home";

  const handleNavigate = (key: string) => {
    if ((NAV_KEYS as ReadonlyArray<string>).includes(key)) {
      router.navigate({ to: pathFor(key as NavKey, lang) });
    }
  };

  // The booking action defaults to a phone call — same number the Footer
  // exposes. Both the TopBar's Book Now and the floating CTA share this so
  // the user can dial from anywhere on the page.
  const phoneHref = `tel:${t("footer.phone").replace(/\s/g, "")}`;
  const handleBook = () => {
    window.location.href = phoneHref;
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <a href="#main-content" className="skip-link">
        {t("a11y.skip_to_content")}
      </a>
      <TopBar
        items={items}
        activeKey={activeKey}
        bookLabel={t("book_cta.label")}
        onBook={handleBook}
        onNavigate={handleNavigate}
      />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingBookCta href={phoneHref} />
    </div>
  );
}
