import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { LoginPage } from "../../../pages/login/Login";

export const Route = createFileRoute("/_public/auth/")({
  component: () => <LoginPage />,
});
