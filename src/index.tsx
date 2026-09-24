import "./app/styles/index.css";

import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app/App";
import { registerContainerModules } from "./app/app.module";
import { handleSkippedViewTransitions } from "./app/view-transitions";

setDefaultOptions({ locale: ru });

registerContainerModules();
handleSkippedViewTransitions();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
