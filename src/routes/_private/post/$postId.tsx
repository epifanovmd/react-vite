import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { PostPage } from "../../../pages/post/Post";

export const Route = createFileRoute("/_private/post/$postId")({
  component: () => <PostPage />,
});
