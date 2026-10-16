import "./app/styles/index.css";

import { applyZodLocale } from "@shared/lib/validation";
import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app/App";
import { registerContainerModules } from "./app/app.module";
import { clearDevPerformanceEntries } from "./app/dev-performance";
import { handleSkippedViewTransitions } from "./app/view-transitions";

/** Ключ sessionStorage: время последней перезагрузки из-за чанка. */
const PRELOAD_RELOAD_KEY = "app:preload-reload-at";
/** Окно, в котором повторная ошибка чанка не перезагружает страницу снова. */
const PRELOAD_RELOAD_WINDOW_MS = 10_000;

/**
 * Отмечает перезагрузку из-за чанка; false — перезагружаться нельзя: она уже
 * была недавно и не помогла, или sessionStorage недоступен (нет защиты от цикла).
 */
const markPreloadReload = (): boolean => {
  try {
    const at = Number(sessionStorage.getItem(PRELOAD_RELOAD_KEY));

    if (Date.now() - at < PRELOAD_RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, String(Date.now()));

    return true;
  } catch {
    return false;
  }
};

/** После деплоя старые чанки отдают 404: перезагрузка подтягивает новую сборку. */
const handlePreloadErrors = () => {
  window.addEventListener("vite:preloadError", event => {
    if (!markPreloadReload()) return;

    event.preventDefault();
    window.location.reload();
  });
};

setDefaultOptions({ locale: ru });
applyZodLocale();

registerContainerModules();
handleSkippedViewTransitions();
handlePreloadErrors();
clearDevPerformanceEntries();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
