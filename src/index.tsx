import "./styles/index.scss";
import "./styles/tailwind.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "@theme";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { initLocalization } from "./localization";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const lang = localStorage.getItem("i18nextLng");

initLocalization({ initLang: lang ?? undefined }).finally();

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingMinMs: 500,
  defaultPendingComponent: () => (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
      }}
    >
      Loading...
    </div>
  ),
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
