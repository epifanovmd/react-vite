import { UiKitIndexRedirect } from "@pages/ui-kit-demo";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/ui/")({
  component: UiKitIndexRedirect,
});
