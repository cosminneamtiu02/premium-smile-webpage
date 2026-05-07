import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/pages/team/team-page";

export const Route = createFileRoute("/$lang/team")({
  component: TeamPage,
});
