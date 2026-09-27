import { Navigate } from "@tanstack/react-router";

import { DEFAULT_SECTION } from "../model";

/** `/ui` без раздела ведёт на первый раздел сайдбара. */
export const UiKitIndexRedirect = () => (
  <Navigate to="/ui/$section" params={{ section: DEFAULT_SECTION }} replace />
);
