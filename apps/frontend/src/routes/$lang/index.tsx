import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/$lang/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{t("home.title")}</h2>
      <p className="text-gray-600">{t("home.tagline")}</p>
    </section>
  );
}
