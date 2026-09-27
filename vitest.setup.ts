import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

import { applyZodLocale } from "./src/shared/lib/validation/zod-locale";

(globalThis as { __TEST_RUNTIME__?: typeof vi }).__TEST_RUNTIME__ = vi;

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

globalThis.ResizeObserver = ResizeObserverMock;

// Сообщения Zod — как у пользователя (русская локаль приложения).
applyZodLocale();

afterEach(() => {
  cleanup();
});
