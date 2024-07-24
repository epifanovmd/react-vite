import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { PostsPage } from "../../pages/posts/Posts";

export const Route = createFileRoute("/_private/")({
  component: () => <PostsPage />,
});
