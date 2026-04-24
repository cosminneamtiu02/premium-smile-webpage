import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Footer } from "@/shared/components/composite/footer/footer";
import { NavBar } from "@/shared/components/composite/nav-bar/nav-bar";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <a href="#main-content" className="skip-link">
        {t("a11y.skip_to_content")}
      </a>
      <NavBar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
