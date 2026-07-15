import { createLazyFileRoute } from "@tanstack/react-router";

import { TablePage } from "../../pages/table";

export const Route = createLazyFileRoute("/_app/table")({
  component: TablePage,
});
