import { createLazyFileRoute } from "@tanstack/react-router";

import { UIPage } from "../pages/ui";

export const Route = createLazyFileRoute("/ui")({
  component: UIPage,
});
