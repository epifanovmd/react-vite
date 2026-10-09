import { NodesPage } from "@pages/nodes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/nodes/")({
  component: NodesPage,
});
