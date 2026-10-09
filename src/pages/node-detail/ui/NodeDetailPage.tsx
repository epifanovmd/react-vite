import { useParams } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { NodeDetail } from "./NodeDetail";

/** Маршрут узла: другой узел — новое состояние страницы, без данных прежнего. */
export const NodeDetailPage: FC = observer(() => {
  const { nodeId } = useParams({ from: "/_app/nodes/$nodeId" });

  return <NodeDetail key={nodeId} nodeId={nodeId} />;
});
