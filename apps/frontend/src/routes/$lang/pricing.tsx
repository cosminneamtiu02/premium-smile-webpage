import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "@/pages/pricing/pricing-page";

export const Route = createFileRoute("/$lang/pricing")({
  component: PricingPage,
});
