import { createLazyFileRoute } from "@tanstack/react-router";

import { Profile } from "../../pages/profile";

export const Route = createLazyFileRoute("/_app/profile")({
  component: Profile,
});
