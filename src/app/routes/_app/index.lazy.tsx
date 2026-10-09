import { HomePage } from "@pages/home";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/")({
  component: HomePage,
});
