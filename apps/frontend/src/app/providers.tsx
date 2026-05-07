import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { BodyOverlayScrollbar } from "@/app/body-overlay-scrollbar";
import i18n from "@/i18n/config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 3,
    },
  },
});

/** Mirrors the active i18n language onto `<html lang>` so screen readers
 *  and CSS `:lang()` selectors see the right value. The previous
 *  ThemeProvider also set `data-theme`; we don't need that any more —
 *  there is only one theme and it lives at `:root` in CSS. */
function LangSync({ children }: { children: React.ReactNode }) {
  const { i18n: instance } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute("lang", instance.language);
  }, [instance.language]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BodyOverlayScrollbar />
        <LangSync>{children}</LangSync>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
