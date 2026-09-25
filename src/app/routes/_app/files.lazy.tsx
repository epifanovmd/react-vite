import { FilesPage } from "@pages/files";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/files")({
  component: FilesPage,
});
