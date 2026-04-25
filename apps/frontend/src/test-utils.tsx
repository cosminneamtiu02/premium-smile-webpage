import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { type RenderOptions, render } from "@testing-library/react";
import i18n from "i18next";
import type { ReactElement, ReactNode } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/i18n/config";
import enCommon from "@/i18n/locales/en/common.json";
import roCommon from "@/i18n/locales/ro/common.json";
import { Footer } from "@/shared/components/composite/footer/footer";
import { NavBar } from "@/shared/components/composite/nav-bar/nav-bar";

const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
    ro: { common: roCommon },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  defaultNS: "common",
  ns: ["common"],
  interpolation: { escapeValue: false },
});

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Render a component that needs router context (e.g. anything using TanStack
 * Router's `<Link>`). Provides a memory router with the given initial path.
 */
export function renderWithRouter(ui: ReactNode, options: { initialPath?: string } = {}) {
  const { initialPath = "/en" } = options;

  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const wildcardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "$",
    component: () => <>{ui}</>,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([wildcardRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return render(<RouterProvider router={router} />, { wrapper: AllProviders });
}

/**
 * Render a page wrapped in the real layout shell (NavBar + main + Footer)
 * inside a memory router. Use for page-level a11y tests so axe sees the
 * whole user-facing surface, including landmarks.
 */
export function renderPageWithLayout(page: ReactNode, initialPath = "/en") {
  const rootRoute = createRootRoute({
    component: () => (
      <div className="flex min-h-dvh flex-col bg-bg text-fg">
        <NavBar />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    ),
  });

  const wildcardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "$",
    component: () => <>{page}</>,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([wildcardRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return render(<RouterProvider router={router} />, { wrapper: AllProviders });
}

export async function setTestLanguage(lang: string) {
  await testI18n.changeLanguage(lang);
}

export { testI18n };
