import { createLazyFileRoute } from "@tanstack/react-router";

import { Profile } from "../../domains/user/pages";

export const Route = createLazyFileRoute("/_app/profile")({
  component: Profile,
});
