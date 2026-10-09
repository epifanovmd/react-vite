import { NodeDetailPage } from "@pages/node-detail";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/nodes/$nodeId")({
  component: NodeDetailPage,
});
