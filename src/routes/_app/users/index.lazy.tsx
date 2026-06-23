import { createLazyFileRoute } from "@tanstack/react-router";

import { UsersList } from "../../../pages/users";

export const Route = createLazyFileRoute("/_app/users/")({
  component: UsersList,
});
