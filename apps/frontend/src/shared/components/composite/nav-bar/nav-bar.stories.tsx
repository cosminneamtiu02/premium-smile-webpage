import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { NavBar } from "./nav-bar";

const meta: Meta<typeof NavBar> = {
  title: "Composite/NavBar",
  component: NavBar,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof NavBar>;

const rootRoute = createRootRoute({ component: () => <Outlet /> });
const langRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$lang",
  component: () => <NavBar />,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([langRoute]),
  history: createMemoryHistory({ initialEntries: ["/en"] }),
});

export const Default: Story = {
  render: () => <RouterProvider router={router} />,
};
