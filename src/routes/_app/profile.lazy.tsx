import { createLazyFileRoute } from "@tanstack/react-router";

import { Profile } from "../../user/pages";

export const Route = createLazyFileRoute("/_app/profile")({
  component: Profile,
});
