import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useCurrentLanguage } from "@/shared/hooks/use-current-language";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const lang = useCurrentLanguage();
  return <Navigate to="/$lang" params={{ lang }} replace />;
}
