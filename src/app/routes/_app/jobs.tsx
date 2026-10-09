import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/jobs")({
  validateSearch: (search: { agent?: unknown }): { agent?: string } =>
    typeof search.agent === "string" && search.agent
      ? { agent: search.agent }
      : {},
});
