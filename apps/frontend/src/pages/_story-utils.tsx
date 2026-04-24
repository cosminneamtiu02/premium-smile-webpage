import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Footer } from "@/shared/components/composite/footer/footer";
import { NavBar } from "@/shared/components/composite/nav-bar/nav-bar";

/**
 * Wraps a page component with the same layout shell the real app uses
 * (NavBar + main + Footer) and a memory router so <Link>s resolve.
 *
 * Lives in `src/pages/` because page stories are the only consumers.
 */
export function PageStoryShell({
  children,
  initialPath = "/en",
}: {
  children: ReactNode;
  initialPath?: `/en${string}` | `/ro${string}`;
}) {
  const rootRoute = createRootRoute({
    component: () => (
      <div className="flex min-h-dvh flex-col bg-bg text-fg">
        <NavBar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    ),
  });

  const langRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "$lang",
    component: () => <>{children}</>,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([langRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return <RouterProvider router={router} />;
}
