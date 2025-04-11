import { KanbanBoard } from "@components/Kanban.tsx";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_private/")({
  component: () => <KanbanBoard />,
});
