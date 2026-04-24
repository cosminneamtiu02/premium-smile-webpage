import { createFileRoute } from "@tanstack/react-router";
import { BlogPage } from "@/pages/blog/blog-page";

export const Route = createFileRoute("/$lang/blog")({
  component: BlogPage,
});
