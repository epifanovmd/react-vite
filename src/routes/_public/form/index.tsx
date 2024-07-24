import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { FormPage } from "../../../pages/form/FormPage";

export const Route = createFileRoute("/_public/form/")({
  component: () => <FormPage />,
});
